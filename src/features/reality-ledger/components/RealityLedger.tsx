"use client";

import React from "react";
import { Letter } from "@/types/timeecho";
import { useRealityLedger } from "../hooks/useRealityLedger";
import { PredictionComparisonRow } from "./PredictionComparisonRow";
import { Slider } from "@/components/ui/Slider";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface RealityLedgerProps {
  capsule: Letter;
  onSettled?: (updated: Letter) => void;
  readOnly?: boolean;
  className?: string;
}

export function RealityLedger({
  capsule,
  onSettled,
  readOnly = false,
  className,
}: RealityLedgerProps) {
  const { t } = useTimeEcho();

  const {
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
  } = useRealityLedger(capsule);

  const baseSnapshot = capsule.emotionalSnapshot || {
    happinessLevel: 5,
    anxietyLevel: 5,
    motivationLevel: 5,
  };

  const handleSave = async () => {
    try {
      const updated = await saveRealityLedger();
      onSettled?.(updated);
    } catch {}
  };

  const isFormLocked = readOnly || isSaved;

  return (
    <div className={cn("space-y-8 select-none", className)}>
      <div className="p-6 rounded border border-crease bg-manila/80 shadow-sm flex flex-wrap items-center justify-between gap-4 font-letter">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-wax" />
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-ink">
              {t("reality.title")}
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            {t("reality.docketNo")}{" "}
            <strong className="text-ink font-semibold">
              {capsule.docketNumber}
            </strong>{" "}
            • {t("reality.subtitle")}
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-fulfilled-border bg-fulfilled-bg text-fulfilled text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} />
            <span>{t("reality.settledBadge")}</span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 rounded border border-crease bg-parchment shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-crease pb-3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-wax" />
            <h3 className="font-letter font-bold text-xs uppercase tracking-wider text-ink">
              {t("reality.evolutionTitle")}
            </h3>
          </div>

          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
            {t("reality.retrospectiveCalibration")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <DeltaCard
            label={t("common.happiness")}
            pastValue={baseSnapshot.happinessLevel}
            currentValue={revealHappiness}
            delta={emotionalDeltas.happiness}
            pastLabel={t("reality.past")}
            todayLabel={t("reality.today")}
          />
          <DeltaCard
            label={t("common.anxiety")}
            pastValue={baseSnapshot.anxietyLevel}
            currentValue={revealAnxiety}
            delta={emotionalDeltas.anxiety}
            invertColors
            pastLabel={t("reality.past")}
            todayLabel={t("reality.today")}
          />
          <DeltaCard
            label={t("common.motivation")}
            pastValue={baseSnapshot.motivationLevel}
            currentValue={revealMotivation}
            delta={emotionalDeltas.motivation}
            pastLabel={t("reality.past")}
            todayLabel={t("reality.today")}
          />
        </div>

        {!isFormLocked && (
          <div className="pt-4 border-t border-crease/60 space-y-5">
            <span className="font-letter text-xs font-semibold text-foreground-muted block uppercase tracking-wider">
              {t("reality.calibrateFeelings")}
            </span>

            <Slider
              label={t("reality.happinessUnsealing")}
              value={revealHappiness}
              onChange={(v) => setRevealRating("happiness", v)}
              min={1}
              max={10}
              lowLabel={t("reality.happinessLow")}
              highLabel={t("reality.happinessHigh")}
              accentColor="wax"
            />

            <Slider
              label={t("reality.anxietyCurrent")}
              value={revealAnxiety}
              onChange={(v) => setRevealRating("anxiety", v)}
              min={1}
              max={10}
              lowLabel={t("reality.anxietyLow")}
              highLabel={t("reality.anxietyHigh")}
              accentColor="ink"
            />

            <Slider
              label={t("reality.motivationFuture")}
              value={revealMotivation}
              onChange={(v) => setRevealRating("motivation", v)}
              min={1}
              max={10}
              lowLabel={t("reality.motivationLow")}
              highLabel={t("reality.motivationHigh")}
              accentColor="wax"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-crease pb-2 font-letter text-xs text-ink">
          <div className="flex items-center gap-2">
            <History size={16} className="text-ink" />
            <h3 className="font-bold uppercase tracking-wider">
              {t("reality.predictionsTitle")} ({capsule.predictions.length})
            </h3>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-foreground-muted">
            <span className="text-fulfilled font-bold">
              {fulfillmentStats.fulfilled} {t("reality.fulfilledCount")}
            </span>
            <span>•</span>
            <span className="text-wax font-bold">
              {fulfillmentStats.diverged} {t("reality.divergedCount")}
            </span>
          </div>
        </div>

        {capsule.predictions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-crease rounded bg-parchment font-letter text-xs text-foreground-muted">
            {t("reality.noPredictions")}
          </div>
        ) : (
          capsule.predictions.map((p) => {
            const current = predictionsMap[p.id] || {
              reality: "",
              outcome: "pending",
              matched: null,
            };

            return (
              <PredictionComparisonRow
                key={p.id}
                prediction={p}
                realityText={current.reality}
                outcome={current.outcome}
                onRealityTextChange={(txt) => setPredictionReality(p.id, txt)}
                onOutcomeChange={(out) => setPredictionOutcome(p.id, out)}
                readOnly={isFormLocked}
              />
            );
          })
        )}
      </div>

      <div className="p-6 rounded border border-crease bg-manila/50 flex flex-wrap items-center justify-between gap-4 font-letter">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-ink block">
            {t("reality.closingTitle")}
          </span>
          <p className="text-[11px] text-foreground-muted max-w-md">
            {t("reality.closingDesc")}
          </p>
        </div>

        {error && (
          <div className="w-full flex items-center gap-2 text-xs text-wax bg-wax/10 p-2.5 rounded border border-wax/30">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isSaved ? (
            <div className="flex items-center gap-3">
              <span className="font-letter text-xs text-ink font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-fulfilled" />
                <span>{t("reality.recordedInArchive")}</span>
              </span>

              <PostmarkStamp
                docketId={capsule.docketNumber}
                date={t("reality.audited")}
                variant="boxed"
                size="sm"
                inkColor="ink"
              />
            </div>
          ) : (
            <button
              type="button"
              disabled={isSaving || readOnly}
              onClick={handleSave}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded border border-wax bg-wax text-on-wax min-h-[44px]",
                "font-letter text-xs font-bold uppercase tracking-wider shadow-sm transition-all",
                "hover:bg-wax-hover hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
                isSaving && "opacity-60 cursor-not-allowed",
              )}
            >
              <Save size={14} />
              <span>
                {isSaving
                  ? t("reality.settlingLedger")
                  : t("reality.settleButton")}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DeltaCard({
  label,
  pastValue,
  currentValue,
  delta,
  invertColors = false,
  pastLabel,
  todayLabel,
}: {
  label: string;
  pastValue: number;
  currentValue: number;
  delta: number;
  invertColors?: boolean;
  pastLabel: string;
  todayLabel: string;
}) {
  const isPositive = delta > 0;
  const isZero = delta === 0;
  const isGood = invertColors ? delta < 0 : delta > 0;

  return (
    <div className="p-3.5 rounded border border-crease bg-manila/30 flex items-center justify-between font-letter">
      <div>
        <span className="text-xs font-semibold text-ink block">{label}</span>
        <span className="text-[10px] text-foreground-muted font-mono">
          {pastLabel}: {pastValue} → {todayLabel}: {currentValue}
        </span>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded font-mono text-xs font-bold border",
          isZero && "border-crease bg-crease/20 text-foreground-muted",
          !isZero &&
            isGood &&
            "border-fulfilled-border bg-fulfilled-bg text-fulfilled",
          !isZero && !isGood && "border-wax/50 bg-wax/10 text-wax",
        )}
      >
        {isZero ? (
          <Minus size={12} />
        ) : isPositive ? (
          <TrendingUp size={12} />
        ) : (
          <TrendingDown size={12} />
        )}
        <span>{delta > 0 ? `+${delta}` : delta}</span>
      </div>
    </div>
  );
}
