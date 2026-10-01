"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccuracyMeterProps {
  /**
   * Accuracy percentage (0 to 100).
   */
  rate: number;
  /**
   * Total number of evaluated predictions.
   */
  evaluatedCount: number;
  /**
   * Number of fulfilled predictions.
   */
  matchedCount: number;
  /**
   * Number of pending/unfulfilled predictions.
   */
  pendingCount?: number;
  /**
   * Diameter size of the circular meter.
   * @default 160
   */
  size?: number;
  className?: string;
}

/**
 * 🎯 AccuracyMeter Component
 *
 * Circular archival radial percentage gauge visualizing milestone prediction fulfillment,
 * animated with Framer Motion and styled with postal ink tones.
 */
export function AccuracyMeter({
  rate,
  evaluatedCount,
  matchedCount,
  pendingCount = 0,
  size = 180,
  className,
}: AccuracyMeterProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div
      className={cn(
        "p-6 sm:p-7 rounded border border-crease bg-parchment shadow-sm flex flex-col items-center justify-between text-center select-none",
        className,
      )}
    >
      {/* Header Docket Tag */}
      <div className="w-full flex items-center justify-between border-b border-crease pb-3 font-letter text-xs text-foreground-muted mb-4">
        <div className="flex items-center gap-1.5 uppercase font-semibold text-ink">
          <Target size={14} className="text-wax" />
          <span>TASA DE ACIERTO</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest">
          EXPEDIENTE PREDICTIVO
        </span>
      </div>

      {/* Circular SVG Gauge */}
      <div
        className="relative my-2 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-crease/50"
          />

          {/* Animated Foreground Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
            className={cn(
              rate >= 70
                ? "text-emerald-700 dark:text-emerald-500"
                : rate >= 40
                  ? "text-ink"
                  : "text-wax",
            )}
          />
        </svg>

        {/* Center Readout Numerals */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-mono text-3xl sm:text-4xl font-extrabold text-ink leading-none"
          >
            {rate}%
          </motion.span>
          <span className="font-letter text-[9px] uppercase tracking-widest text-foreground-muted mt-1">
            CUMPLIMIENTO
          </span>
        </div>
      </div>

      {/* Breakdown Metrics Footer */}
      <div className="w-full mt-4 pt-4 border-t border-crease/60 grid grid-cols-3 gap-2 font-letter text-xs text-foreground-muted">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-sm">
            <CheckCircle2 size={12} />
            <span>{matchedCount}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tight mt-0.5">
            Cumplidas
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-r border-crease/60 px-1">
          <div className="flex items-center gap-1 text-ink font-mono font-bold text-sm">
            <AlertTriangle size={12} />
            <span>{Math.max(0, evaluatedCount - matchedCount)}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tight mt-0.5">
            Divergentes
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-foreground-muted font-mono font-bold text-sm">
            <Clock size={12} />
            <span>{pendingCount}</span>
          </div>
          <span className="text-[9px] uppercase tracking-tight mt-0.5">
            En Tránsito
          </span>
        </div>
      </div>
    </div>
  );
}
