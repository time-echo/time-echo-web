"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  lowLabel?: string;
  highLabel?: string;
  accentColor?: "wax" | "ink";
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  label,
  lowLabel,
  highLabel,
  accentColor = "wax",
  disabled = false,
  className,
}: SliderProps) {
  const id = useId();

  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100),
  );

  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const isWax = accentColor === "wax";

  return (
    <div className={cn("w-full select-none font-letter", className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={id}
            className="text-xs uppercase tracking-wider font-semibold text-foreground flex items-center gap-1.5"
          >
            <span
              className={cn(
                "inline-block w-1.5 h-1.5 rounded-full",
                isWax ? "bg-wax" : "bg-ink",
              )}
            />
            <span>{label}</span>
          </label>

          <span
            className={cn(
              "px-2 py-0.5 rounded font-mono text-xs font-bold border tracking-wider",
              isWax
                ? "bg-wax/10 text-wax border-wax/30"
                : "bg-ink/10 text-ink border-ink/30",
            )}
          >
            [ {value} / {max} ]
          </span>
        </div>
      )}

      <div className="relative py-3 flex items-center">
        <div className="absolute inset-x-0 h-2 rounded-full bg-crease/60 border border-crease shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
          <div
            className={cn(
              "h-full transition-[width] duration-150",
              isWax ? "bg-wax" : "bg-ink",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label={label || "Rating level"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className={cn(
            "relative w-full h-8 appearance-none bg-transparent cursor-pointer z-10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-wax/60 focus-visible:ring-offset-2",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-6",
            "[&::-webkit-slider-thumb]:h-6",
            "[&::-webkit-slider-thumb]:rounded-full",
            isWax
              ? "[&::-webkit-slider-thumb]:bg-wax [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-parchment"
              : "[&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-parchment",
            "[&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]",
            "[&::-webkit-slider-thumb]:transition-transform",
            "[&::-webkit-slider-thumb]:hover:scale-110",
            "[&::-webkit-slider-thumb]:active:scale-95",
            "[&::-moz-range-thumb]:w-6",
            "[&::-moz-range-thumb]:h-6",
            "[&::-moz-range-thumb]:rounded-full",
            isWax
              ? "[&::-moz-range-thumb]:bg-wax [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-parchment"
              : "[&::-moz-range-thumb]:bg-ink [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-parchment",
            "[&::-moz-range-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.35)]",
            "[&::-moz-range-thumb]:transition-transform",
            "[&::-moz-range-thumb]:hover:scale-110",
            "[&::-moz-range-thumb]:active:scale-95",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        />
      </div>

      <div className="flex justify-between px-1 text-[11px] font-mono text-foreground-muted select-none -mt-1">
        {ticks.map((tick) => {
          const isSelected = tick === value;
          return (
            <button
              key={tick}
              type="button"
              tabIndex={-1}
              onClick={() => !disabled && onChange(tick)}
              className={cn(
                "min-h-[44px] min-w-[28px] sm:min-w-[36px] flex flex-col items-center justify-center cursor-pointer transition-colors touch-manipulation",
                isSelected
                  ? "font-bold text-ink"
                  : "text-foreground-muted hover:text-foreground opacity-80 hover:opacity-100",
                disabled && "cursor-default",
              )}
            >
              <span className="h-1.5 w-[1px] bg-crease mb-1" />
              <span>{tick}</span>
            </button>
          );
        })}
      </div>

      {(lowLabel || highLabel) && (
        <div className="flex justify-between items-center text-[11px] text-foreground-muted uppercase tracking-widest mt-1 select-none">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}
