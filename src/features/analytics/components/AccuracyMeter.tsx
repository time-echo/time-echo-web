"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { cn } from "@/lib/utils";

export interface AccuracyMeterProps {
  rate: number;
  evaluatedCount: number;
  matchedCount: number;
  pendingCount?: number;
  size?: number;
  className?: string;
}

export function AccuracyMeter({
  rate,
  evaluatedCount,
  matchedCount,
  pendingCount = 0,
  size = 180,
  className,
}: AccuracyMeterProps) {
  const { t } = useTimeEcho();
  const shouldReduceMotion = useReducedMotion();

  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  const rateColorClass =
    rate >= 70 ? "text-fulfilled" : rate >= 40 ? "text-ink" : "text-wax";

  return (
    <div
      className={cn(
        "p-6 sm:p-7 rounded border border-crease bg-parchment shadow-xs flex flex-col items-center justify-between text-center select-none",
        className,
      )}
      role="progressbar"
      aria-valuenow={rate}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t("analytics.accuracyRateAria")}
    >
      <div className="w-full flex items-center justify-between border-b border-crease pb-3 font-letter text-xs text-foreground-muted mb-4">
        <div className="flex items-center gap-1.5 uppercase font-semibold text-ink">
          <Target size={14} className="text-wax" />
          <span>{t("analytics.accuracyRate")}</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest">
          {t("analytics.predictiveLedger")}
        </span>
      </div>

      <div
        className="relative my-2 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-crease/50"
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{
              strokeDashoffset: shouldReduceMotion
                ? strokeDashoffset
                : circumference,
            }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            strokeLinecap="round"
            fill="transparent"
            className={rateColorClass}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.8,
            }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.2,
              duration: shouldReduceMotion ? 0 : 0.4,
            }}
            className="font-mono text-3xl sm:text-4xl font-extrabold text-ink leading-none"
          >
            {rate}%
          </motion.span>
          <span className="font-letter text-[9px] uppercase tracking-widest text-foreground-muted mt-1">
            {t("analytics.fulfillment")}
          </span>
        </div>
      </div>

      <div className="w-full mt-4 pt-4 border-t border-crease/60 grid grid-cols-3 gap-2 font-letter text-xs text-foreground-muted">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-fulfilled font-mono font-bold text-sm">
            <CheckCircle2 size={12} />
            <span>{matchedCount}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tight mt-0.5">
            {t("analytics.fulfilled")}
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-r border-crease/60 px-1">
          <div className="flex items-center gap-1 text-ink font-mono font-bold text-sm">
            <AlertTriangle size={12} />
            <span>{Math.max(0, evaluatedCount - matchedCount)}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tight mt-0.5">
            {t("analytics.diverged")}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-foreground-muted font-mono font-bold text-sm">
            <Clock size={12} />
            <span>{pendingCount}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tight mt-0.5">
            {t("analytics.inTransit")}
          </span>
        </div>
      </div>
    </div>
  );
}
