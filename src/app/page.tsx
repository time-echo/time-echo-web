"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { useAuth } from "@/lib/context/AuthContext";
import { track } from "@/lib/analytics";
import { PredictionCategory } from "@/types/timeecho";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Mail,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { Stamp, StampPickerModal, useStampCatalog } from "@/components/stamps";
import { ArchivalLoader } from "@/components/ui/ArchivalLoader";
import { ArchivalDatePicker } from "@/components/ui/ArchivalDatePicker";
import { Slider } from "@/components/ui/Slider";
import { SocialProof } from "@/features/landing/components/SocialProof";
import { useLetterFunnel } from "@/features/capsules/hooks/useLetterFunnel";
import {
  InspirationPromptLabel,
  useInspirationCatalog,
} from "@/features/capsules";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysUntilDate(dateStr: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / MS_PER_DAY),
  );
}

export default function HomePage() {
  const router = useRouter();
  const { locale, createCapsule, t } = useTimeEcho();
  const { isAuthenticated } = useAuth();
  const hasTrackedCreationStart = useRef(false);
  const funnel = useLetterFunnel("landing");

  const trackLandingStartIfNeeded = () => {
    if (hasTrackedCreationStart.current) return;
    hasTrackedCreationStart.current = true;
    track("letter_creation_started", {
      source: "landing",
      is_authenticated: Boolean(isAuthenticated),
      locale,
    });
  };

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const targetElement = document.getElementById(hash.slice(1));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToHash();
    const frameId = requestAnimationFrame(scrollToHash);
    const timeoutId = setTimeout(scrollToHash, 150);
    window.addEventListener("hashchange", scrollToHash);
    window.addEventListener("popstate", scrollToHash);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("popstate", scrollToHash);
    };
  }, []);

  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [selectedHorizonDays, setSelectedHorizonDays] = useState<number>(365);
  const [minCustomDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [customDate, setCustomDate] = useState<string>(minCustomDate);
  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
  const [isStampPickerOpen, setIsStampPickerOpen] = useState<boolean>(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const { findStamp } = useStampCatalog();
  const {
    inspirations,
    isLoading: isLoadingInspirations,
    findInspiration,
    getRandomInspiration,
  } = useInspirationCatalog();
  const currentStamp = selectedStampId ? findStamp(selectedStampId) : undefined;

  const selectedPrompt = findInspiration(selectedPromptId);

  const [predictionCity, setPredictionCity] = useState("");
  const [predictionCareer, setPredictionCareer] = useState("");
  const [predictionSalary, setPredictionSalary] = useState("");
  const [predictionRelationship, setPredictionRelationship] = useState("");
  const [predictionAchievement, setPredictionAchievement] = useState("");

  const [happiness, setHappiness] = useState(6);
  const [anxiety, setAnxiety] = useState(4);
  const [motivation, setMotivation] = useState(7);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filledPredictionsCount = [
    predictionCity,
    predictionCareer,
    predictionSalary,
    predictionRelationship,
    predictionAchievement,
  ].filter((value) => value.trim().length > 0).length;

  const currentHorizonDays = showCustomDate
    ? daysUntilDate(customDate)
    : selectedHorizonDays || 365;

  const funnelSummary = {
    horizonDays: currentHorizonDays,
    predictionsCount: filledPredictionsCount,
    hasStamp: Boolean(selectedStampId),
  };

  const currentDateFormatted = formatLocaleDate(
    new Date().toISOString(),
    locale,
  );

  const letterPlaceholderHorizon = (() => {
    if (showCustomDate) {
      if (customDate) {
        return t("landing.letterPlaceholderHorizonCustom", {
          date: formatLocaleDate(`${customDate}T12:00:00`, locale),
        });
      }
      return t("landing.letterPlaceholderHorizonFuture");
    }
    switch (selectedHorizonDays) {
      case 180:
        return t("landing.letterPlaceholderHorizon6m");
      case 1095:
        return t("landing.letterPlaceholderHorizon3y");
      case 1825:
        return t("landing.letterPlaceholderHorizon5y");
      case 365:
      default:
        return t("landing.letterPlaceholderHorizon1y");
    }
  })();

  const handlePresetDate = (
    days: number,
    preset: "6m" | "1y" | "3y" | "5y",
  ) => {
    setSelectedHorizonDays(days);
    setShowCustomDate(false);
    funnel.trackDateSelected(preset, days);
  };

  const handleCustomDateChange = (date: string) => {
    setCustomDate(date);
    funnel.trackDateSelected("custom", daysUntilDate(date));
  };

  const handlePredictionBlur = () => {
    funnel.trackPredictionsFilled(filledPredictionsCount);
  };

  const handleWriteLetterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    textarea.focus({ preventScroll: true });
  };

  const handleToggleCustomDate = () => {
    setShowCustomDate(true);
    setSelectedHorizonDays(0);
    if (!customDate || customDate < minCustomDate) {
      setCustomDate(minCustomDate);
    }
  };

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const words = content.trim()
      ? content.trim().split(/\s+/).filter(Boolean)
      : [];
    if (
      words.some((w) => w.length > 45) ||
      words.length < 10 ||
      content.trim().length < 80
    ) {
      contentTextareaRef.current?.focus();
      return;
    }

    if (!email.trim()) return;

    setIsSubmitting(true);

    let scheduledDateStr = "";
    if (showCustomDate) {
      if (!customDate || customDate < minCustomDate) {
        setIsSubmitting(false);
        return;
      }
      scheduledDateStr = customDate;
    } else {
      const deliverDate = new Date();
      deliverDate.setDate(deliverDate.getDate() + (selectedHorizonDays || 365));
      scheduledDateStr = `${deliverDate.getFullYear()}-${String(deliverDate.getMonth() + 1).padStart(2, "0")}-${String(deliverDate.getDate()).padStart(2, "0")}`;
    }

    const userTimezone =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        : "UTC";

    const predictionsList: Array<{
      category: PredictionCategory;
      prediction: string;
    }> = [
      { category: "city" as const, prediction: predictionCity },
      { category: "career" as const, prediction: predictionCareer },
      { category: "salary" as const, prediction: predictionSalary },
      { category: "relationship" as const, prediction: predictionRelationship },
      { category: "achievement" as const, prediction: predictionAchievement },
    ].filter((p) => p.prediction.trim().length > 0);

    try {
      const createdLetter = await createCapsule({
        title: t("landing.defaultTitle"),
        content,
        email,
        scheduledAt: scheduledDateStr,
        timezone: userTimezone,
        stampId: selectedStampId || undefined,
        stamp_slug: selectedStampId || undefined,
        emotionalSnapshot: {
          happinessLevel: happiness,
          anxietyLevel: anxiety,
          motivationLevel: motivation,
        },
        predictions: predictionsList,
      });

      const resolvedHorizonDays = currentHorizonDays;

      funnel.trackSuccess(createdLetter.id, {
        ...funnelSummary,
        predictionsCount: predictionsList.length,
      });

      track("letter_creation_completed", {
        source: "landing",
        has_stamp: Boolean(selectedStampId),
        predictions_count: predictionsList.length,
        has_emotional_snapshot: true,
        horizon_days: resolvedHorizonDays,
        is_authenticated: Boolean(isAuthenticated),
        locale,
      });

      if (!isAuthenticated) {
        track("generate_lead", {
          lead_source: "landing_composer",
          language: locale,
        });
      }

      router.push("/letters/success");
    } catch {
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const contentWords = content.trim()
    ? content.trim().split(/\s+/).filter(Boolean)
    : [];
  const contentError = (() => {
    if (!content.trim()) {
      return t("composer.errors.contentRequired");
    }
    if (contentWords.some((w) => w.length > 45)) {
      return t("composer.errors.wordTooLong");
    }
    if (contentWords.length < 10) {
      return t("composer.errors.contentMinWords");
    }
    if (content.trim().length < 80) {
      return t("landing.minCharsError");
    }
    return null;
  })();
  const showContentError = Boolean(contentError) && hasAttemptedSubmit;
  const counterProgress = Math.min(100, (charCount / 80) * 100);
  const counterText =
    charCount === 0
      ? t("landing.counterEmpty")
      : charCount < 80
        ? t("landing.counterProgress", { remaining: 80 - charCount })
        : t("landing.counterReady", { count: charCount });

  return (
    <div className="space-y-24 max-w-6xl mx-auto -mt-4 font-ui animate-fade-in text-foreground">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-3">
            <h1 className="font-serif-editorial text-[2rem] sm:text-5xl font-normal text-foreground leading-[1.1] tracking-tight">
              {t("landing.heroTitle")}
            </h1>

            <p className="font-serif-editorial italic text-lg sm:text-xl text-foreground-muted">
              {t("landing.heroTitleLine1")} {t("landing.heroTitleLine2")}
            </p>

            <p className="font-letter text-xs sm:text-sm text-foreground leading-relaxed max-w-xl">
              {t("landing.heroTrustLine")}
            </p>
          </div>

          <a
            href="#landing-content"
            onClick={handleWriteLetterClick}
            className="lg:hidden w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-6 py-3 text-xs font-semibold tracking-widest uppercase font-letter inline-flex items-center justify-center gap-2 shadow-xs min-h-[48px] transition-colors"
          >
            {t("landing.heroCta")}
          </a>

          <div className="paper-sheet rounded-xs border border-crease border-l-4 border-l-wax p-4 sm:p-5 space-y-3">
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-semibold text-foreground leading-snug">
              {t("landing.trustReality")}
            </h2>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.heroRealityDesc")}
            </p>

            <div className="hidden lg:block border-t border-dashed border-crease pt-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-letter text-foreground-muted">
                  {t("landing.demoQCareer")}
                </p>
                <span className="postmark-stamp text-[10px] py-0.5 px-2 inline-block">
                  {t("landing.heroExampleLabel")}
                </span>
              </div>
              <dl className="grid grid-cols-2 text-xs font-letter">
                <div className="pr-3 space-y-0.5">
                  <dt className="text-foreground-muted">
                    {t("landing.demoPastPredLabel")}
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {t("landing.demoPastCareer")}
                  </dd>
                </div>
                <div className="pl-3 border-l border-crease space-y-0.5">
                  <dt className="text-foreground-muted">
                    {t("landing.demoRealityLabel")}
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {t("landing.demoRealityCareer")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <ul className="hidden sm:block space-y-2.5 border-t border-crease pt-4 text-xs font-letter text-foreground-muted leading-relaxed">
            <li>
              <span className="font-semibold uppercase tracking-wider text-foreground">
                {t("landing.trustPrivate")}.
              </span>{" "}
              {t("landing.trustPrivateDesc")}
            </li>
            <li>
              <span className="font-semibold uppercase tracking-wider text-foreground">
                {t("landing.trustSchedule")}.
              </span>{" "}
              {t("landing.trustScheduleDesc")}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 paper-sheet rounded-xs p-4 sm:p-8 space-y-6 border border-crease">
          <div className="flex items-start justify-between border-b border-crease pb-4 gap-4">
            <div>
              <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
                {t("landing.writeLetterToFuture")}
              </h2>
              <span className="postmark-stamp text-xs py-0.5 px-2.5 inline-block mt-2">
                {currentDateFormatted}
              </span>
              {!selectedStampId && (
                <p className="mt-2 max-w-[24ch] text-[11px] font-letter text-foreground-muted leading-snug">
                  {t("landing.stampHint")}
                </p>
              )}
            </div>

            <div className="shrink-0 flex flex-col items-center">
              {selectedStampId ? (
                <div className="flex flex-col items-center">
                  <Stamp
                    slug={selectedStampId}
                    svgContent={
                      currentStamp?.svg_content || currentStamp?.svgContent
                    }
                    name={currentStamp?.name}
                    categorySlug={
                      currentStamp?.category_slug || currentStamp?.categorySlug
                    }
                    size="md"
                    interactive
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="landing-content"
                  className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block"
                >
                  {t("landing.yourLetter")}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextPrompt = getRandomInspiration(selectedPromptId);
                    if (!nextPrompt) return;
                    setSelectedPromptId(nextPrompt.slug);
                    track("inspire_prompt_selected", {
                      category_id:
                        nextPrompt.category_slug ||
                        nextPrompt.categorySlug ||
                        "",
                      prompt_id: nextPrompt.slug,
                      source: "landing",
                      locale,
                    });
                    requestAnimationFrame(() => {
                      contentTextareaRef.current?.focus();
                    });
                  }}
                  disabled={isLoadingInspirations && inspirations.length === 0}
                  aria-label={t("inspireMe.buttonAria")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-crease bg-manila/50 hover:border-wax hover:bg-manila text-foreground font-letter text-[11px] font-semibold tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={13} className="text-wax shrink-0" />
                  <span>{t("inspireMe.buttonLabel")}</span>
                </button>
              </div>
              {selectedPrompt && (
                <InspirationPromptLabel
                  promptText={selectedPrompt.text}
                  onRemove={() => setSelectedPromptId(null)}
                />
              )}
              <textarea
                id="landing-content"
                ref={contentTextareaRef}
                value={content}
                onChange={(e) => {
                  trackLandingStartIfNeeded();
                  funnel.trackStart(e.target.value);
                  setContent(e.target.value);
                }}
                placeholder={
                  selectedPrompt
                    ? ""
                    : t("landing.letterPlaceholderGuide", {
                        horizon: letterPlaceholderHorizon,
                      })
                }
                rows={7}
                maxLength={2000}
                required
                data-ph-no-capture="true"
                aria-invalid={showContentError}
                aria-describedby={
                  showContentError
                    ? "landing-content-error landing-content-counter"
                    : "landing-content-counter"
                }
                className={cn(
                  "w-full p-4 sm:p-5 border rounded-xs font-letter text-base sm:text-sm leading-loose text-foreground placeholder:text-foreground-muted focus:outline-none transition-all shadow-inner bg-transparent",
                  showContentError
                    ? "border-wax bg-wax/5 focus:border-wax"
                    : "border-crease focus:border-wax",
                )}
              />
              <div className="h-0.5 w-full bg-crease/60" aria-hidden="true">
                <div
                  className="h-full bg-ink transition-[width] duration-200"
                  style={{ width: `${counterProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-start gap-3 text-[11px] font-letter text-foreground-muted pt-1">
                <span className="italic">{t("landing.onlyYouCanSee")}</span>
                <span
                  id="landing-content-counter"
                  className={cn(
                    "text-right transition-colors",
                    charCount >= 80
                      ? "text-ink font-semibold"
                      : "text-foreground-muted",
                  )}
                >
                  {counterText}
                </span>
              </div>
              {showContentError && (
                <p
                  id="landing-content-error"
                  className="text-[11px] font-letter text-wax pt-0.5 animate-fade-in"
                  aria-live="polite"
                >
                  {contentError}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block">
                {t("landing.whenToReceive")}
              </label>
              <div
                role="group"
                aria-label={t("landing.deliveryDateAria")}
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-letter"
              >
                <button
                  type="button"
                  onClick={() => handlePresetDate(180, "6m")}
                  aria-pressed={selectedHorizonDays === 180 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 180 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {t("landing.horizonMonths6")}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDate(365, "1y")}
                  aria-pressed={selectedHorizonDays === 365 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 365 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {t("landing.horizonYear1")}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDate(1095, "3y")}
                  aria-pressed={selectedHorizonDays === 1095 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 1095 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {t("landing.horizonYears3")}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDate(1825, "5y")}
                  aria-pressed={selectedHorizonDays === 1825 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 1825 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {t("landing.horizonYears5")}
                </button>
                <button
                  type="button"
                  onClick={handleToggleCustomDate}
                  aria-pressed={showCustomDate}
                  className={cn(
                    "col-span-2 sm:col-span-1 py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {t("landing.customDate")}
                </button>
              </div>

              {showCustomDate && (
                <div className="animate-fade-in pt-1">
                  <div className="archival-folder rounded-xs p-3 border border-crease">
                    <label
                      htmlFor="landing-custom-date"
                      className="text-xs text-foreground-muted font-letter uppercase tracking-wider block mb-1 font-semibold"
                    >
                      {t("landing.chooseSpecificDate")}
                    </label>
                    <ArchivalDatePicker
                      id="landing-custom-date"
                      value={customDate}
                      onChange={handleCustomDateChange}
                      min={minCustomDate}
                      locale={locale}
                      placeholder={t("landing.chooseSpecificDate")}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-crease pt-5 space-y-4">
              <div className="border-b border-crease pb-2 space-y-0.5">
                <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
                  {t("landing.predictionsTitle")}
                </h3>
                <p className="text-[11px] font-letter text-foreground-muted">
                  {t("landing.predictionsHint")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-letter">
                <div className="space-y-1">
                  <label
                    htmlFor="pred-city"
                    className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-70">01.</span>
                    <span>{t("landing.predCityQuestion")}</span>
                  </label>
                  <input
                    id="pred-city"
                    type="text"
                    value={predictionCity}
                    onChange={(e) => setPredictionCity(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    onBlur={handlePredictionBlur}
                    className="w-full paper-sheet rounded-xs px-3 py-2.5 min-h-[44px] text-base sm:text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-career"
                    className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-70">02.</span>
                    <span>{t("landing.predCareerQuestion")}</span>
                  </label>
                  <input
                    id="pred-career"
                    type="text"
                    value={predictionCareer}
                    onChange={(e) => setPredictionCareer(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    onBlur={handlePredictionBlur}
                    className="w-full paper-sheet rounded-xs px-3 py-2.5 min-h-[44px] text-base sm:text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-salary"
                    className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-70">03.</span>
                    <span>{t("landing.predSalaryQuestion")}</span>
                  </label>
                  <input
                    id="pred-salary"
                    type="text"
                    value={predictionSalary}
                    onChange={(e) => setPredictionSalary(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    onBlur={handlePredictionBlur}
                    className="w-full paper-sheet rounded-xs px-3 py-2.5 min-h-[44px] text-base sm:text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-relationship"
                    className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-70">04.</span>
                    <span>{t("landing.predRelationshipQuestion")}</span>
                  </label>
                  <input
                    id="pred-relationship"
                    type="text"
                    value={predictionRelationship}
                    onChange={(e) => setPredictionRelationship(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    onBlur={handlePredictionBlur}
                    className="w-full paper-sheet rounded-xs px-3 py-2.5 min-h-[44px] text-base sm:text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label
                    htmlFor="pred-achievement"
                    className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-70">05.</span>
                    <span>{t("landing.predAchievementQuestion")}</span>
                  </label>
                  <input
                    id="pred-achievement"
                    type="text"
                    value={predictionAchievement}
                    onChange={(e) => setPredictionAchievement(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    onBlur={handlePredictionBlur}
                    className="w-full paper-sheet rounded-xs px-3 py-2.5 min-h-[44px] text-base sm:text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-crease pt-5 space-y-3">
              <div className="border-b border-crease pb-2 space-y-0.5">
                <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
                  {t("landing.feelTitle")}
                </h3>
                <p className="text-[11px] font-letter text-foreground-muted">
                  {t("landing.feelHint")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xs px-2 sm:px-3 py-2 bg-crease/15 border border-crease/60">
                  <Slider
                    label={t("landing.happiness")}
                    value={happiness}
                    onChange={setHappiness}
                  />
                </div>
                <div className="rounded-xs px-2 sm:px-3 py-2 bg-crease/15 border border-crease/60">
                  <Slider
                    label={t("landing.anxiety")}
                    value={anxiety}
                    onChange={setAnxiety}
                    accentColor="ink"
                  />
                </div>
                <div className="rounded-xs px-2 sm:px-3 py-2 bg-crease/15 border border-crease/60">
                  <Slider
                    label={t("landing.motivation")}
                    value={motivation}
                    onChange={setMotivation}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <label
                htmlFor="landing-email"
                className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block"
              >
                {t("landing.whereDeliverEmail")}
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="landing-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("landing.emailPlaceholder")}
                  required
                  className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-base sm:text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
                  autoComplete="email"
                  inputMode="email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => funnel.trackSubmit(funnelSummary)}
                  className={cn(
                    "bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-6 py-3 text-xs font-semibold tracking-widest uppercase font-letter inline-flex items-center justify-center gap-2 border-none shadow-xs shrink-0 min-h-[44px] cursor-pointer transition-colors",
                    isSubmitting && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <span>
                    {isSubmitting
                      ? t("landing.sealing")
                      : t("landing.sealAndSend")}
                  </span>
                  <Mail size={15} />
                </button>
              </div>
            </div>

            <p className="flex items-center gap-2.5 text-[11px] font-letter text-foreground-muted">
              <span className="postmark-stamp text-[10px] py-0.5 px-2 inline-block">
                {t("landing.freeBadge")}
              </span>
              <span>{t("landing.freeNote")}</span>
            </p>

            <div className="flex items-center justify-center gap-2 text-[11px] font-letter text-foreground-muted pt-2 border-t border-crease">
              <ShieldCheck size={14} className="text-ink" />
              <span>{t("landing.privateAndEncrypted")}</span>
            </div>
          </form>
        </div>
      </section>

      <SocialProof />

      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {t("landing.demoTitle")}
          </h2>
          <p className="text-xs font-letter text-foreground-muted max-w-md mx-auto leading-relaxed">
            {t("landing.demoDossierSubtitle")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-xl sm:rounded-2xl border border-crease bg-manila/20 dark:bg-manila/10 shadow-xl overflow-hidden font-ui text-foreground transition-all duration-300">
          <div className="bg-manila/50 dark:bg-manila/30 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 border-b border-crease select-none">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ec6a5e] border border-[#d04e41]/60 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-[#f4bf4f] border border-[#d79f38]/60 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-[#61c554] border border-[#4ea73b]/60 inline-block shadow-2xs" />
              </div>
              <div className="hidden sm:flex items-center gap-1 text-foreground-muted/50">
                <button
                  type="button"
                  aria-label="Back"
                  disabled
                  className="p-1 rounded opacity-40 cursor-default"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Forward"
                  disabled
                  className="p-1 rounded opacity-40 cursor-default"
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Reload"
                  className="p-1 rounded text-foreground-muted hover:text-foreground transition-transform active:rotate-180"
                >
                  <RotateCw size={12} />
                </button>
              </div>
            </div>

            <div className="flex-1 max-w-md sm:max-w-xl mx-auto bg-parchment dark:bg-manila/30 border border-crease rounded-md sm:rounded-lg px-3 py-1 flex items-center justify-between text-xs font-letter shadow-inner transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Lock
                  size={12}
                  className="text-emerald-600 dark:text-emerald-400 shrink-0"
                />
                <span className="text-foreground-muted/60 select-none text-[11px] hidden sm:inline">
                  https://
                </span>
                <span className="text-foreground font-semibold text-[11px] sm:text-xs">
                  timeecho.me
                </span>
                <span className="text-foreground-muted text-[11px] sm:text-xs truncate">
                  /letters/te-00108
                </span>
              </div>
            </div>

            <div className="w-12 sm:w-24 flex justify-end shrink-0">
              <span
                className="p-1 text-foreground-muted/60 cursor-default select-none"
                title={t("landing.viewFolioInVault")}
              >
                <ExternalLink size={14} />
              </span>
            </div>
          </div>

          <div className="relative w-full bg-[#FAF9F5] dark:bg-[#16181D]">
            <Image
              src={`/images/letter-preview-${locale}.png`}
              alt={t("landing.demoTitle")}
              width={1897}
              height={1030}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto block select-none"
              priority
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="space-y-12 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="text-xs font-letter text-foreground-muted max-w-xs mx-auto leading-relaxed">
            {t("landing.howItWorksSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-2 text-center">
            <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
              {t("landing.step1Title")}
            </h3>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.step1Text")}
            </p>
          </div>

          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-2 text-center">
            <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
              {t("landing.step2Title")}
            </h3>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.step2Text")}
            </p>
          </div>

          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-2 text-center">
            <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
              {t("landing.step3Title")}
            </h3>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.step3Text")}
            </p>
          </div>
        </div>
      </section>

      <section
        id="protection"
        className="max-w-5xl mx-auto w-full scroll-mt-24 archival-folder rounded-xs border border-crease p-5 sm:p-8 space-y-6"
      >
        <div className="space-y-1.5 max-w-xl">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {t("landing.protectTitle")}
          </h2>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            {t("landing.protectIntro")}
          </p>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-crease border-y border-crease">
          <div className="py-4 md:py-5 md:pr-6 space-y-1.5">
            <dt className="font-serif-editorial text-lg font-semibold text-foreground">
              <span className="font-letter text-sm text-wax mr-2">§1</span>
              {t("landing.protectQ1")}
            </dt>
            <dd className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.protectA1")}
            </dd>
          </div>
          <div className="py-4 md:py-5 md:px-6 space-y-1.5">
            <dt className="font-serif-editorial text-lg font-semibold text-foreground">
              <span className="font-letter text-sm text-wax mr-2">§2</span>
              {t("landing.protectQ2")}
            </dt>
            <dd className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.protectA2")}
            </dd>
          </div>
          <div className="py-4 md:py-5 md:pl-6 space-y-1.5">
            <dt className="font-serif-editorial text-lg font-semibold text-foreground">
              <span className="font-letter text-sm text-wax mr-2">§3</span>
              {t("landing.protectQ3")}
            </dt>
            <dd className="text-xs font-letter text-foreground-muted leading-relaxed">
              {t("landing.protectA3")}
            </dd>
          </div>
        </dl>

        <Link
          href="/privacy"
          className="inline-block text-xs font-letter font-semibold uppercase tracking-wider text-ink underline underline-offset-4 hover:text-wax transition-colors"
        >
          {t("landing.protectPrivacyLink")}
        </Link>
      </section>

      <section
        aria-label={t("common.appName")}
        className="max-w-5xl mx-auto px-4 border-t border-crease pt-8 text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-1.5 text-xl font-serif-editorial text-foreground select-none font-semibold">
          <span>TimeEcho</span>
        </div>
        <p className="text-xs font-letter text-foreground-muted leading-relaxed">
          {t("footer.sentWithHope")}
        </p>
      </section>

      {isSubmitting && (
        <ArchivalLoader
          variant="full"
          className="fixed inset-0 z-50"
          title={t("composer.sealingVaultModalTitle")}
          subtitle={t("composer.sealingVaultModalDesc")}
        />
      )}

      <StampPickerModal
        isOpen={isStampPickerOpen}
        onClose={() => setIsStampPickerOpen(false)}
        selectedStampId={selectedStampId || undefined}
        onSelectStamp={(id) => {
          setSelectedStampId(id || null);
          if (id) {
            const stampInfo = findStamp(id);
            track("stamp_selected", {
              stamp_slug: id,
              category_slug:
                stampInfo?.category_slug || stampInfo?.categorySlug,
              source: "landing",
            });
          }
        }}
      />
    </div>
  );
}
