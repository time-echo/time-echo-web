"use client";

import { useMemo, useRef } from "react";
import { track } from "@/lib/analytics";
import type {
  LetterFunnelBaseProperties,
  LetterFunnelHorizonPreset,
  LetterFunnelSource,
} from "@/lib/analytics/events";
import { useAuth } from "@/lib/context/AuthContext";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface LetterFunnelSummary {
  horizonDays: number;
  predictionsCount: number;
  hasStamp: boolean;
}

const successTrackedLetterIds = new Set<string>();

export function useLetterFunnel(source: LetterFunnelSource) {
  const { locale } = useTimeEcho();
  const { isAuthenticated } = useAuth();
  const hasStarted = useRef(false);
  const hasFilledPredictions = useRef(false);

  return useMemo(() => {
    const base = (): LetterFunnelBaseProperties => ({
      source,
      locale,
      is_authenticated: Boolean(isAuthenticated),
    });

    return {
      trackStart(value: string) {
        if (hasStarted.current || value.length === 0) return;
        hasStarted.current = true;
        track("start_letter", base());
      },
      trackDateSelected(
        horizonPreset: LetterFunnelHorizonPreset,
        horizonDays: number,
      ) {
        track("select_date", {
          ...base(),
          horizon_preset: horizonPreset,
          horizon_days: horizonDays,
        });
      },
      trackPredictionsFilled(predictionsCount: number) {
        if (hasFilledPredictions.current || predictionsCount < 1) return;
        hasFilledPredictions.current = true;
        track("fill_predictions", {
          ...base(),
          predictions_count: predictionsCount,
        });
      },
      trackSubmit(summary: LetterFunnelSummary) {
        track("submit_letter", {
          ...base(),
          horizon_days: summary.horizonDays,
          predictions_count: summary.predictionsCount,
          has_stamp: summary.hasStamp,
        });
      },
      trackSuccess(letterId: string, summary: LetterFunnelSummary) {
        if (successTrackedLetterIds.has(letterId)) return;
        successTrackedLetterIds.add(letterId);
        track("letter_success", {
          ...base(),
          horizon_days: summary.horizonDays,
          predictions_count: summary.predictionsCount,
          has_stamp: summary.hasStamp,
        });
      },
    };
  }, [source, locale, isAuthenticated]);
}
