"use client";

import { useState, useCallback, useMemo } from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  CreateLetterInput,
  Letter,
  PredictionCategory,
  SupportedLanguage,
} from "@/types/timeecho";

export type HorizonPreset = "6m" | "1y" | "3y" | "5y" | "custom";

export interface LetterComposerState {
  title: string;
  content: string;
  email: string;
  scheduledAt: string;
  horizonPreset: HorizonPreset;
  language: SupportedLanguage;
  timezone: string;
  emotionalSnapshot: {
    happinessLevel: number;
    anxietyLevel: number;
    motivationLevel: number;
  };
  predictions: Array<{
    category: PredictionCategory;
    prediction: string;
  }>;
}

/**
 * Calculates a future ISO timestamp based on preset duration.
 */
function getPresetDate(preset: HorizonPreset): string {
  const date = new Date();
  switch (preset) {
    case "6m":
      date.setMonth(date.getMonth() + 6);
      break;
    case "1y":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "3y":
      date.setFullYear(date.getFullYear() + 3);
      break;
    case "5y":
      date.setFullYear(date.getFullYear() + 5);
      break;
    case "custom":
    default:
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
}

const DEFAULT_STATE: LetterComposerState = {
  title: "",
  content: "",
  email: "",
  scheduledAt: getPresetDate("1y"),
  horizonPreset: "1y",
  language: "es",
  timezone: "UTC",
  emotionalSnapshot: {
    happinessLevel: 7,
    anxietyLevel: 5,
    motivationLevel: 8,
  },
  predictions: [
    { category: "city", prediction: "" },
    { category: "career", prediction: "" },
  ],
};

/**
 * ✍️ useLetterComposer Hook
 *
 * Feature hook orchestrating new letter drafting, horizon calculations,
 * baseline emotional calibration, milestone predictions, and sealing operations.
 */
export function useLetterComposer(
  initialValues?: Partial<LetterComposerState>,
) {
  const { createCapsule, locale } = useTimeEcho();

  const [form, setForm] = useState<LetterComposerState>(() => ({
    ...DEFAULT_STATE,
    language: locale,
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC",
    ...initialValues,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLetter, setCreatedLetter] = useState<Letter | null>(null);

  // Field updates
  const setField = useCallback(
    <K extends keyof LetterComposerState>(
      key: K,
      value: LetterComposerState[K],
    ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setHorizonPreset = useCallback((preset: HorizonPreset) => {
    setForm((prev) => ({
      ...prev,
      horizonPreset: preset,
      scheduledAt:
        preset !== "custom" ? getPresetDate(preset) : prev.scheduledAt,
    }));
  }, []);

  const setEmotionalLevel = useCallback(
    (
      field: "happinessLevel" | "anxietyLevel" | "motivationLevel",
      val: number,
    ) => {
      setForm((prev) => ({
        ...prev,
        emotionalSnapshot: {
          ...prev.emotionalSnapshot,
          [field]: val,
        },
      }));
    },
    [],
  );

  const setPredictions = useCallback(
    (
      predictions: Array<{ category: PredictionCategory; prediction: string }>,
    ) => {
      setForm((prev) => ({ ...prev, predictions }));
    },
    [],
  );

  // Pure structural validation for rendering hints
  const validationErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!form.title.trim()) {
      errs.title = "El título de la cápsula es obligatorio.";
    } else if (form.title.trim().length < 3) {
      errs.title = "El título debe tener al menos 3 caracteres.";
    }

    if (!form.content.trim()) {
      errs.content = "Escribe un mensaje para tu yo del futuro.";
    } else if (form.content.trim().length < 10) {
      errs.content = "El contenido debe tener al menos 10 caracteres.";
    }

    if (!form.email.trim()) {
      errs.email = "El correo de entrega es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Ingresa un correo electrónico válido.";
    }

    const scheduledTime = new Date(form.scheduledAt).getTime();
    if (!form.scheduledAt || isNaN(scheduledTime)) {
      errs.scheduledAt = "Selecciona una fecha de entrega válida.";
    }

    return errs;
  }, [form.title, form.content, form.email, form.scheduledAt]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Submit and Seal
  const submitLetter = useCallback(async (): Promise<Letter> => {
    if (!isValid) {
      const firstErr = Object.values(validationErrors)[0];
      setError(firstErr);
      throw new Error(firstErr);
    }

    const scheduledTime = new Date(form.scheduledAt).getTime();
    if (scheduledTime <= Date.now()) {
      const dateErr = "La fecha de entrega debe situarse en el futuro.";
      setError(dateErr);
      throw new Error(dateErr);
    }

    setIsSubmitting(true);
    setIsSealing(true);
    setError(null);

    try {
      // Filter out empty predictions
      const validPredictions = form.predictions.filter(
        (p) => p.prediction.trim() !== "",
      );

      const payload: CreateLetterInput = {
        title: form.title.trim(),
        content: form.content.trim(),
        email: form.email.trim(),
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        language: form.language,
        timezone: form.timezone,
        emotionalSnapshot: form.emotionalSnapshot,
        predictions: validPredictions,
      };

      const result = await createCapsule(payload);
      setCreatedLetter(result);
      return result;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al sellar la cápsula";
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
      setIsSealing(false);
    }
  }, [isValid, validationErrors, form, createCapsule]);

  const resetComposer = useCallback(() => {
    setForm(DEFAULT_STATE);
    setError(null);
    setCreatedLetter(null);
  }, []);

  return {
    form,
    setField,
    setHorizonPreset,
    setEmotionalLevel,
    setPredictions,
    validationErrors,
    isValid,
    isSubmitting,
    isSealing,
    error,
    createdLetter,
    submitLetter,
    resetComposer,
  };
}
