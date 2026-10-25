"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface LinedPaperCanvasProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minRows?: number;
  showWordCount?: boolean;
  showLines?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function LinedPaperCanvas({
  value,
  onChange,
  placeholder,
  readOnly = false,
  minRows = 14,
  showWordCount = true,
  showLines = false,
  className,
  ariaLabel,
}: LinedPaperCanvasProps) {
  const { t } = useTimeEcho();

  const defaultPlaceholder = t("composer.stationeryDefaultPlaceholder");
  const effectiveAriaLabel = ariaLabel || t("composer.stationeryAria");

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;

  return (
    <div
      className={cn(
        "relative w-full rounded border border-crease bg-parchment overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]",
        className,
      )}
    >
      {showLines && (
        <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-[1px] bg-wax/25 pointer-events-none z-10" />
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        rows={minRows}
        placeholder={placeholder || defaultPlaceholder}
        aria-label={effectiveAriaLabel}
        className={cn(
          "w-full py-4 px-6 bg-transparent resize-y",
          "font-letter text-base sm:text-lg text-foreground focus:outline-none",
          showLines && "pl-14 sm:pl-20 lined-paper-canvas leading-[2.25rem] tracking-normal",
          !showLines && "leading-loose",
          readOnly && "cursor-default select-text",
          "placeholder:text-foreground-muted/40 placeholder:font-light",
        )}
      />

      {showWordCount && (
        <div className="px-4 py-2 border-t border-crease/60 bg-crease/20 flex items-center justify-between font-letter text-[11px] text-foreground-muted select-none">
          <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-ink/60" />
            <span>{t("composer.stationeryFooterTitle")}</span>
          </span>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>
              {words} {t("composer.wordsCount")}
            </span>
            <span className="opacity-40">•</span>
            <span>
              {chars} {t("composer.charsCount")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
