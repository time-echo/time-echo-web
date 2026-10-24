"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EmotionalMetricSet } from "@/types/timeecho";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  HeartHandshake,
  Smile,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { cn } from "@/lib/utils";

export interface EmotionalShiftGaugeProps {
  baseline: EmotionalMetricSet;
  reveal: EmotionalMetricSet;
  delta: EmotionalMetricSet;
  className?: string;
}

interface MetricDisplayConfig {
  key: keyof EmotionalMetricSet;
  icon: React.ElementType;
  invertColor?: boolean;
}

const METRICS_CONFIG: MetricDisplayConfig[] = [
  {
    key: "happiness",
    icon: Smile,
  },
  {
    key: "anxiety",
    icon: AlertCircle,
    invertColor: true,
  },
  {
    key: "motivation",
    icon: Zap,
  },
];

export function EmotionalShiftGauge({
  baseline,
  reveal,
  delta,
  className,
}: EmotionalShiftGaugeProps) {
  const { t } = useTimeEcho();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "p-6 sm:p-7 rounded border border-crease bg-parchment shadow-xs space-y-6 select-none",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-crease pb-3 font-letter text-xs text-foreground-muted">
        <div className="flex items-center gap-1.5 uppercase font-semibold text-ink">
          <HeartHandshake size={14} className="text-wax" />
          <span>{t("analytics.shift.title")}</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest">
          {t("analytics.shift.subtitle")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {METRICS_CONFIG.map((metric) => {
          const baseVal = baseline[metric.key];
          const revealVal = reveal[metric.key];
          const diff = delta[metric.key];

          const isPositive = diff > 0;
          const isZero = diff === 0;
          const isFavorable = metric.invertColor ? diff < 0 : diff > 0;

          const Icon = metric.icon;

          const basePercent = Math.min(100, Math.max(0, (baseVal / 10) * 100));
          const revealPercent = Math.min(
            100,
            Math.max(0, (revealVal / 10) * 100),
          );

          return (
            <div
              key={metric.key}
              className="p-4 rounded border border-crease bg-manila/30 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded bg-parchment border border-crease text-ink shadow-2xs">
                    <Icon size={14} />
                  </span>
                  <div>
                    <h4 className="font-letter font-bold text-xs uppercase tracking-wider text-ink">
                      {t(`analytics.shift.${metric.key}`)}
                    </h4>
                    <span className="text-[11px] text-foreground-muted leading-none">
                      {t(`analytics.shift.${metric.key}Sub`)}
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-bold border",
                    isZero &&
                      "border-crease bg-crease/20 text-foreground-muted",
                    !isZero &&
                      isFavorable &&
                      "border-fulfilled-border bg-fulfilled-bg text-fulfilled",
                    !isZero &&
                      !isFavorable &&
                      "border-wax/50 bg-wax/10 text-wax",
                  )}
                >
                  {isZero ? (
                    <Minus size={11} />
                  ) : isPositive ? (
                    <TrendingUp size={11} />
                  ) : (
                    <TrendingDown size={11} />
                  )}
                  <span>{diff > 0 ? `+${diff}` : diff}</span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono text-foreground-muted">
                    <span className="uppercase tracking-wider">
                      {t("analytics.shift.pastSealed")}
                    </span>
                    <span className="font-bold">{baseVal} / 10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-crease/50 overflow-hidden border border-crease/60">
                    <motion.div
                      initial={{
                        width: shouldReduceMotion ? `${basePercent}%` : 0,
                      }}
                      animate={{ width: `${basePercent}%` }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.8,
                        ease: "easeOut",
                      }}
                      className="h-full bg-ink/60"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono text-foreground-muted">
                    <span className="uppercase tracking-wider">
                      {t("analytics.shift.presentUnsealed")}
                    </span>
                    <span className="font-bold text-wax">{revealVal} / 10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-crease/50 overflow-hidden border border-crease/60">
                    <motion.div
                      initial={{
                        width: shouldReduceMotion ? `${revealPercent}%` : 0,
                      }}
                      animate={{ width: `${revealPercent}%` }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.8,
                        delay: shouldReduceMotion ? 0 : 0.2,
                        ease: "easeOut",
                      }}
                      className="h-full bg-wax"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-crease/50 text-[11px] font-mono text-foreground-muted text-right">
                {t("analytics.shift.scale")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
