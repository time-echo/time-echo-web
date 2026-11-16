import "server-only";
import { cookies, headers } from "next/headers";

export const SESSION_COOKIE_NAME = "timeecho_session_token";
export const LOCALE_COOKIE_NAME = "timeecho_locale";

export interface BackendRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  body?: unknown;
  token?: string | null;
  locale?: string | null;
  timeoutMs?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export interface BackendResponse<T = unknown> {
  status: number;
  ok: boolean;
  data: T;
  headers: Headers;
}

export class BackendClientError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, string[]>;
  public requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, string[]>,
    requestId?: string,
  ) {
    super(message);
    this.name = "BackendClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
    Object.setPrototypeOf(this, BackendClientError.prototype);
  }
}

function getBackendBaseUrl(): string {
  const url =
    process.env.BACKEND_API_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:3000/api/v1";
  return url.replace(/\/+$/, "");
}

/**
 * Builds a query string from a params object, filtering out null/undefined.
 */
function buildQueryString(
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Centralized server-side client responsible for secure backend communication.
 * Can ONLY be executed server-side.
 */
export async function backendFetch<T = unknown>(
  endpoint: string,
  options: BackendRequestOptions = {},
): Promise<BackendResponse<T>> {
  const baseUrl = getBackendBaseUrl();
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  // SSRF prevention: prevent path traversal or absolute URLs breaking out
  if (
    normalizedEndpoint.includes("://") ||
    normalizedEndpoint.startsWith("//")
  ) {
    throw new BackendClientError(
      400,
      "invalid_endpoint",
      "Invalid backend endpoint",
    );
  }

  const queryString = buildQueryString(options.params);
  const targetUrl = `${baseUrl}${normalizedEndpoint}${queryString}`;

  // Resolve session token: explicit override -> cookies()
  let sessionToken = options.token;
  if (sessionToken === undefined) {
    try {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
    } catch {
      sessionToken = null;
    }
  }

  // Resolve locale: explicit override -> cookies() -> headers() -> default 'es'
  let activeLocale = options.locale;
  if (!activeLocale) {
    try {
      const cookieStore = await cookies();
      activeLocale =
        cookieStore.get(LOCALE_COOKIE_NAME)?.value ||
        cookieStore.get("NEXT_LOCALE")?.value ||
        null;
    } catch {
      activeLocale = null;
    }
  }
  if (!activeLocale) {
    try {
      const headerStore = await headers();
      activeLocale = headerStore.get("x-locale") || null;
    } catch {
      activeLocale = null;
    }
  }
  if (!activeLocale || (activeLocale !== "en" && activeLocale !== "es")) {
    activeLocale = "es";
  }

  // Construct request headers
  const reqHeaders = new Headers(options.headers || {});
  reqHeaders.set("Accept", "application/json");
  reqHeaders.set("X-Locale", activeLocale);
  reqHeaders.set("Accept-Language", activeLocale);

  if (sessionToken) {
    reqHeaders.set("Authorization", `Bearer ${sessionToken}`);
    reqHeaders.set("X-Session-Token", sessionToken);
  }

  // Handle request body (JSON, FormData, URLSearchParams, or raw string/buffer)
  let bodyContent: BodyInit | undefined = undefined;
  if (options.body !== undefined && options.body !== null) {
    if (typeof FormData !== "undefined" && options.body instanceof FormData) {
      bodyContent = options.body;
      // Do not set Content-Type header manually for FormData; fetch will set multipart/form-data boundary
      reqHeaders.delete("Content-Type");
    } else if (
      typeof URLSearchParams !== "undefined" &&
      options.body instanceof URLSearchParams
    ) {
      bodyContent = options.body;
      if (!reqHeaders.has("Content-Type")) {
        reqHeaders.set(
          "Content-Type",
          "application/x-www-form-urlencoded;charset=UTF-8",
        );
      }
    } else if (
      typeof options.body === "string" ||
      options.body instanceof Blob ||
      options.body instanceof ArrayBuffer
    ) {
      bodyContent = options.body as BodyInit;
      if (!reqHeaders.has("Content-Type")) {
        reqHeaders.set("Content-Type", "application/json");
      }
    } else {
      bodyContent = JSON.stringify(options.body);
      if (!reqHeaders.has("Content-Type")) {
        reqHeaders.set("Content-Type", "application/json");
      }
    }
  }

  const timeoutMs = options.timeoutMs ?? 15000;
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: options.method || "GET",
      headers: reqHeaders,
      body: bodyContent,
      signal: timeoutSignal,
      cache: options.cache,
      next: options.next,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new BackendClientError(
        504,
        "gateway_timeout",
        "The upstream service timed out.",
      );
    }
    throw new BackendClientError(
      502,
      "bad_gateway",
      "Unable to connect to the upstream service.",
    );
  }

  const status = response.status;
  const isNoContent =
    status === 204 || response.headers.get("content-length") === "0";

  let parsedData: unknown = null;
  if (!isNoContent) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        parsedData = await response.json();
      } catch {
        parsedData = null;
      }
    } else {
      parsedData = await response.text();
    }
  }

  if (!response.ok) {
    interface RawErrorResponse {
      error?:
        | {
            code?: string;
            message?: string;
            details?: Record<string, string[]>;
            requestId?: string;
          }
        | string;
      message?: string;
    }

    const errorPayload = parsedData as RawErrorResponse | null;
    let errorCode = "upstream_error";
    let errorMessage = `Upstream request failed with status ${status}`;
    let errorDetails: Record<string, string[]> | undefined = undefined;
    let requestId: string | undefined = undefined;

    if (errorPayload?.error && typeof errorPayload.error === "object") {
      errorCode = errorPayload.error.code || errorCode;
      errorMessage = errorPayload.error.message || errorMessage;
      errorDetails = errorPayload.error.details;
      requestId = errorPayload.error.requestId;
    } else if (typeof errorPayload?.error === "string") {
      errorMessage = errorPayload.error;
    } else if (errorPayload?.message) {
      errorMessage = errorPayload.message;
    }

    if (status === 401) errorCode = "unauthorized";
    if (status === 403) errorCode = "forbidden";
    if (status === 404) errorCode = "not_found";

    throw new BackendClientError(
      status,
      errorCode,
      errorMessage,
      errorDetails,
      requestId,
    );
  }

  return {
    status,
    ok: response.ok,
    data: parsedData as T,
    headers: response.headers,
  };
}
