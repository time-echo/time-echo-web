"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PredictionCategory } from "@/types/timeecho";
import Image from "next/image";
import {
  Lock,
  Clock,
  Sparkles,
  ShieldCheck,
  Mail,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { Stamp, StampPickerModal } from "@/components/stamps";

export default function HomePage() {
  const router = useRouter();
  const { locale, createCapsule, t } = useTimeEcho();

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
  const [customDate, setCustomDate] = useState<string>("");
  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
  const [isStampPickerOpen, setIsStampPickerOpen] = useState<boolean>(false);

  const [predictionCity, setPredictionCity] = useState("");
  const [predictionCareer, setPredictionCareer] = useState("");
  const [predictionSalary, setPredictionSalary] = useState("");
  const [predictionRelationship, setPredictionRelationship] = useState("");
  const [predictionAchievement, setPredictionAchievement] = useState("");

  const [happiness, setHappiness] = useState(6);
  const [anxiety, setAnxiety] = useState(4);
  const [motivation, setMotivation] = useState(7);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minCustomDate] = useState(
    () => new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );

  const currentDateFormatted = formatLocaleDate(
    new Date().toISOString(),
    locale,
  );

  const handlePresetDate = (days: number) => {
    setSelectedHorizonDays(days);
    setShowCustomDate(false);
  };

  const handleToggleCustomDate = () => {
    setShowCustomDate(true);
    setSelectedHorizonDays(0);
  };

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isContentTouched, setIsContentTouched] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (content.trim().length < 80) {
      contentTextareaRef.current?.focus();
      return;
    }

    if (!email.trim()) return;

    setIsSubmitting(true);

    const deliverDate = new Date();
    if (showCustomDate && customDate) {
      const parsed = new Date(customDate);
      if (!isNaN(parsed.getTime())) {
        deliverDate.setTime(parsed.getTime());
      } else {
        deliverDate.setDate(deliverDate.getDate() + 365);
      }
    } else {
      deliverDate.setDate(deliverDate.getDate() + (selectedHorizonDays || 365));
    }

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
      const capsule = await createCapsule({
        title: t("landing.defaultTitle"),
        content,
        email,
        scheduledAt: deliverDate.toISOString(),
        stampId: selectedStampId || undefined,
        emotionalSnapshot: {
          happinessLevel: happiness,
          anxietyLevel: anxiety,
          motivationLevel: motivation,
        },
        predictions: predictionsList,
      });

      router.push(`/letters/success?id=${encodeURIComponent(capsule.id)}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const isContentTooShort = content.trim().length < 80;
  const showContentError =
    isContentTooShort &&
    (hasAttemptedSubmit || (isContentTouched && content.length > 0));

  return (
    <div className="space-y-24 max-w-6xl mx-auto -mt-4 font-ui animate-fade-in text-foreground">
      {/* ===================================================================
          HERO SECTION: 2-COLUMN GRID (Features + Live Letter Card)
          =================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
        {/* Left Column: Headlines & 3 Archival Feature Cards */}
        <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-24">
          <div className="space-y-4">
            <h1 className="font-serif-editorial text-4xl sm:text-6xl font-normal text-foreground leading-tight tracking-tight">
              {t("landing.heroTitleLine1")}
              <br />
              {t("landing.heroTitleLine2")}
            </h1>

            <p className="font-letter text-xs sm:text-sm text-foreground-muted leading-relaxed max-w-xl">
              {t("landing.heroSubtitle")}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="paper-sheet rounded-xs p-4 border border-crease flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xs bg-wax/10 text-wax flex items-center justify-center shrink-0 border border-wax/20">
                <Lock size={16} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-letter font-semibold uppercase tracking-wider text-foreground">
                  {t("landing.trustPrivate")}
                </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {t("landing.trustPrivateDesc")}
                </p>
              </div>
            </div>

            <div className="paper-sheet rounded-xs p-4 border border-crease flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xs bg-ink/10 text-ink flex items-center justify-center shrink-0 border border-ink/20">
                <Clock size={16} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-letter font-semibold uppercase tracking-wider text-foreground">
                  {t("landing.trustSchedule")}
                </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {t("landing.trustScheduleDesc")}
                </p>
              </div>
            </div>

            <div className="paper-sheet rounded-xs p-4 border border-crease flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xs bg-ink/10 text-ink flex items-center justify-center shrink-0 border border-ink/20">
                <Sparkles size={16} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-letter font-semibold uppercase tracking-wider text-foreground">
                  {t("landing.trustReality")}
                </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {t("landing.trustRealityDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 paper-sheet rounded-xs p-6 sm:p-8 space-y-6 border border-crease">
          <div className="flex items-start justify-between border-b border-crease pb-4 gap-4">
            <div>
              <span className="text-xs font-letter uppercase tracking-widest text-foreground-muted block">
                {t("landing.step01Label")}
              </span>
              <h2 className="font-serif-editorial text-2xl text-foreground font-semibold mt-0.5">
                {t("landing.writeLetterToFuture")}
              </h2>
              <span className="postmark-stamp text-xs py-0.5 px-2.5 inline-block mt-2">
                {currentDateFormatted}
              </span>
            </div>

            <div className="shrink-0 flex flex-col items-center">
              {selectedStampId ? (
                <div className="flex flex-col items-center">
                  <Stamp
                    id={selectedStampId}
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
              <label
                htmlFor="landing-content"
                className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block"
              >
                {t("landing.yourLetter")}
              </label>
              <textarea
                id="landing-content"
                ref={contentTextareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => setIsContentTouched(true)}
                placeholder={t("landing.letterPlaceholder")}
                rows={7}
                maxLength={2000}
                required
                aria-invalid={showContentError}
                aria-describedby={
                  showContentError
                    ? "landing-content-error landing-content-counter"
                    : "landing-content-counter"
                }
                className={cn(
                  "w-full p-4 sm:p-5 border rounded-xs font-letter text-sm leading-loose text-foreground placeholder:text-foreground-muted focus:outline-none transition-all shadow-inner bg-transparent",
                  showContentError
                    ? "border-wax bg-wax/5 focus:border-wax"
                    : "border-crease focus:border-wax",
                )}
              />
              <div className="flex justify-between items-center text-[11px] font-letter text-foreground-muted pt-1">
                <span className="italic">{t("landing.onlyYouCanSee")}</span>
                <span
                  id="landing-content-counter"
                  className={cn(
                    "transition-colors",
                    showContentError
                      ? "text-wax font-semibold"
                      : charCount >= 80
                        ? "text-foreground"
                        : "text-foreground-muted",
                  )}
                >
                  {charCount < 80
                    ? t("landing.charCounterMin", { count: charCount })
                    : `${charCount} / 2000`}
                </span>
              </div>
              {showContentError && (
                <p
                  id="landing-content-error"
                  className="text-[11px] font-letter text-wax pt-0.5 animate-fade-in"
                  aria-live="polite"
                >
                  {t("landing.minCharsError")}
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
                  onClick={() => handlePresetDate(180)}
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
                  onClick={() => handlePresetDate(365)}
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
                  onClick={() => handlePresetDate(1095)}
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
                  onClick={() => handlePresetDate(1825)}
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
                    <input
                      id="landing-custom-date"
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={minCustomDate}
                      className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground focus:border-wax focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-crease pt-5 space-y-4">
              <div className="border-b border-crease pb-2">
                <span className="text-xs font-letter uppercase tracking-widest text-foreground-muted block">
                  {t("landing.annexPredictions")}
                </span>
                <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block mt-0.5">
                  {t("landing.predictionsOptional")}
                </label>
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
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
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
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
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
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
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
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
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
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-crease pt-5 space-y-3">
              <div className="border-b border-crease pb-1.5">
                <span className="text-xs font-letter uppercase tracking-widest text-foreground-muted block">
                  {t("landing.annexEmotionalBadge")}
                </span>
                <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block mt-0.5">
                  {t("landing.howDoYouFeelToday")}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-letter">
                <div className="rounded-xs p-3 bg-crease/15 border border-crease/60 space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-foreground">
                    <span>{t("landing.happiness")}</span>
                    <span className="text-foreground-muted">
                      {happiness} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={happiness}
                    onChange={(e) => setHappiness(Number(e.target.value))}
                    aria-label={t("landing.happiness")}
                    className="w-full accent-wax cursor-pointer"
                  />
                </div>

                <div className="rounded-xs p-3 bg-crease/15 border border-crease/60 space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-foreground">
                    <span>{t("landing.anxiety")}</span>
                    <span className="text-foreground-muted">
                      {anxiety} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={anxiety}
                    onChange={(e) => setAnxiety(Number(e.target.value))}
                    aria-label={t("landing.anxiety")}
                    className="w-full accent-wax cursor-pointer"
                  />
                </div>

                <div className="rounded-xs p-3 bg-crease/15 border border-crease/60 space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-foreground">
                    <span>{t("landing.motivation")}</span>
                    <span className="text-foreground-muted">
                      {motivation} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={motivation}
                    onChange={(e) => setMotivation(Number(e.target.value))}
                    aria-label={t("landing.motivation")}
                    className="w-full accent-wax cursor-pointer"
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
                  placeholder="tu@email.com"
                  required
                  className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
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

            <div className="flex items-center justify-center gap-2 text-[11px] font-letter text-foreground-muted pt-2 border-t border-crease">
              <ShieldCheck size={14} className="text-ink" />
              <span>{t("landing.privateAndEncrypted")}</span>
            </div>
          </form>
        </div>
      </section>

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

      <footer className="max-w-5xl mx-auto px-4 border-t border-crease pt-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xl font-serif-editorial text-foreground select-none font-semibold">
          <span>TimeEcho</span>
        </div>
        <p className="text-xs font-letter text-foreground-muted leading-relaxed">
          {t("footer.sentWithHope")}
        </p>
      </footer>

      <StampPickerModal
        isOpen={isStampPickerOpen}
        onClose={() => setIsStampPickerOpen(false)}
        selectedStampId={selectedStampId || undefined}
        onSelectStamp={(id) => setSelectedStampId(id || null)}
      />
    </div>
  );
}
