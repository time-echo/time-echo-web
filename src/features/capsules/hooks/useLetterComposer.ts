"use client";

import { useState, useCallback, useMemo } from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { useAuth } from "@/lib/context/AuthContext";
import { ApiError } from "@/lib/repositories/HttpApiRepository";
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
  stampId?: string | null;
  stamp_slug?: string | null;
}

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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const DEFAULT_STATE: LetterComposerState = {
  title: "",
  content: "",
  email: "",
  scheduledAt: getPresetDate("1y"),
  horizonPreset: "1y",
  language: "es",
  timezone:
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
      : "UTC",
  stampId: null,
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

const TECHNICAL_ENGLISH_ERROR_PATTERN =
  /unknown attribute|internal server error|failed to fetch|networkerror|load failed|http \d{3}|request failed with status|invalid or malformed request/i;

export function useLetterComposer(
  initialValues?: Partial<LetterComposerState>,
) {
  const { createCapsule, locale, t } = useTimeEcho();
  const { user, isAuthenticated } = useAuth();

  const [rawForm, setForm] = useState<LetterComposerState>(() => ({
    ...DEFAULT_STATE,
    email: initialValues?.email || user?.email || "",
    language: locale,
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC",
    ...initialValues,
  }));

  const form = useMemo<LetterComposerState>(
    () => ({
      ...rawForm,
      email: rawForm.email || user?.email || "",
      language: locale,
    }),
    [rawForm, user?.email, locale],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLetter, setCreatedLetter] = useState<Letter | null>(null);

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

  const validationErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!form.title.trim()) {
      errs.title = t("composer.errors.titleRequired");
    } else if (form.title.trim().length < 3) {
      errs.title = t("composer.errors.titleLength");
    }

    const contentWords = form.content.trim()
      ? form.content.trim().split(/\s+/).filter(Boolean)
      : [];

    if (!form.content.trim()) {
      errs.content = t("composer.errors.contentRequired");
    } else if (contentWords.some((w) => w.length > 45)) {
      errs.content = t("composer.errors.wordTooLong");
    } else if (contentWords.length < 10) {
      errs.content = t("composer.errors.contentMinWords");
    } else if (form.content.trim().length < 80) {
      errs.content = t("landing.minCharsError");
    }

    const effectiveEmail = (form.email || user?.email || "").trim();
    if (!isAuthenticated && !effectiveEmail) {
      errs.email = t("composer.errors.emailRequired");
    } else if (
      effectiveEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)
    ) {
      errs.email = t("composer.errors.emailInvalid");
    }

    const scheduledTime = new Date(form.scheduledAt).getTime();
    const minCustom = new Date();
    minCustom.setDate(minCustom.getDate() + 3);
    const minCustomISO = `${minCustom.getFullYear()}-${String(minCustom.getMonth() + 1).padStart(2, "0")}-${String(minCustom.getDate()).padStart(2, "0")}`;
    if (!form.scheduledAt || isNaN(scheduledTime)) {
      errs.scheduledAt = t("composer.errors.dateRequired");
    } else if (form.scheduledAt < minCustomISO) {
      errs.scheduledAt = t("composer.errors.dateFuture");
    }

    return errs;
  }, [
    form.title,
    form.content,
    form.email,
    form.scheduledAt,
    user?.email,
    isAuthenticated,
    t,
  ]);

  const isValid = Object.keys(validationErrors).length === 0;

  const resolveFriendlyErrorMessage = useCallback(
    (err: unknown): string => {
      const fallback = t("composer.errors.sealError");

      if (err instanceof ApiError) {
        if (
          err.status >= 500 ||
          err.code === "internal_error" ||
          err.code === "service_unavailable" ||
          err.code === "bad_request" ||
          err.code === "request_failed"
        ) {
          return fallback;
        }

        if (
          !err.message ||
          TECHNICAL_ENGLISH_ERROR_PATTERN.test(err.message) ||
          (locale === "es" &&
            /can't be blank|is too short|is too long|must be in the future|cannot contain words|must contain at least/i.test(
              err.message,
            ))
        ) {
          return fallback;
        }

        return err.message;
      }

      if (err instanceof TypeError) {
        return fallback;
      }

      if (err instanceof Error) {
        if (TECHNICAL_ENGLISH_ERROR_PATTERN.test(err.message)) {
          return fallback;
        }
        return err.message || fallback;
      }

      return fallback;
    },
    [locale, t],
  );

  const submitLetter = useCallback(async (): Promise<Letter> => {
    if (!isValid) {
      const firstErr = Object.values(validationErrors)[0];
      setError(firstErr);
      throw new Error(firstErr);
    }

    const scheduledTime = new Date(form.scheduledAt).getTime();
    const minCustom = new Date();
    minCustom.setDate(minCustom.getDate() + 3);
    const minCustomISO = `${minCustom.getFullYear()}-${String(minCustom.getMonth() + 1).padStart(2, "0")}-${String(minCustom.getDate()).padStart(2, "0")}`;
    if (form.scheduledAt < minCustomISO || scheduledTime <= Date.now()) {
      const dateErr = t("composer.errors.dateFuture");
      setError(dateErr);
      throw new Error(dateErr);
    }

    setIsSubmitting(true);
    setIsSealing(true);
    setError(null);

    try {
      const validPredictions = form.predictions.filter(
        (p) => p.prediction.trim() !== "",
      );

      const effectiveEmail = (form.email || user?.email || "").trim();

      const userTimezone =
        form.timezone ||
        (typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
          : "UTC");

      const payload: CreateLetterInput = {
        title: form.title.trim(),
        content: form.content.trim(),
        email: effectiveEmail,
        scheduledAt: form.scheduledAt,
        language: form.language,
        timezone: userTimezone,
        stampId: form.stamp_slug || form.stampId || undefined,
        stamp_slug: form.stamp_slug || form.stampId || undefined,
        emotionalSnapshot: form.emotionalSnapshot,
        predictions: validPredictions,
      };

      const result = await createCapsule(payload);
      setCreatedLetter(result);
      return result;
    } catch (err) {
      const msg = resolveFriendlyErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
      setIsSealing(false);
    }
  }, [
    isValid,
    validationErrors,
    form,
    user,
    createCapsule,
    t,
    resolveFriendlyErrorMessage,
  ]);

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
