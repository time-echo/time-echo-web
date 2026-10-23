"use client";

import React from "react";
import { Prediction, PredictionOutcome } from "@/types/timeecho";
import { Check, X, Shuffle, Quote, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface PredictionComparisonRowProps {
  prediction: Prediction;
  outcome: PredictionOutcome;
  realityText: string;
  onOutcomeChange?: (outcome: PredictionOutcome) => void;
  onRealityTextChange?: (text: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function PredictionComparisonRow({
  prediction,
  outcome,
  realityText,
  onOutcomeChange,
  onRealityTextChange,
  readOnly = false,
  className,
}: PredictionComparisonRowProps) {
  const { t } = useTimeEcho();

  const outcomeOptions: Array<{
    value: PredictionOutcome;
    label: string;
    subtext: string;
    icon: React.ElementType;
    activeClass: string;
  }> = [
    {
      value: "fulfilled",
      label: t("reality.row.fulfilledLabel"),
      subtext: t("reality.row.fulfilledSubtext"),
      icon: Check,
      activeClass: "border-fulfilled-border bg-fulfilled-bg text-fulfilled",
    },
    {
      value: "diverged",
      label: t("reality.row.divergedLabel"),
      subtext: t("reality.row.divergedSubtext"),
      icon: Shuffle,
      activeClass: "border-wax bg-wax/10 text-wax",
    },
    {
      value: "unfulfilled",
      label: t("reality.row.unfulfilledLabel"),
      subtext: t("reality.row.unfulfilledSubtext"),
      icon: X,
      activeClass: "border-ink bg-ink/10 text-ink",
    },
  ];

  return (
    <div
      className={cn(
        "p-5 sm:p-6 rounded border border-crease bg-parchment shadow-sm space-y-4",
        "transition-colors duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-crease/60 pb-2.5 font-letter text-[11px] text-foreground-muted select-none">
        <div className="flex items-center gap-1.5 uppercase tracking-wider font-semibold text-ink">
          <Compass size={13} className="text-wax" />
          <span>
            {t("reality.row.category")}: {prediction.category}
          </span>
        </div>

        <span className="font-mono text-[10px] tracking-widest uppercase">
          ID: {prediction.id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-4 rounded border border-crease bg-manila/40 flex flex-col justify-between space-y-3">
          <div>
            <span className="font-letter text-[10px] uppercase tracking-widest text-foreground-muted block mb-1">
              {t("reality.row.predictedPast")}
            </span>
            <div className="flex items-start gap-2">
              <Quote size={16} className="text-wax/60 shrink-0 mt-1" />
              <p className="font-serif-editorial text-sm sm:text-base text-ink italic leading-relaxed">
                &ldquo;{prediction.prediction}&rdquo;
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-crease/50 text-[10px] font-letter text-foreground-muted/70">
            {t("reality.row.sealedOriginalDate")}
          </div>
        </div>

        <div className="p-4 rounded border border-crease bg-parchment flex flex-col justify-between space-y-3">
          <div>
            <label
              htmlFor={`reality-${prediction.id}`}
              className="font-letter text-[10px] uppercase tracking-widest text-foreground-muted block mb-1"
            >
              {t("reality.row.actualTranspired")}
            </label>

            {readOnly ? (
              <p className="font-letter text-xs sm:text-sm text-foreground leading-relaxed">
                {realityText || (
                  <span className="italic text-foreground-muted">
                    {t("reality.row.noTestimony")}
                  </span>
                )}
              </p>
            ) : (
              <textarea
                id={`reality-${prediction.id}`}
                rows={3}
                value={realityText}
                onChange={(e) => onRealityTextChange?.(e.target.value)}
                placeholder={t("reality.row.testimonyPlaceholder")}
                className="w-full p-2.5 rounded border border-crease bg-manila/20 font-letter text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/40 focus:outline-none focus:border-ink resize-none leading-relaxed"
              />
            )}
          </div>

          <div className="pt-2 border-t border-crease/50 text-[10px] font-letter text-foreground-muted/70 flex items-center justify-between">
            <span>{t("reality.row.ledgerTitle")}</span>
            <span>{t("reality.row.verifiedToday")}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-crease/60 space-y-2">
        <span className="font-letter text-[10px] uppercase tracking-wider text-foreground-muted block">
          {t("reality.row.outcomeRuling")}
        </span>

        <div
          role="radiogroup"
          aria-label={t("reality.row.outcomeRulingAria")}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          {outcomeOptions.map((opt) => {
            const isSelected = outcome === opt.value;
            const Icon = opt.icon;

            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={readOnly}
                onClick={() => !readOnly && onOutcomeChange?.(opt.value)}
                className={cn(
                  "p-3 rounded border text-left transition-all flex items-center gap-2.5 min-h-[48px]",
                  isSelected
                    ? opt.activeClass
                    : "border-crease bg-parchment hover:bg-manila/50 text-foreground-muted opacity-75",
                  readOnly ? "cursor-default" : "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs",
                    isSelected ? "border-current" : "border-crease bg-manila",
                  )}
                >
                  <Icon size={12} />
                </span>

                <div className="min-w-0">
                  <div className="font-letter font-bold text-xs uppercase tracking-wider truncate">
                    {opt.label}
                  </div>
                  <div className="text-[10px] opacity-75 truncate">
                    {opt.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
