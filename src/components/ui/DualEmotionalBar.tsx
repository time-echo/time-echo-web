"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type EmotionType = "happiness" | "anxiety" | "motivation" | "custom";

export interface DualEmotionalBarProps {
  /**
   * Name of the emotion (e.g., "Felicidad", "Ansiedad", "Motivación").
   */
  label: string;
  /**
   * Baseline value at the time the letter was written (1 to 10).
   */
  pastValue: number;
  /**
   * Revealing value at the time the letter was opened (1 to 10), or null if pending unsealing.
   */
  currentValue?: number | null;
  /**
   * Category of the emotion to determine semantic tags and colors.
   * @default 'custom'
   */
  type?: EmotionType;
  /**
   * If true, lower values are considered favorable (e.g., Anxiety).
   * Automatically true when type === 'anxiety'.
   */
  invertColor?: boolean;
  /**
   * Optional localized labels for status badges.
   */
  statusLabels?: {
    growth?: string;
    decline?: string;
    steady?: string;
    calm?: string;
    stress?: string;
    inspired?: string;
    pastLabel?: string;
    todayLabel?: string;
    pendingLabel?: string;
  };
  className?: string;
}

export function DualEmotionalBar({
  label,
  pastValue,
  currentValue,
  type = "custom",
  invertColor,
  statusLabels,
  className,
}: DualEmotionalBarProps) {
  const isAnxiety = type === "anxiety" || invertColor === true;
  const hasRevealed = currentValue !== null && currentValue !== undefined;

  const past = Math.min(10, Math.max(1, pastValue));
  const current = hasRevealed ? Math.min(10, Math.max(1, currentValue!)) : null;
  const shift = current !== null ? current - past : null;

  // Compute shift label & color
  let shiftTagText = "";
  let isFavorable = false;
  let isSteady = false;

  if (shift !== null) {
    if (shift === 0) {
      isSteady = true;
      shiftTagText = statusLabels?.steady || "Constante";
    } else if (isAnxiety) {
      if (shift < 0) {
        isFavorable = true;
        shiftTagText = `${shift} ${statusLabels?.calm || "Mayor calma"}`;
      } else {
        isFavorable = false;
        shiftTagText = `+${shift} ${statusLabels?.stress || "Mayor estrés"}`;
      }
    } else {
      if (shift > 0) {
        isFavorable = true;
        const text =
          type === "motivation"
            ? statusLabels?.inspired || "Inspiración"
            : statusLabels?.growth || "Crecimiento";
        shiftTagText = `+${shift} ${text}`;
      } else {
        isFavorable = false;
        shiftTagText = `${shift} ${statusLabels?.decline || "Descenso"}`;
      }
    }
  }

  const pastPercent = (past / 10) * 100;
  const currentPercent = current !== null ? (current / 10) * 100 : 0;

  return (
    <div
      className={cn(
        "paper-sheet p-3.5 rounded-xs border border-crease space-y-2 select-none font-letter text-xs text-foreground bg-parchment shadow-2xs",
        className
      )}
    >
      {/* Top Header: Emotion Label & Delta Tag */}
      <div className="flex justify-between items-center gap-2">
        <span className="font-semibold text-foreground tracking-wide">
          {label}
        </span>

        {hasRevealed && shift !== null ? (
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider py-0.5 px-2 rounded-xs inline-flex items-center gap-1",
              isSteady && "text-foreground-muted bg-manila/60 border border-crease/60",
              !isSteady && isFavorable && "text-ink bg-ink/10 border border-ink/20",
              !isSteady && !isFavorable && "text-wax bg-wax/10 border border-wax/20"
            )}
          >
            {shiftTagText}
          </span>
        ) : (
          <span className="text-[10px] text-foreground-muted uppercase tracking-wider italic">
            {statusLabels?.pendingLabel || "En custodia"}
          </span>
        )}
      </div>

      {/* Dual Visual Bar Track */}
      <div className="space-y-1">
        <div className="relative h-3 w-full rounded-xs bg-manila/50 border border-crease overflow-hidden">
          {/* Baseline Bar (Past) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-foreground/20 border-r border-foreground/40 transition-all duration-300"
            style={{ width: `${pastPercent}%` }}
            title={`Pasado: ${past}/10`}
          />

          {/* Reveal Bar (Current) if revealed */}
          {hasRevealed && current !== null && (
            <div
              className={cn(
                "absolute top-0 bottom-0 left-0 opacity-60 transition-all duration-500",
                isSteady && "bg-foreground-muted/40",
                isFavorable && "bg-ink",
                !isFavorable && "bg-wax"
              )}
              style={{ width: `${currentPercent}%` }}
              title={`Hoy: ${current}/10`}
            />
          )}

          {/* Tick divisions 1 to 10 */}
          <div className="absolute inset-0 flex justify-between px-[10%] pointer-events-none opacity-20">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
              <span key={t} className="w-[1px] h-full bg-foreground" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Details: Past -> Today values */}
      <div className="flex justify-between items-center text-[11px] text-foreground-muted pt-0.5">
        <span>
          {statusLabels?.pastLabel || "Pasado"}:{" "}
          <strong className="text-foreground">{past}</strong>/10
        </span>

        <span className="text-foreground-muted/50">&rarr;</span>

        <span>
          {statusLabels?.todayLabel || "Hoy"}:{" "}
          {hasRevealed && current !== null ? (
            <strong
              className={cn(
                "text-foreground",
                isFavorable && "text-ink",
                !isFavorable && !isSteady && "text-wax"
              )}
            >
              {current}
            </strong>
          ) : (
            <span className="italic">?</span>
          )}
          /10
        </span>
      </div>
    </div>
  );
}
