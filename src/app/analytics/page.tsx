"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { calculateAnalyticsMetrics } from "@/features/analytics";
import { ArrowLeft, Brain, Sparkles } from "lucide-react";

export default function AnalyticsPage() {
  const { capsules, t } = useTimeEcho();

  const metrics = calculateAnalyticsMetrics(capsules);

  const totalLetters = metrics.totalLetters;
  const deliveredLetters = metrics.deliveredCount + metrics.openedCount;
  const scheduledLetters = metrics.inTransitCount;

  const totalPredictions = metrics.totalPredictionsCount;
  const completedPredictions = metrics.evaluatedPredictionsCount;
  const matchedPredictions = metrics.matchedPredictionsCount;
  const pendingPredictions = totalPredictions - completedPredictions;
  const predictionMatchRate = metrics.predictionsAccuracyRate;

  const avgInitialHappiness = metrics.emotionalAverages.baseline.happiness;
  const avgInitialAnxiety = metrics.emotionalAverages.baseline.anxiety;
  const avgInitialMotivation = metrics.emotionalAverages.baseline.motivation;

  const avgRevealHappiness = metrics.emotionalAverages.reveal.happiness;
  const avgRevealAnxiety = metrics.emotionalAverages.reveal.anxiety;
  const avgRevealMotivation = metrics.emotionalAverages.reveal.motivation;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#D8D2C2] dark:border-[#2D3340]">
        <div className="space-y-1">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
            {t("analytics.title")}
          </h1>
          <p className="text-xs font-letter text-foreground/60 tracking-wider">
            {t("analytics.subtitle")}
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/dashboard"
            className="border border-[#D8D2C2] dark:border-[#2D3340] text-foreground hover:bg-manila/50 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[40px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-wax"
          >
            <ArrowLeft size={14} />
            <span>{t("analytics.back_to_vault")}</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-letter">
        <div className="paper-sheet border border-[#D8D2C2] dark:border-[#2D3340] p-5 rounded-xs text-center shadow-xs">
          <p className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">
            {t("analytics.total_capsules")}
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {totalLetters}
          </p>
        </div>
        <div className="paper-sheet border border-[#D8D2C2] dark:border-[#2D3340] p-5 rounded-xs text-center shadow-xs">
          <p className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">
            {t("analytics.delivered")}
          </p>
          <p className="text-2xl font-bold text-[#2C485E] dark:text-[#77A3C4] mt-1">
            {deliveredLetters}
          </p>
        </div>
        <div className="paper-sheet border border-[#D8D2C2] dark:border-[#2D3340] p-5 rounded-xs text-center shadow-xs col-span-2 md:col-span-1">
          <p className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">
            {t("analytics.in_transit")}
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            {scheduledLetters}
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Emotional Evolution Averages */}
        <div className="paper-sheet border border-[#D8D2C2] dark:border-[#2D3340] p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#D8D2C2] dark:border-[#2D3340] pb-3.5">
            <Brain size={20} className="text-[#2C485E] dark:text-[#77A3C4]" />
            <h2 className="font-serif-editorial text-xl font-semibold text-foreground">
              {t("analytics.emotional_evolution_title")}
            </h2>
          </div>
          <p className="text-xs font-letter text-foreground/60 leading-relaxed">
            {t("analytics.emotional_evolution_desc")}
          </p>

          <div className="space-y-6 pt-2 font-letter">
            {/* Happiness Index */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground/85 uppercase text-[10px] tracking-wider">
                  {t("analytics.happiness_index")}
                </span>
                <span className="text-foreground/70">
                  {avgInitialHappiness} &rarr; {avgRevealHappiness}
                </span>
              </div>
              <div
                className="relative bg-manila/60 h-2.5 rounded-xs overflow-hidden border border-[#D8D2C2]/50 dark:border-[#2D3340]"
                role="progressbar"
                aria-label={t("analytics.happiness_index")}
                aria-valuenow={avgRevealHappiness}
                aria-valuemin={1}
                aria-valuemax={10}
              >
                <div
                  className="bg-[#8E2818]/25 absolute top-0 left-0 h-full rounded-xs"
                  style={{ width: `${Math.min(avgInitialHappiness * 10, 100)}%` }}
                />
                <div
                  className="bg-[#8E2818] absolute top-0 left-0 h-full rounded-xs opacity-85"
                  style={{ width: `${Math.min(avgRevealHappiness * 10, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-foreground/60 uppercase tracking-wider">
                <span>{t("analytics.your_past")}</span>
                <span>{t("analytics.your_present")}</span>
              </div>
            </div>

            {/* Anxiety Index */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground/85 uppercase text-[10px] tracking-wider">
                  {t("analytics.anxiety_index")}
                </span>
                <span className="text-foreground/70">
                  {avgInitialAnxiety} &rarr; {avgRevealAnxiety}
                </span>
              </div>
              <div
                className="relative bg-manila/60 h-2.5 rounded-xs overflow-hidden border border-[#D8D2C2]/50 dark:border-[#2D3340]"
                role="progressbar"
                aria-label={t("analytics.anxiety_index")}
                aria-valuenow={avgRevealAnxiety}
                aria-valuemin={1}
                aria-valuemax={10}
              >
                <div
                  className="bg-[#2C485E]/25 absolute top-0 left-0 h-full rounded-xs"
                  style={{ width: `${Math.min(avgInitialAnxiety * 10, 100)}%` }}
                />
                <div
                  className="bg-[#2C485E] dark:bg-[#77A3C4] absolute top-0 left-0 h-full rounded-xs opacity-85"
                  style={{ width: `${Math.min(avgRevealAnxiety * 10, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-foreground/60 uppercase tracking-wider">
                <span>{t("analytics.your_past")}</span>
                <span>{t("analytics.your_present")}</span>
              </div>
            </div>

            {/* Motivation Index */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground/85 uppercase text-[10px] tracking-wider">
                  {t("analytics.motivation_index")}
                </span>
                <span className="text-foreground/70">
                  {avgInitialMotivation} &rarr; {avgRevealMotivation}
                </span>
              </div>
              <div
                className="relative bg-manila/60 h-2.5 rounded-xs overflow-hidden border border-[#D8D2C2]/50 dark:border-[#2D3340]"
                role="progressbar"
                aria-label={t("analytics.motivation_index")}
                aria-valuenow={avgRevealMotivation}
                aria-valuemin={1}
                aria-valuemax={10}
              >
                <div
                  className="bg-amber-600/25 absolute top-0 left-0 h-full rounded-xs"
                  style={{ width: `${Math.min(avgInitialMotivation * 10, 100)}%` }}
                />
                <div
                  className="bg-amber-700 dark:bg-amber-400 absolute top-0 left-0 h-full rounded-xs opacity-85"
                  style={{ width: `${Math.min(avgRevealMotivation * 10, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-foreground/60 uppercase tracking-wider">
                <span>{t("analytics.your_past")}</span>
                <span>{t("analytics.your_present")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Predictions vs Reality */}
        <div className="paper-sheet border border-[#D8D2C2] dark:border-[#2D3340] p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#D8D2C2] dark:border-[#2D3340] pb-3.5">
            <Sparkles size={20} className="text-[#2C485E] dark:text-[#77A3C4]" />
            <h2 className="font-serif-editorial text-xl font-semibold text-foreground">
              {t("analytics.predictions_reality_title")}
            </h2>
          </div>
          <p className="text-xs font-letter text-foreground/60 leading-relaxed">
            {t("analytics.predictions_reality_desc")}
          </p>

          <div className="flex flex-col items-center justify-center py-4 space-y-5 font-letter">
            <div
              className="radial-progress text-[#2C485E] dark:text-[#77A3C4] text-3xl font-bold"
              style={{
                ["--value" as string]: predictionMatchRate,
                ["--size" as string]: "8.5rem",
                ["--thickness" as string]: "8px",
              }}
              role="progressbar"
              aria-valuenow={predictionMatchRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${t("analytics.match_rate_label")}: ${predictionMatchRate}%`}
            >
              {predictionMatchRate}%
            </div>

            <div className="text-center space-y-1">
              <p className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wider">
                {t("analytics.match_rate_label")}
              </p>
              <p className="text-xs text-foreground/60 leading-relaxed max-w-xs">
                {t("analytics.match_summary", {
                  matched: matchedPredictions,
                  completed: completedPredictions,
                  total: pendingPredictions,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
