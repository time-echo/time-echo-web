import { ICapsuleRepository } from "./ICapsuleRepository";
import {
  Letter,
  CreateLetterInput,
  UpdateRealityInput,
  Prediction,
  EmotionalSnapshot,
} from "@/types/timeecho";

/**
 * Standard structured API Error thrown on HTTP 4xx / 5xx responses.
 */
export class ApiError extends Error {
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
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface RawLetterResponse {
  id: string | number;
  docket_number?: string;
  docketNumber?: string;
  title: string;
  content: string;
  email: string;
  scheduled_at?: string;
  scheduledAt?: string;
  delivered_at?: string | null;
  deliveredAt?: string | null;
  opened_at?: string | null;
  openedAt?: string | null;
  queued_at?: string | null;
  queuedAt?: string | null;
  status: string;
  language?: string;
  timezone?: string;
  reveal_happiness?: number | null;
  revealHappiness?: number | null;
  reveal_anxiety?: number | null;
  revealAnxiety?: number | null;
  reveal_motivation?: number | null;
  revealMotivation?: number | null;
  is_wax_broken?: boolean;
  isWaxBroken?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  emotional_snapshot?: any;
  emotionalSnapshot?: any;
  predictions?: any[];
}

export interface HttpApiRepositoryOptions {
  baseUrl?: string;
  getToken?: () => string | null;
  getLocale?: () => string;
}

/**
 * 🌐 HttpApiRepository
 *
 * REST API Adapter for TimeEcho conforming to `ICapsuleRepository`.
 * Communicates with the Rails API (`/api/v1/*`) or local mock handlers:
 * - Automatically unwraps `{ data: T, meta: M }` response envelopes.
 * - Translates standardized API errors (`{ error: { code, message, details } }`).
 * - Attaches `Authorization: Bearer <token>`, `X-Session-Token`, and `X-Locale` headers.
 * - Sets `credentials: "include"` for cross-origin session cookie handling.
 */
export class HttpApiRepository implements ICapsuleRepository {
  private baseUrl: string;
  private customGetToken?: () => string | null;
  private customGetLocale?: () => string;

  constructor(options?: HttpApiRepositoryOptions | string) {
    if (typeof options === "string") {
      this.baseUrl = options;
    } else {
      this.baseUrl =
        options?.baseUrl ||
        (typeof process !== "undefined"
          ? process.env.NEXT_PUBLIC_API_URL
          : "") ||
        "http://localhost:3000/api/v1";
      this.customGetToken = options?.getToken;
      this.customGetLocale = options?.getLocale;
    }
  }

