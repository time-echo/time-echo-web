"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LinedPaperCanvasProps {
  /**
   * Letter body content text.
   */
  value: string;
  /**
   * Callback fired on text input changes.
   */
  onChange: (value: string) => void;
  /**
   * Placeholder prompt.
   * @default 'Querido yo del futuro:\nHoy tomo la pluma para recordarte...'
   */
  placeholder?: string;
  /**
   * Read-only mode for viewing sealed/unsealed letters.
   */
  readOnly?: boolean;
  /**
   * Minimum height in rows.
   * @default 14
   */
  minRows?: number;
  /**
   * Whether to display word and character counters at the bottom.
   * @default true
   */
  showWordCount?: boolean;
  /**
   * Additional container classes.
   */
  className?: string;
}

/**
 * 📝 LinedPaperCanvas Component
 *
 * Ruled stationery notebook canvas with Courier Prime typography,
 * red epistolary left margin rule, and line-height matching physical rulings.
 */
export function LinedPaperCanvas({
  value,
  onChange,
  placeholder = "Querido yo:\nHoy tomo la pluma para recordarte lo que sentías al comenzar este camino...\nNo olvides tus promesas silenciosas.",
  readOnly = false,
  minRows = 14,
  showWordCount = true,
  className,
}: LinedPaperCanvasProps) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;

  return (
    <div
      className={cn(
        "relative w-full rounded border border-crease bg-parchment overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]",
        className,
      )}
    >
      {/* Left Red/Crease Epistolary Margin Line */}
      <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-[1px] bg-wax/25 pointer-events-none z-10" />

      {/* Writing Surface with Ruled Lines */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        rows={minRows}
        placeholder={placeholder}
        aria-label="Contenido de la carta al futuro"
        className={cn(
          "w-full py-4 pl-14 sm:pl-20 pr-6 bg-transparent resize-y",
          "font-letter text-base sm:text-lg text-foreground focus:outline-none",
          "lined-paper-canvas leading-[2.25rem] tracking-normal",
          readOnly && "cursor-default select-text",
          "placeholder:text-foreground-muted/40 placeholder:font-light",
        )}
      />

      {/* Postal Docket Writing Counter Bar */}
      {showWordCount && (
        <div className="px-4 py-2 border-t border-crease/60 bg-crease/20 flex items-center justify-between font-letter text-[11px] text-foreground-muted select-none">
          <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-ink/60" />
            <span>TINTA Y CUADERNO POSTAL</span>
          </span>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>{words} palabras</span>
            <span className="opacity-40">•</span>
            <span>{chars} caracteres</span>
          </div>
        </div>
      )}
    </div>
  );
}
