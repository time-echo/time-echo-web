"use client";

import { useState, useCallback, useMemo } from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  Letter,
  PredictionOutcome,
  UpdateRealityInput,
} from "@/types/timeecho";

export interface PredictionEvaluationState {
  reality: string;
  outcome: PredictionOutcome;
  matched: boolean | null;
}

/**
 * ⚖️ useRealityLedger Hook
 *
 * Feature hook managing retrospective reality comparisons, reveal emotional delta calculations,
 * and reality ledger settlement.
 */
export function useRealityLedger(capsule: Letter) {
  const { updateReality } = useTimeEcho();

  // Reveal emotional ratings state
  const [revealHappiness, setRevealHappiness] = useState<number>(
    capsule.revealHappiness ?? 7,
  );
  const [revealAnxiety, setRevealAnxiety] = useState<number>(
    capsule.revealAnxiety ?? 4,
  );
  const [revealMotivation, setRevealMotivation] = useState<number>(
    capsule.revealMotivation ?? 8,
  );

  // Predictions evaluation dictionary
  const [predictionsMap, setPredictionsMap] = useState<
    Record<string, PredictionEvaluationState>
  >(() => {
    const map: Record<string, PredictionEvaluationState> = {};
    (capsule.predictions || []).forEach((p) => {
      map[p.id] = {
        reality: p.reality || "",
        outcome:
          p.outcome ||
          (p.matched === true
            ? "fulfilled"
            : p.matched === false
              ? "diverged"
              : "pending"),
        matched: p.matched !== undefined ? p.matched : null,
      };
    });
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(
    Boolean(
      capsule.revealHappiness !== null && capsule.revealHappiness !== undefined,
    ),
  );
  const [error, setError] = useState<string | null>(null);

  // Setters for ratings
  const setRevealRating = useCallback(
    (metric: "happiness" | "anxiety" | "motivation", value: number) => {
      if (metric === "happiness") setRevealHappiness(value);
      if (metric === "anxiety") setRevealAnxiety(value);
      if (metric === "motivation") setRevealMotivation(value);
    },
    [],
  );

  // Setters for predictions
  const setPredictionReality = useCallback((id: string, reality: string) => {
    setPredictionsMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        reality,
      },
    }));
  }, []);

  const setPredictionOutcome = useCallback(
    (id: string, outcome: PredictionOutcome) => {
      let matched: boolean | null = null;
      if (outcome === "fulfilled") matched = true;
      if (outcome === "diverged" || outcome === "unfulfilled") matched = false;

      setPredictionsMap((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          outcome,
          matched,
        },
      }));
    },
    [],
  );

  // Emotional Deltas (Current Reveal vs Past Baseline)
  const emotionalDeltas = useMemo(() => {
    const base = capsule.emotionalSnapshot || {
      happinessLevel: 5,
      anxietyLevel: 5,
      motivationLevel: 5,
    };

    return {
      happiness: revealHappiness - base.happinessLevel,
      anxiety: revealAnxiety - base.anxietyLevel,
      motivation: revealMotivation - base.motivationLevel,
    };
  }, [
    capsule.emotionalSnapshot,
    revealHappiness,
    revealAnxiety,
    revealMotivation,
  ]);

  // Prediction Stats
  const fulfillmentStats = useMemo(() => {
    const items = Object.values(predictionsMap);
    const fulfilled = items.filter((i) => i.outcome === "fulfilled").length;
    const diverged = items.filter((i) => i.outcome === "diverged").length;
    const unfulfilled = items.filter((i) => i.outcome === "unfulfilled").length;
    const pending = items.filter((i) => i.outcome === "pending").length;

    const rate =
      items.length > 0 ? Math.round((fulfilled / items.length) * 100) : 0;

    return {
      total: items.length,
      fulfilled,
      diverged,
      unfulfilled,
      pending,
      accuracyRate: rate,
    };
  }, [predictionsMap]);

  // Save to repository
  const saveRealityLedger = useCallback(async (): Promise<Letter> => {
    setIsSaving(true);
    setError(null);

    try {
      const formattedPredictions = Object.entries(predictionsMap).map(
        ([id, state]) => ({
          id,
          reality: state.reality.trim(),
          matched: state.matched,
          outcome: state.outcome,
        }),
      );

      const payload: UpdateRealityInput = {
        id: capsule.id,
        revealHappiness,
        revealAnxiety,
        revealMotivation,
        predictions: formattedPredictions,
        openedAt: capsule.openedAt || new Date().toISOString(),
        isWaxBroken: true,
      };

      const result = await updateReality(payload);
      setIsSaved(true);
      return result;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al guardar el expediente de realidad";
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [
    capsule.id,
    capsule.openedAt,
    revealHappiness,
    revealAnxiety,
    revealMotivation,
    predictionsMap,
    updateReality,
  ]);

  return {
    revealHappiness,
    revealAnxiety,
    revealMotivation,
    setRevealRating,
    predictionsMap,
    setPredictionReality,
    setPredictionOutcome,
    emotionalDeltas,
    fulfillmentStats,
    isSaving,
    isSaved,
    error,
    saveRealityLedger,
  };
}