  /**
   * Retrieves active session token from configured callback or localStorage.
   */
  private resolveToken(): string | null {
    if (this.customGetToken) {
      return this.customGetToken();
    }
    if (typeof window !== "undefined") {
      try {
        return window.localStorage.getItem("timeecho_session_token");
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Retrieves current language code for X-Locale header.
   */
  private resolveLocale(): string {
    if (this.customGetLocale) {
      return this.customGetLocale();
    }
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem("timeecho_locale");
        if (saved) return saved;
      } catch {
        // ignore
      }
      if (document.documentElement.lang) {
        return document.documentElement.lang;
      }
    }
    return "es";
  }

  private mapResponseToDomain(data: RawLetterResponse): Letter {
    const docketNumber =
      data.docketNumber ||
      data.docket_number ||
      `TE-${String(data.id).padStart(5, "0")}`;

    const rawSnap = data.emotionalSnapshot || data.emotional_snapshot;
    const emotionalSnapshot: EmotionalSnapshot | null = rawSnap
      ? {
          id: rawSnap.id ? String(rawSnap.id) : undefined,
          letterId: String(data.id),
          happinessLevel:
            rawSnap.happinessLevel ?? rawSnap.happiness_level ?? 5,
          anxietyLevel: rawSnap.anxietyLevel ?? rawSnap.anxiety_level ?? 5,
          motivationLevel:
            rawSnap.motivationLevel ?? rawSnap.motivation_level ?? 5,
          createdAt: rawSnap.createdAt || rawSnap.created_at,
          updatedAt: rawSnap.updatedAt || rawSnap.updated_at,
        }
      : null;

    const rawPredictions = data.predictions || [];
    const predictions: Prediction[] = rawPredictions.map((p) => {
      const isMatched = p.matched !== undefined ? p.matched : null;
      let outcome = p.outcome;
      if (!outcome && isMatched !== null) {
        outcome = isMatched ? "fulfilled" : "diverged";
      }

      return {
        id: String(p.id),
        letterId: String(data.id),
        category: p.category,
        prediction: p.prediction,
        reality: p.reality ?? null,
        matched: isMatched,
        outcome: outcome || "pending",
        createdAt: p.createdAt || p.created_at,
        updatedAt: p.updatedAt || p.updated_at,
      };
    });

    const isWaxBroken = Boolean(
      data.isWaxBroken ?? data.is_wax_broken ?? data.openedAt ?? data.opened_at,
    );

    return {
      id: String(data.id),
      docketNumber,
      title: data.title,
      content: data.content,
      email: data.email,
      scheduledAt:
        data.scheduledAt || data.scheduled_at || new Date().toISOString(),
      deliveredAt: data.deliveredAt ?? data.delivered_at ?? null,
      openedAt: data.openedAt ?? data.opened_at ?? null,
      queuedAt: data.queuedAt ?? data.queued_at ?? null,
      status: (data.status as Letter["status"]) || "pending",
      language: (data.language as Letter["language"]) || "es",
      timezone: data.timezone || "UTC",
      revealHappiness: data.revealHappiness ?? data.reveal_happiness ?? null,
      revealAnxiety: data.revealAnxiety ?? data.reveal_anxiety ?? null,
      revealMotivation: data.revealMotivation ?? data.reveal_motivation ?? null,
      isWaxBroken,
      createdAt: data.createdAt || data.created_at || new Date().toISOString(),
      updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
      emotionalSnapshot,
      predictions,
    };
  }

  /**
   * Executes HTTP request with envelope unwrapping and standardized error extraction.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.resolveToken();
    const locale = this.resolveLocale();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Locale": locale,
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["X-Session-Token"] = token;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      let errorData: any = null;
      try {
        errorData = await res.json();
      } catch {
        const errorText = await res.text().catch(() => "");
        errorData = { message: errorText || res.statusText };
      }

      if (errorData?.error && typeof errorData.error === "object") {
        throw new ApiError(
          res.status,
          errorData.error.code || "api_error",
          errorData.error.message || `Request failed with status ${res.status}`,
          errorData.error.details,
          errorData.error.requestId,
        );
      }

      const fallbackMsg =
        typeof errorData?.error === "string"
          ? errorData.error
          : errorData?.message || `HTTP ${res.status} on ${endpoint}`;

      throw new ApiError(
        res.status,
        res.status === 401 ? "unauthorized" : "request_failed",
        fallbackMsg,
      );
    }

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as unknown as T;
    }

    const json = await res.json();

    // Standard envelope unwrapping: if payload contains { data: T }, return data
    if (json && typeof json === "object" && "data" in json) {
      return json.data as T;
    }

    return json as T;
  }

  async getAll(params?: {
    status?: string;
    page?: number;
    perPage?: number;
  }): Promise<Letter[]> {
    const queryParts: string[] = [];
    if (params?.status) {
      queryParts.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params?.page) {
      queryParts.push(`page=${encodeURIComponent(params.page)}`);
    }
    if (params?.perPage) {
      queryParts.push(`perPage=${encodeURIComponent(params.perPage)}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const data = await this.request<RawLetterResponse[]>(
      `/letters${queryString}`,
    );
    return Array.isArray(data)
      ? data.map((item) => this.mapResponseToDomain(item))
      : [];
  }

  async getById(id: string): Promise<Letter | null> {
    try {
      const data = await this.request<RawLetterResponse>(
        `/letters/${encodeURIComponent(id)}`,
      );
      return data ? this.mapResponseToDomain(data) : null;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return null;
      }
      console.warn(
        `[HttpApiRepository] Capsule ${id} not found or request failed:`,
        err,
      );
      return null;
    }
  }

  async create(input: CreateLetterInput): Promise<Letter> {
    const payload = {
      letter: {
        title: input.title,
        content: input.content,
        email: input.email,
        scheduled_at: input.scheduledAt,
        deliver_at: input.scheduledAt,
        language: input.language || this.resolveLocale() || "es",
        timezone: input.timezone || "UTC",
        emotional_snapshot_attributes: {
          happiness_level: input.emotionalSnapshot.happinessLevel,
          anxiety_level: input.emotionalSnapshot.anxietyLevel,
          motivation_level: input.emotionalSnapshot.motivationLevel,
        },
        predictions_attributes: input.predictions.map((p) => ({
          category: p.category,
          prediction: p.prediction,
        })),
      },
    };

    const data = await this.request<RawLetterResponse>("/letters", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return this.mapResponseToDomain(data);
  }

  async updateReality(input: UpdateRealityInput): Promise<Letter> {
    const payload = {
      reveal_happiness: input.revealHappiness,
      reveal_anxiety: input.revealAnxiety,
      reveal_motivation: input.revealMotivation,
      opened_at: input.openedAt || new Date().toISOString(),
      is_wax_broken: input.isWaxBroken ?? true,
      predictions: input.predictions?.map((p) => ({
        id: p.id,
        reality: p.reality,
        matched: p.matched,
      })),
    };

    const data = await this.request<RawLetterResponse>(
      `/letters/${encodeURIComponent(input.id)}/predictions`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return this.mapResponseToDomain(data);
  }

  async archive(id: string): Promise<Letter> {
    const data = await this.request<RawLetterResponse>(
      `/letters/${encodeURIComponent(id)}/archive`,
      {
        method: "POST",
      },
    );

    return this.mapResponseToDomain(data);
  }

  async restore(id: string): Promise<Letter> {
    const data = await this.request<RawLetterResponse>(
      `/letters/${encodeURIComponent(id)}/restore`,
      {
        method: "POST",
      },
    );

    return this.mapResponseToDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.request<void>(`/letters/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }
}
