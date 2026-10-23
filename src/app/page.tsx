"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PredictionCategory } from "@/types/timeecho";
import {
  Lock,
  Clock,
  Sparkles,
  ShieldCheck,
  Mail,
  FileText,
  Calendar,
  BarChart2,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !email.trim()) return;

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
  const isUnderMinChars = charCount < 80;

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
          <div className="flex items-center justify-between border-b border-crease pb-4">
            <div>
              <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                {t("landing.step01Label")}
              </span>
              <h2 className="font-serif-editorial text-2xl text-foreground font-semibold mt-0.5">
                {t("landing.writeLetterToFuture")}
              </h2>
            </div>
            <span className="postmark-stamp text-[10px] py-0.5 px-2.5">
              {currentDateFormatted}
            </span>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("landing.letterPlaceholder")}
                rows={7}
                maxLength={2000}
                required
                aria-describedby="landing-content-counter"
                className="w-full p-4 sm:p-5 border border-crease rounded-xs font-letter text-sm leading-loose text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-all shadow-inner bg-transparent"
              />
              <div className="flex justify-between items-center text-[11px] font-letter text-foreground-muted pt-1">
                <span className="italic">
                  {t("landing.onlyYouCanSee")}
                </span>
                <span
                  id="landing-content-counter"
                  className={cn(isUnderMinChars && "text-wax")}
                >
                  {isUnderMinChars
                    ? t("landing.charCounterMin", { count: charCount })
                    : `${charCount} / 2000`}
                </span>
              </div>
              {isUnderMinChars && (
                <p
                  className="text-[11px] font-letter text-wax pt-0.5"
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
                      className="text-[10px] text-foreground-muted font-letter uppercase tracking-wider block mb-1 font-semibold"
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

            <div className="archival-folder rounded-xs p-4 sm:p-5 space-y-4 border border-manila-border">
              <div className="border-b border-manila-border pb-2">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
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
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">01.</span>
                    <span>
                      {t("landing.predCityQuestion")}
                    </span>
                  </label>
                  <input
                    id="pred-city"
                    type="text"
                    value={predictionCity}
                    onChange={(e) => setPredictionCity(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-career"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">02.</span>
                    <span>
                      {t("landing.predCareerQuestion")}
                    </span>
                  </label>
                  <input
                    id="pred-career"
                    type="text"
                    value={predictionCareer}
                    onChange={(e) => setPredictionCareer(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-salary"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">03.</span>
                    <span>
                      {t("landing.predSalaryQuestion")}
                    </span>
                  </label>
                  <input
                    id="pred-salary"
                    type="text"
                    value={predictionSalary}
                    onChange={(e) => setPredictionSalary(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-relationship"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">04.</span>
                    <span>
                      {t("landing.predRelationshipQuestion")}
                    </span>
                  </label>
                  <input
                    id="pred-relationship"
                    type="text"
                    value={predictionRelationship}
                    onChange={(e) => setPredictionRelationship(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label
                    htmlFor="pred-achievement"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">05.</span>
                    <span>
                      {t("landing.predAchievementQuestion")}
                    </span>
                  </label>
                  <input
                    id="pred-achievement"
                    type="text"
                    value={predictionAchievement}
                    onChange={(e) => setPredictionAchievement(e.target.value)}
                    placeholder={t("landing.predPlaceholder")}
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="archival-folder rounded-xs p-4 sm:p-5 space-y-3 border border-manila-border">
              <div className="border-b border-manila-border pb-1.5">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {t("landing.annexEmotionalBadge")}
                </span>
                <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block mt-0.5">
                  {t("landing.howDoYouFeelToday")}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-letter">
                <div className="paper-sheet rounded-xs p-3 border border-crease space-y-1.5">
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

                <div className="paper-sheet rounded-xs p-3 border border-crease space-y-1.5">
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

                <div className="paper-sheet rounded-xs p-3 border border-crease space-y-1.5">
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
                  className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isUnderMinChars}
                  className={cn(
                    "bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-6 py-3 text-xs font-semibold tracking-widest uppercase font-letter inline-flex items-center justify-center gap-2 border-none shadow-xs shrink-0 min-h-[44px] cursor-pointer transition-colors",
                    (isSubmitting || isUnderMinChars) &&
                      "opacity-60 cursor-not-allowed",
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
              <span>
                {t("landing.privateAndEncrypted")}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* ===================================================================
          SECTION 2: HOW IT LOOKS WHEN OPENED (3-COLUMN DOSSIER PREVIEW)
          =================================================================== */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {t("landing.how_it_looks")}
          </h2>
          <p className="text-xs font-letter text-foreground-muted max-w-md mx-auto leading-relaxed">
            {t("landing.compare_reflect_desc")}
          </p>
        </div>

        <div className="paper-sheet rounded-xs border border-crease shadow-xs overflow-hidden max-w-5xl mx-auto font-ui relative">
          <div className="bg-manila/50 dark:bg-manila/30 px-5 py-3 border-b border-crease flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-wax inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-crease inline-block" />
            </div>
            <div className="font-letter text-[11px] text-foreground-muted tracking-wider">
              {t("landing.dossier_revealed")}
            </div>
            <div className="w-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            <aside className="md:col-span-3 archival-folder border-r border-crease p-6 flex flex-col justify-between space-y-6 select-none">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="postmark-stamp text-[10px] py-0.5 px-2">
                    {t("common.appName")}
                  </span>
                </div>

                <nav className="space-y-1 text-xs font-letter">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xs paper-sheet border border-crease font-semibold text-foreground">
                    <FileText size={15} />
                    <span>{t("common.vault")}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 text-foreground-muted">
                    <Calendar size={15} />
                    <span>{t("nav.timeline")}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 text-foreground-muted">
                    <BarChart2 size={15} />
                    <span>{t("nav.analytics")}</span>
                  </div>
                </nav>
              </div>

              <div className="border-t border-manila-border pt-4">
                <p className="text-[11px] font-letter italic text-foreground-muted/90 leading-relaxed">
                  &quot;{t("nav.quote")}&quot;
                </p>
              </div>
            </aside>

            <main className="md:col-span-9 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-transparent">
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-crease pb-2.5 flex items-center justify-between">
                  <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                    {t("landing.prediction_vs_reality")}
                  </h3>
                  <span className="postmark-stamp text-[10px] py-0.5 px-2">
                    {t("letters.revealed_and_compared")}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-letter">
                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {t("letters.prediction")}:
                        </span>
                        <span className="italic text-foreground/80">
                          {t("landing.mock_prediction_city")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {t("letters.reality")}:
                        </span>
                        <span>{t("landing.mock_reality_city")}</span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {t("letters.partially")}
                    </span>
                  </div>

                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {t("letters.prediction")}:
                        </span>
                        <span className="italic text-foreground/80">
                          {t("landing.mock_prediction_career")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {t("letters.reality")}:
                        </span>
                        <span>{t("landing.mock_reality_career")}</span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {t("letters.you_did_it")}
                    </span>
                  </div>

                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {t("letters.prediction")}:
                        </span>
                        <span className="italic text-foreground/80">
                          {t("landing.mock_prediction_salary")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {t("letters.reality")}:
                        </span>
                        <span>{t("landing.mock_reality_salary")}</span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {t("letters.superaste")}
                    </span>
                  </div>

                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {t("letters.prediction")}:
                        </span>
                        <span className="italic text-foreground/80">
                          {t("landing.mock_prediction_happiness")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {t("letters.reality")}:
                        </span>
                        <span>{t("landing.mock_reality_happiness")}</span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {t("letters.very_close")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="archival-folder rounded-xs p-4 border border-manila-border space-y-3">
                  <div>
                    <h4 className="text-[10px] font-letter font-semibold uppercase tracking-widest text-foreground-muted">
                      {t("letters.emotional_evolution")}
                    </h4>
                    <div className="flex gap-4 text-[10px] font-letter text-foreground-muted mt-1 select-none">
                      <span className="flex items-center gap-1">
                        <span className="border-b border-dashed border-foreground-muted w-3 inline-block" />{" "}
                        {t("landing.one_year_ago")}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <span className="border-b-2 border-wax w-3 inline-block" />{" "}
                        {t("landing.today")}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-32 flex items-end">
                    <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                      <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" opacity="0.1" strokeWidth="0.5" />
                      <line x1="0" y1="23" x2="100" y2="23" stroke="currentColor" opacity="0.1" strokeWidth="0.5" />
                      <line x1="0" y1="45" x2="100" y2="45" stroke="currentColor" opacity="0.1" strokeWidth="0.5" />

                      <path d="M 15 15 L 50 36 L 85 24" fill="none" stroke="currentColor" className="text-ink" strokeWidth="1.5" strokeDasharray="2 2" />
                      <circle cx="15" cy="15" r="1.5" className="fill-ink" />
                      <circle cx="50" cy="36" r="1.5" className="fill-ink" />
                      <circle cx="85" cy="24" r="1.5" className="fill-ink" />

                      <path d="M 15 10 L 50 40 L 85 5" fill="none" stroke="currentColor" className="text-wax" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="15" cy="10" r="2.2" className="fill-wax" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="50" cy="40" r="2.2" className="fill-wax" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="85" cy="5" r="2.2" className="fill-wax" stroke="currentColor" strokeWidth="0.5" />
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-letter font-semibold text-foreground-muted tracking-wider uppercase select-none">
                      <span>{t("common.happiness")}</span>
                      <span>{t("common.anxiety")}</span>
                      <span>{t("common.motivation")}</span>
                    </div>
                  </div>
                </div>

                <div className="paper-sheet rounded-xs p-4 border border-crease flex items-center gap-4">
                  <div
                    className="radial-progress text-ink font-letter text-lg font-bold shrink-0"
                    style={{
                      ["--value" as string]: 75,
                      ["--size" as string]: "4.5rem",
                      ["--thickness" as string]: "5px",
                    }}
                    role="progressbar"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    75%
                  </div>

                  <div className="space-y-0.5 font-letter text-xs">
                    <h5 className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                      {t("landing.your_overall_accuracy")}
                    </h5>
                    <p className="font-semibold text-foreground/90">
                      {t("landing.accurate_predictions")}
                    </p>
                    <p className="text-[10px] text-foreground-muted">
                      {t("landing.you_are_on_track")}
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="space-y-12 scroll-mt-24">
        <div className="text-center space-y-2">
          <div className="postmark-stamp text-[10px] py-0.5 px-2.5 mx-auto">
            {t("landing.howItWorksBadge")}
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="text-xs font-letter text-foreground-muted max-w-xs mx-auto leading-relaxed">
            {t("landing.howItWorksSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-3 text-center">
            <div className="wax-seal w-12 h-12 rounded-full mx-auto flex items-center justify-center text-on-wax font-letter font-bold text-sm select-none">
              01
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {t("landing.step1Title")}
              </h3>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {t("landing.step1Text")}
              </p>
            </div>
          </div>

          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-3 text-center">
            <div className="wax-seal w-12 h-12 rounded-full mx-auto flex items-center justify-center text-on-wax font-letter font-bold text-sm select-none">
              02
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {t("landing.step2Title")}
              </h3>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {t("landing.step2Text")}
              </p>
            </div>
          </div>

          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-3 text-center">
            <div className="wax-seal w-12 h-12 rounded-full mx-auto flex items-center justify-center text-on-wax font-letter font-bold text-sm select-none">
              03
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {t("landing.step3Title")}
              </h3>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {t("landing.step3Text")}
              </p>
            </div>
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
    </div>
  );
}
