"use server";

import { backendFetch, BackendClientError } from "@/lib/server/backend-client";
import { CreateLetterInput, UpdateRealityInput } from "@/types/timeecho";

export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
      };
    };

export async function createLetterAction(
  input: CreateLetterInput,
): Promise<ActionResult<unknown>> {
  if (!input.title || !input.content || !input.email || !input.scheduledAt) {
    return {
      success: false,
      error: {
        code: "invalid_input",
        message: "Title, content, email, and scheduled date are required.",
      },
    };
  }

  const stampSlug = input.stamp_slug || input.stampId || undefined;
  const payload = {
    letter: {
      title: input.title,
      content: input.content,
      email: input.email,
      scheduled_at: input.scheduledAt,
      deliver_at: input.scheduledAt,
      language: input.language || "es",
      timezone: input.timezone || "UTC",
      stamp_slug: stampSlug,
      emotional_snapshot_attributes: {
        happiness_level: input.emotionalSnapshot?.happinessLevel ?? 5,
        anxiety_level: input.emotionalSnapshot?.anxietyLevel ?? 5,
        motivation_level: input.emotionalSnapshot?.motivationLevel ?? 5,
      },
      predictions_attributes:
        input.predictions?.map((p) => ({
          category: p.category,
          prediction: p.prediction,
        })) || [],
    },
  };

  try {
    const res = await backendFetch("/letters", {
      method: "POST",
      body: payload,
    });
    return { success: true, data: res.data };
  } catch (err) {
    if (err instanceof BackendClientError) {
      return {
        success: false,
        error: { code: err.code, message: err.message, details: err.details },
      };
    }
    return {
      success: false,
      error: {
        code: "internal_error",
        message:
          err instanceof Error ? err.message : "Failed to create letter.",
      },
    };
  }
}

export async function updateRealityAction(
  input: UpdateRealityInput,
): Promise<ActionResult<unknown>> {
  if (!input.id) {
    return {
      success: false,
      error: { code: "invalid_input", message: "Letter ID is required." },
    };
  }

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

  try {
    const res = await backendFetch(
      `/letters/${encodeURIComponent(input.id)}/predictions`,
      {
        method: "POST",
        body: payload,
      },
    );
    return { success: true, data: res.data };
  } catch (err) {
    if (err instanceof BackendClientError) {
      return {
        success: false,
        error: { code: err.code, message: err.message, details: err.details },
      };
    }
    return {
      success: false,
      error: {
        code: "internal_error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to update reality predictions.",
      },
    };
  }
}

export async function archiveLetterAction(
  id: string,
): Promise<ActionResult<unknown>> {
  if (!id) {
    return {
      success: false,
      error: { code: "invalid_input", message: "Letter ID is required." },
    };
  }

  try {
    const res = await backendFetch(
      `/letters/${encodeURIComponent(id)}/archive`,
      {
        method: "POST",
      },
    );
    return { success: true, data: res.data };
  } catch (err) {
    if (err instanceof BackendClientError) {
      return {
        success: false,
        error: { code: err.code, message: err.message, details: err.details },
      };
    }
    return {
      success: false,
      error: {
        code: "internal_error",
        message:
          err instanceof Error ? err.message : "Failed to archive letter.",
      },
    };
  }
}

export async function restoreLetterAction(
  id: string,
): Promise<ActionResult<unknown>> {
  if (!id) {
    return {
      success: false,
      error: { code: "invalid_input", message: "Letter ID is required." },
    };
  }

  try {
    const res = await backendFetch(
      `/letters/${encodeURIComponent(id)}/restore`,
      {
        method: "POST",
      },
    );
    return { success: true, data: res.data };
  } catch (err) {
    if (err instanceof BackendClientError) {
      return {
        success: false,
        error: { code: err.code, message: err.message, details: err.details },
      };
    }
    return {
      success: false,
      error: {
        code: "internal_error",
        message:
          err instanceof Error ? err.message : "Failed to restore letter.",
      },
    };
  }
}

export async function deleteLetterAction(
  id: string,
): Promise<ActionResult<null>> {
  if (!id) {
    return {
      success: false,
      error: { code: "invalid_input", message: "Letter ID is required." },
    };
  }

  try {
    await backendFetch(`/letters/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return { success: true, data: null };
  } catch (err) {
    if (err instanceof BackendClientError) {
      return {
        success: false,
        error: { code: err.code, message: err.message, details: err.details },
      };
    }
    return {
      success: false,
      error: {
        code: "internal_error",
        message:
          err instanceof Error ? err.message : "Failed to delete letter.",
      },
    };
  }
}
