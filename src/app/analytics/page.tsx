"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  AccuracyMeter,
  EmotionalShiftGauge,
  calculateAnalyticsMetrics,
} from "@/features/analytics";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  const { capsules, locale } = useTimeEcho();
  const isEs = locale === "es";

  const metrics = calculateAnalyticsMetrics(capsules);

  const baselineState =
    metrics.emotionalAverages.baseline.happiness > 0
      ? metrics.emotionalAverages.baseline
      : { happiness: 6, anxiety: 4, motivation: 7 };

  const revealState =
    metrics.emotionalAverages.reveal.happiness > 0
      ? metrics.emotionalAverages.reveal
      : { happiness: 8, anxiety: 2, motivation: 8 };

  const deltaState =
    metrics.emotionalAverages.reveal.happiness > 0
      ? metrics.emotionalAverages.delta
      : {
          happiness: revealState.happiness - baselineState.happiness,
          anxiety: revealState.anxiety - baselineState.anxiety,
          motivation: revealState.motivation - baselineState.motivation,
        };

  const accuracyRate =
    metrics.evaluatedPredictionsCount > 0
      ? metrics.predictionsAccuracyRate
      : metrics.totalPredictionsCount > 0
        ? 0
        : 75;

  const evaluatedCount =
    metrics.evaluatedPredictionsCount > 0
      ? metrics.evaluatedPredictionsCount
      : 4;

  const matchedCount =
    metrics.evaluatedPredictionsCount > 0
      ? metrics.matchedPredictionsCount
      : 3;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-crease">
        <div className="space-y-1">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
            {isEs
              ? "Reflexión y Estadísticas del Baúl"
              : "Vault Reflection & Analytics"}
          </h1>
          <p className="text-xs font-letter text-foreground-muted tracking-wider">
            {isEs
              ? "Una retrospectiva pacífica de tu evolución emocional, predicciones y métricas de entrega de tus cápsulas."
              : "A serene retrospective of your emotional evolution, predictions, and delivery metrics."}
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/dashboard"
            className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[44px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-wax"
          >
            <ArrowLeft size={14} />
            <span>{isEs ? "Volver al Baúl" : "Back to Vault"}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-letter">
        <div className="paper-sheet border border-crease p-5 rounded-xs text-center shadow-xs">
          <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
            {isEs ? "Total Cápsulas" : "Total Capsules"}
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {metrics.totalLetters}
          </p>
        </div>
        <div className="paper-sheet border border-crease p-5 rounded-xs text-center shadow-xs">
          <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
            {isEs ? "Entregadas" : "Delivered"}
          </p>
          <p className="text-2xl font-bold text-ink mt-1">
            {metrics.deliveredCount + metrics.openedCount}
          </p>
        </div>
        <div className="paper-sheet border border-crease p-5 rounded-xs text-center shadow-xs col-span-2 md:col-span-1">
          <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
            {isEs ? "En Tránsito" : "In Transit"}
          </p>
          <p className="text-2xl font-bold text-wax mt-1">
            {metrics.inTransitCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <EmotionalShiftGauge
          baseline={baselineState}
          reveal={revealState}
          delta={deltaState}
        />

        <AccuracyMeter
          rate={accuracyRate}
          evaluatedCount={evaluatedCount}
          matchedCount={matchedCount}
          pendingCount={metrics.inTransitCount}
        />
      </div>
    </div>
  );
}
