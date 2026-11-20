import type { UtmParameters } from "./events";

const FORBIDDEN_PROPERTY_KEYS = new Set([
  "email",
  "user_email",
  "old_email",
  "new_email",
  "actor_email",
  "recipient_email",
  "name",
  "first_name",
  "last_name",
  "password",
  "token",
  "session_token",
  "magic_link_token",
  "authorization",
  "content",
  "title",
  "body",
  "prediction",
  "predictions",
  "prediction_city",
  "prediction_salary",
  "prediction_relationship",
  "prediction_career",
  "prediction_achievement",
  "prediction_happiness",
  "reality",
  "ip",
  "ip_address",
]);

const EMAIL_VALUE_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const UTM_KEYS: ReadonlyArray<keyof UtmParameters> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const UTM_STORAGE_KEY = "timeecho_utm_params";

let inMemoryUtmParams: UtmParameters = {};

function sanitizeSingleValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(EMAIL_VALUE_REGEX, "[REDACTED]");
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeSingleValue(item));
  }

  if (typeof value === "object") {
    return sanitizeAnalyticsProperties(value as Record<string, unknown>);
  }

  return String(value).replace(EMAIL_VALUE_REGEX, "[REDACTED]");
}

export function sanitizeAnalyticsProperties<T extends object>(
  properties?: T,
): Record<string, unknown> {
  if (!properties || typeof properties !== "object") {
    return {};
  }

  const sanitized: Record<string, unknown> = {};

  for (const [rawKey, rawValue] of Object.entries(properties)) {
    const normalizedKey = rawKey.trim();
    if (!normalizedKey) continue;
    if (FORBIDDEN_PROPERTY_KEYS.has(normalizedKey.toLowerCase())) continue;
    if (rawValue === undefined) continue;

    sanitized[normalizedKey] = sanitizeSingleValue(rawValue);
  }

  return sanitized;
}

export function sanitizeAnalyticsPath(pathname: string): string {
  const cleanPath = (pathname || "/").split("?")[0].split("#")[0] || "/";

  if (/^\/login\/[^/]+/.test(cleanPath)) {
    return "/login/[token]";
  }

  if (/^\/letters\/[^/]+\/reality/.test(cleanPath)) {
    return "/letters/[id]/reality";
  }

  if (
    /^\/letters\/[^/]+$/.test(cleanPath) &&
    cleanPath !== "/letters/new" &&
    cleanPath !== "/letters/success"
  ) {
    return "/letters/[id]";
  }

  return cleanPath;
}

export function isPrivateRoute(pathname: string): boolean {
  const cleanPath = (pathname || "/").split("?")[0];
  return (
    cleanPath.startsWith("/dashboard") ||
    cleanPath.startsWith("/letters") ||
    cleanPath.startsWith("/analytics") ||
    cleanPath.startsWith("/settings") ||
    cleanPath.startsWith("/login") ||
    cleanPath.startsWith("/check_email")
  );
}

export function sanitizeUserId(
  userId: string | null | undefined,
): string | null {
  if (!userId || typeof userId !== "string") return null;
  const trimmed = userId.trim();
  if (!trimmed) return null;
  if (trimmed.includes("@") || EMAIL_VALUE_REGEX.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function captureUtmParams(
  searchParams?: URLSearchParams | string | null,
): UtmParameters {
  let params: URLSearchParams | null = null;

  if (searchParams instanceof URLSearchParams) {
    params = searchParams;
  } else if (typeof searchParams === "string") {
    const normalized = searchParams.startsWith("?")
      ? searchParams.slice(1)
      : searchParams;
    params = new URLSearchParams(normalized);
  } else if (typeof window !== "undefined" && window.location?.search) {
    params = new URLSearchParams(window.location.search);
  }

  const extracted: UtmParameters = {};
  if (params) {
    for (const key of UTM_KEYS) {
      const val = params.get(key)?.trim();
      if (val && !EMAIL_VALUE_REGEX.test(val)) {
        extracted[key] = val.slice(0, 150);
      }
    }
  }

  if (Object.keys(extracted).length > 0) {
    inMemoryUtmParams = { ...inMemoryUtmParams, ...extracted };
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(
          UTM_STORAGE_KEY,
          JSON.stringify(inMemoryUtmParams),
        );
      } catch {}
    }
    return inMemoryUtmParams;
  }

  return getStoredUtmParams();
}

export function getStoredUtmParams(): UtmParameters {
  if (typeof window !== "undefined") {
    try {
      const saved = window.sessionStorage.getItem(UTM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, unknown>;
        const cleaned: UtmParameters = {};
        for (const key of UTM_KEYS) {
          const val = parsed[key];
          if (typeof val === "string" && val.trim()) {
            cleaned[key] = val.trim();
          }
        }
        inMemoryUtmParams = cleaned;
        return cleaned;
      }
    } catch {}
  }

  return { ...inMemoryUtmParams };
}

export function clearStoredUtmParamsForTests(): void {
  inMemoryUtmParams = {};
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(UTM_STORAGE_KEY);
    } catch {}
  }
}
