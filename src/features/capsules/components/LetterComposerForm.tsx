"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLetterComposer, HorizonPreset } from "@/features/capsules";
import { ArchivalAccordion } from "@/components/ui/ArchivalAccordion";
import { WaxSeal } from "@/components/ui/WaxSeal";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Letter, PredictionCategory } from "@/types/timeecho";
import { Calendar, Mail, AlertCircle } from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { Stamp, StampPickerModal } from "@/components/stamps";

export interface LetterComposerFormProps {
  onSuccess?: (created: Letter) => void;
  showDocketHeader?: boolean;
  className?: string;
  defaultHorizon?: HorizonPreset;
}

export function LetterComposerForm({
  onSuccess,
  showDocketHeader = true,
  className,
  defaultHorizon,
}: LetterComposerFormProps) {
  const router = useRouter();
  const { t, locale } = useTimeEcho();

  const presets: Array<{ id: HorizonPreset; label: string }> = [
    { id: "6m", label: t("letters.six_months") },
    { id: "1y", label: t("letters.one_year") },
    { id: "3y", label: t("letters.three_years") },
    { id: "5y", label: t("letters.five_years") },
    { id: "custom", label: t("letters.custom_date") },
  ];

  const {
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
    submitLetter,
  } = useLetterComposer(
    defaultHorizon ? { horizonPreset: defaultHorizon } : undefined,
  );

  const searchParams = useSearchParams();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isStampPickerOpen, setIsStampPickerOpen] = useState(false);

  useEffect(() => {
    const stampParam = searchParams.get("stamp");
    if (stampParam && !form.stampId) {
      setField("stampId", stampParam);
    }
  }, [searchParams, form.stampId, setField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isValid) return;

    try {
      const created = await submitLetter();
      if (onSuccess) {
        onSuccess(created);
      } else {
        setTimeout(() => {
          router.push(`/letters/success?id=${encodeURIComponent(created.id)}`);
        }, 1200);
      }
    } catch {}
  };

  const getPrediction = (cat: PredictionCategory) =>
    form.predictions.find((p) => p.category === cat)?.prediction || "";

  const updateCategoryPrediction = (cat: PredictionCategory, text: string) => {
    const existing = form.predictions.filter((p) => p.category !== cat);
    if (text.trim()) {
      setPredictions([...existing, { category: cat, prediction: text }]);
    } else {
      setPredictions(existing);
    }
  };

  const [now] = useState(() => Date.now());

  const targetDate = new Date(form.scheduledAt);
  const formattedDeliveryDate = isNaN(targetDate.getTime())
    ? form.scheduledAt
    : formatLocaleDate(targetDate.toISOString(), locale);

  const countdownDays = isNaN(targetDate.getTime())
    ? 0
    : Math.max(
        0,
        Math.ceil((targetDate.getTime() - now) / (1000 * 60 * 60 * 24)),
      );

  const todayFormatted = formatLocaleDate(new Date(now).toISOString(), locale);

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto font-ui", className)}>
      {/* Top Header matching monolith */}
      {showDocketHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
          <div className="space-y-1">
            <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
              {t("letters.form_step_title")}
            </h1>
            <p className="text-xs font-letter text-foreground-muted tracking-wider">
              {t("letters.form_step_subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-letter text-foreground-muted uppercase tracking-wider">
              {t("letters.deliver_date_prefix")}
            </span>
            <div className="postmark-stamp flex items-center gap-2 px-3 py-1.5 bg-transparent">
              <span className="bg-transparent text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {form.scheduledAt}
              </span>
              <Calendar size={15} className="text-foreground-muted" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="paper-sheet rounded-xs p-5 border border-wax/40 bg-wax/5 text-foreground font-letter text-xs flex items-center gap-2 shadow-xs">
          <AlertCircle size={16} className="text-wax shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Canvas, presets, and guest email */}
          <div className="lg:col-span-7 paper-sheet rounded-xs p-6 sm:p-10 space-y-6 border border-crease shadow-xs">
            <div className="flex items-start justify-between border-b border-crease pb-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-letter uppercase tracking-widest text-foreground-muted block">
                  {t("common.appName")} · {t("letters.form_letter_heading")}
                </span>
                <h2 className="font-serif-editorial text-2xl font-semibold text-foreground mt-0.5">
                  {t("letters.form_letter_heading")}
                </h2>
                <span className="postmark-stamp text-xs py-0.5 px-2.5 inline-block">
                  {todayFormatted}
                </span>
              </div>

              <div className="shrink-0 flex flex-col items-end">
                {form.stampId ? (
                  <div className="group relative flex flex-col items-center">
                    <Stamp
                      key={form.stampId}
                      id={form.stampId}
                      size="md"
                      interactive
                      animateAffix
                      rotation={2.5}
                      onClick={() => setIsStampPickerOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsStampPickerOpen(true)}
                      className="mt-1 font-letter text-[10px] text-foreground-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      {t("stamps.changeStamp")}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsStampPickerOpen(true)}
                    aria-label={t("stamps.addStamp")}
                    className="w-[72px] h-[90px] border-2 border-dashed border-crease hover:border-wax hover:bg-manila/50 rounded-xs flex flex-col items-center justify-center gap-1.5 text-foreground-muted hover:text-wax transition-all cursor-pointer group select-none shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                      +
                    </div>
                    <span className="font-letter text-[9px] uppercase tracking-wider font-semibold text-center leading-tight px-1">
                      {t("stamps.addStamp")}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Title field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="letter-title-input"
                  className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
                >
                  {t("letters.title_label")} *
                </label>
                <span
                  id="title_counter"
                  className="text-[11px] font-letter text-foreground-muted"
                >
                  {form.title.length} / 100
                </span>
              </div>
              <input
                id="letter-title-input"
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder={t("letters.title_placeholder")}
                minLength={3}
                maxLength={100}
                required
                className={cn(
                  "w-full border-b-2 border-crease rounded-none bg-transparent px-1 py-2 font-serif-editorial text-xl font-semibold text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-colors",
                  hasAttemptedSubmit &&
                    validationErrors.title &&
                    "border-wax bg-wax/5",
                )}
              />
              {hasAttemptedSubmit && validationErrors.title && (
                <p className="text-xs text-wax font-mono pt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Content field */}
            <div className="space-y-2 relative">
              <label
                htmlFor="letter_content_area"
                className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
              >
                {t("letters.content_label")} *
              </label>
              <textarea
                id="letter_content_area"
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                placeholder={t("letters.content_placeholder_form")}
                rows={15}
                minLength={80}
                maxLength={2000}
                className="w-full p-5 sm:p-6 rounded-xs bg-transparent border border-crease font-letter text-sm leading-loose text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-all shadow-inner"
                required
                aria-required="true"
                aria-describedby="char_counter"
              />
              <div
                className="flex justify-between items-center text-[11px] font-letter text-foreground-muted pt-1"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="italic">{t("letters.only_you_can_see")}</span>
                <span id="char_counter">
                  {t("letters.min_chars_progress", {
                    count: form.content.length,
                  })}
                </span>
              </div>
              {hasAttemptedSubmit && validationErrors.content && (
                <p className="text-xs text-wax font-mono pt-1">
                  {validationErrors.content}
                </p>
              )}
            </div>

            {/* Date horizon presets */}
            <div className="space-y-2.5 border-t border-crease pt-5 font-letter">
              <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block">
                {t("letters.when_do_you_want_it")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {presets.map((p) => {
                  const isSelected = form.horizonPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setHorizonPreset(p.id)}
                      className={cn(
                        "py-2 rounded-xs border text-xs uppercase tracking-wider transition-all cursor-pointer font-letter",
                        isSelected
                          ? "border-wax bg-wax text-on-wax font-semibold shadow-2xs"
                          : "border-crease hover:bg-manila/40 text-foreground bg-transparent",
                      )}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {form.horizonPreset === "custom" && (
                <div className="archival-folder rounded-xs p-3 border border-manila-border mt-2 animate-fade-in">
                  <label
                    htmlFor="custom-date-input"
                    className="text-[10px] text-foreground-muted font-letter uppercase tracking-wider block mb-1 font-semibold"
                  >
                    {t("letters.choose_specific_date")}
                  </label>
                  <input
                    id="custom-date-input"
                    type="date"
                    value={form.scheduledAt}
                    onChange={(e) => setField("scheduledAt", e.target.value)}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground focus:border-wax focus:outline-none"
                  />
                  {hasAttemptedSubmit && validationErrors.scheduledAt && (
                    <p className="text-xs text-wax font-mono pt-1">
                      {validationErrors.scheduledAt}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Guest email section */}
            <div className="space-y-2 border-t border-crease pt-5 font-letter">
              <label
                htmlFor="letter-email-input"
                className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
              >
                {t("letters.label_email")} *
              </label>
              <input
                id="letter-email-input"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder={t("letters.email_placeholder_form")}
                required
                className={cn(
                  "w-full border border-crease rounded-xs bg-transparent text-foreground placeholder:text-foreground-muted/40 text-xs px-3 py-2.5 font-letter focus:border-wax focus:outline-none transition-colors",
                  hasAttemptedSubmit &&
                    validationErrors.email &&
                    "border-wax bg-wax/5",
                )}
              />
              <p className="text-[11px] font-letter text-foreground-muted">
                {t("letters.label_email_help")}
              </p>
              {hasAttemptedSubmit && validationErrors.email && (
                <p className="text-xs text-wax font-mono pt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Annex 1, Annex 2, Summary Docket, Seal CTA */}
          <div className="lg:col-span-5 space-y-6">
            {/* Annex 1: Predictions */}
            <ArchivalAccordion
              folio={t("letters.annex_1")}
              title={t("letters.predictions_heading")}
              subtitle={t("letters.predictions_subtitle_form")}
              defaultOpen={true}
            >
              <div className="space-y-3.5 text-xs font-letter">
                <div className="space-y-1">
                  <label
                    htmlFor="pred-city"
                    className="font-semibold text-foreground/80 flex items-center gap-1.5"
                  >
                    <span className="text-foreground-muted">01.</span>
                    <span>{t("letters.prediction_city_label")}</span>
                  </label>
                  <input
                    id="pred-city"
                    type="text"
                    value={getPrediction("city")}
                    onChange={(e) =>
                      updateCategoryPrediction("city", e.target.value)
                    }
                    placeholder={t("letters.prediction_placeholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-career"
                    className="font-semibold text-foreground/80 flex items-center gap-1.5"
                  >
                    <span className="text-foreground-muted">02.</span>
                    <span>{t("letters.prediction_work_label")}</span>
                  </label>
                  <input
                    id="pred-career"
                    type="text"
                    value={getPrediction("career")}
                    onChange={(e) =>
                      updateCategoryPrediction("career", e.target.value)
                    }
                    placeholder={t("letters.prediction_placeholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-salary"
                    className="font-semibold text-foreground/80 flex items-center gap-1.5"
                  >
                    <span className="text-foreground-muted">03.</span>
                    <span>{t("letters.prediction_income_label_form")}</span>
                  </label>
                  <input
                    id="pred-salary"
                    type="text"
                    value={getPrediction("salary")}
                    onChange={(e) =>
                      updateCategoryPrediction("salary", e.target.value)
                    }
                    placeholder={t("letters.prediction_placeholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-relationship"
                    className="font-semibold text-foreground/80 flex items-center gap-1.5"
                  >
                    <span className="text-foreground-muted">04.</span>
                    <span>
                      {t("letters.prediction_relationship_label_form")}
                    </span>
                  </label>
                  <input
                    id="pred-relationship"
                    type="text"
                    value={getPrediction("relationship")}
                    onChange={(e) =>
                      updateCategoryPrediction("relationship", e.target.value)
                    }
                    placeholder={t("letters.prediction_placeholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-achievement"
                    className="font-semibold text-foreground/80 flex items-center gap-1.5"
                  >
                    <span className="text-foreground-muted">05.</span>
                    <span>
                      {t("letters.prediction_achievement_label_form")}
                    </span>
                  </label>
                  <input
                    id="pred-achievement"
                    type="text"
                    value={getPrediction("achievement")}
                    onChange={(e) =>
                      updateCategoryPrediction("achievement", e.target.value)
                    }
                    placeholder={t("letters.prediction_placeholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>
              </div>
            </ArchivalAccordion>

            {/* Annex 2: Emotional Baseline */}
            <ArchivalAccordion
              folio={t("letters.annex_2")}
              title={t("letters.emotional_snapshot_heading")}
              subtitle={t("letters.feeling_now_short")}
              defaultOpen={true}
            >
              <div className="space-y-4 font-letter text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between items-center font-semibold text-foreground/80">
                    <span>{t("letters.emotion_happiness")}</span>
                    <span className="text-foreground-muted" aria-live="polite">
                      {form.emotionalSnapshot.happinessLevel} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.emotionalSnapshot.happinessLevel}
                    onChange={(e) =>
                      setEmotionalLevel(
                        "happinessLevel",
                        Number(e.target.value),
                      )
                    }
                    aria-label={t("letters.emotion_happiness")}
                    className="range range-xs cursor-pointer w-full accent-wax"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center font-semibold text-foreground/80">
                    <span>{t("letters.emotion_anxiety")}</span>
                    <span className="text-foreground-muted" aria-live="polite">
                      {form.emotionalSnapshot.anxietyLevel} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.emotionalSnapshot.anxietyLevel}
                    onChange={(e) =>
                      setEmotionalLevel("anxietyLevel", Number(e.target.value))
                    }
                    aria-label={t("letters.emotion_anxiety")}
                    className="range range-xs cursor-pointer w-full accent-wax"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center font-semibold text-foreground/80">
                    <span>{t("letters.emotion_motivation")}</span>
                    <span className="text-foreground-muted" aria-live="polite">
                      {form.emotionalSnapshot.motivationLevel} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.emotionalSnapshot.motivationLevel}
                    onChange={(e) =>
                      setEmotionalLevel(
                        "motivationLevel",
                        Number(e.target.value),
                      )
                    }
                    aria-label={t("letters.emotion_motivation")}
                    className="range range-xs cursor-pointer w-full accent-wax"
                  />
                </div>
              </div>
            </ArchivalAccordion>

            {/* Summary Docket Card */}
            <div className="paper-sheet rounded-xs p-5 space-y-3 text-xs font-letter border border-crease shadow-2xs">
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block">
                {t("letters.summary_heading")}
              </span>

              <div className="space-y-2 border-t border-crease pt-2 text-foreground/80">
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">
                    {t("letters.summary_opening_label")}:
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {formattedDeliveryDate}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">
                    {t("letters.summary_time_label")}:
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {countdownDays} {t("common.days")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">
                    {t("letters.summary_privacy_label")}:
                  </span>
                  <span className="font-semibold text-foreground">
                    {t("letters.only_you_can_see")}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Seal CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isSealing}
                className={cn(
                  "btn bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3.5 px-6 text-xs font-semibold tracking-widest uppercase border-none cursor-pointer w-full min-h-[46px] shadow-xs font-letter inline-flex items-center justify-center gap-2 transition-colors",
                  (isSubmitting || isSealing) &&
                    "opacity-70 cursor-not-allowed",
                )}
              >
                <Mail size={16} />
                <span>
                  {isSealing
                    ? t("composer.sealingButton")
                    : t("letters.btn_save_letter")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Wax Sealing Modal Micro-Animation */}
      <AnimatePresence>
        {isSealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sealing-dialog-title"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="p-8 rounded-lg border border-crease bg-parchment max-w-sm w-full space-y-6 shadow-2xl flex flex-col items-center"
            >
              <WaxSeal size="lg" isLocked={false} />

              <div className="space-y-2">
                <h3
                  id="sealing-dialog-title"
                  className="font-serif-editorial text-2xl font-bold text-ink"
                >
                  {t("composer.sealingVaultModalTitle")}
                </h3>
                <p className="font-letter text-xs text-foreground-muted leading-relaxed">
                  {t("composer.sealingVaultModalDesc")}
                </p>
              </div>

              <div className="w-16 h-1 bg-crease rounded-full overflow-hidden">
                <div className="h-full bg-wax animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StampPickerModal
        isOpen={isStampPickerOpen}
        onClose={() => setIsStampPickerOpen(false)}
        selectedStampId={form.stampId || undefined}
        onSelectStamp={(id) => setField("stampId", id)}
      />
    </div>
  );
}
