import { ICapsuleRepository } from "./ICapsuleRepository";
import {
  Letter,
  CreateLetterInput,
  UpdateRealityInput,
  Prediction,
  EmotionalSnapshot,
} from "@/types/timeecho";

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

/**
 * 🌐 HttpApiRepository
 *
 * REST API Adapter for TimeEcho.
 * Conforms to `ICapsuleRepository`, consuming either:
 * - Local Next.js Mock REST Route Handlers (`/api/letters/*`)
 * - Ruby on Rails backend (`${NEXT_PUBLIC_API_URL}/letters/*`)
 */
export class HttpApiRepository implements ICapsuleRepository {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : "") ||
      "/api";
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `[HttpApiRepository] HTTP ${res.status} on ${endpoint}: ${errorText}`,
      );
    }

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as unknown as T;
    }

    return res.json() as Promise<T>;
  }

  async getAll(): Promise<Letter[]> {
    const data = await this.request<RawLetterResponse[]>("/letters");
    return data.map((item) => this.mapResponseToDomain(item));
  }

  async getById(id: string): Promise<Letter | null> {
    try {
      const data = await this.request<RawLetterResponse>(
        `/letters/${encodeURIComponent(id)}`,
      );
      return this.mapResponseToDomain(data);
    } catch (err) {
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
        language: input.language || "es",
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
      opened_at: input.openedAt,
      is_wax_broken: input.isWaxBroken,
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
    await this.request<void>(
      `/letters/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  }
}
