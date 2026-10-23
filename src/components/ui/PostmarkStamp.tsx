"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface PostmarkStampProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * City or postal post of origin.
   * @default 'POSTAL VAULT'
   */
  city?: string;
  /**
   * Postal docket identifier.
   * e.g., "TE-00421"
   */
  docketId?: string;
  /**
   * Date of cancellation or dispatch.
   * e.g., "27 MAR 2026"
   */
  date?: string;
  /**
   * Postal cancellation subtext or status.
   * e.g., "VERIFICADO", "EN TRÁNSITO", "EXPEDIDO"
   */
  subtext?: string;
  /**
   * Visual variation of the cancellation stamp.
   * @default 'circular'
   */
  variant?: "circular" | "boxed" | "cancellation-waves";
  /**
   * Ink coloration.
   * @default 'ink'
   */
  inkColor?: "ink" | "wax" | "muted";
  /**
   * Rotation angle in degrees (-3 to 3).
   * If omitted, a deterministic tilt between -1.5° and +1.5° is computed from the docketId
   * to preserve SSR hydration consistency.
   */
  tiltAngle?: number;
  /**
   * Size variation.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

const INK_COLOR_CLASSES = {
  ink: "text-ink border-ink",
  wax: "text-wax border-wax",
  muted: "text-foreground-muted border-crease",
};

const SIZE_CONFIGS = {
  sm: {
    circular: "w-20 h-20 text-[9px]",
    boxed: "px-2.5 py-1.5 text-[10px]",
    subtext: "text-[8px]",
    docketText: "text-[9px]",
  },
  md: {
    circular: "w-28 h-28 text-[11px]",
    boxed: "px-4 py-2 text-xs",
    subtext: "text-[10px]",
    docketText: "text-xs",
  },
  lg: {
    circular: "w-36 h-36 text-xs",
    boxed: "px-6 py-3 text-sm",
    subtext: "text-xs",
    docketText: "text-sm",
  },
};

/**
 * Computes a deterministic tilt angle between -1.5° and +1.5° based on a string seed,
 * avoiding hydration mismatch between server and client.
 */
function getDeterministicTilt(seed?: string): number {
  if (!seed) return -1.2;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  // Map hash to range [-1.5, 1.5]
  const normalized = (Math.abs(hash) % 300) / 100 - 1.5;
  return Number(normalized.toFixed(1));
}

/**
 * PostmarkStamp Component
 *
 * Vintage postal cancellation mark featuring origin city, docket folio ID,
 * cancellation date, authentic postal waves, and slight physical tilt.
 */
export const PostmarkStamp = React.forwardRef<
  HTMLDivElement,
  PostmarkStampProps
>(
  (
    {
      city = "BOGOTÁ // CENTRAL",
      docketId = "TE-00421",
      date = "27 MAR 2026",
      subtext = "EXPEDICIÓN OFICIAL",
      variant = "circular",
      inkColor = "ink",
      tiltAngle,
      size = "md",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // Deterministic angle preventing hydration flickers
    const angle = useMemo(() => {
      if (tiltAngle !== undefined) return tiltAngle;
      return getDeterministicTilt(docketId + city);
    }, [tiltAngle, docketId, city]);

    const sizeConfig = SIZE_CONFIGS[size];
    const colorClasses = INK_COLOR_CLASSES[inkColor];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center select-none font-letter uppercase tracking-wider opacity-85 pointer-events-none transition-transform duration-200",
          className,
        )}
        style={{
          transform: `rotate(${angle}deg)`,
          ...style,
        }}
        {...props}
      >
        {variant === "circular" && (
          <div
            className={cn(
              "relative rounded-full border-2 border-dashed flex flex-col items-center justify-center p-2 text-center",
              sizeConfig.circular,
              colorClasses,
            )}
          >
            {/* Inner Concentric Fine Solid Ring */}
            <div className="absolute inset-1 rounded-full border border-current opacity-70 pointer-events-none" />

            {/* City at top */}
            <span className="font-bold tracking-widest text-[9px] sm:text-[10px] truncate max-w-[90%] leading-tight">
              {city}
            </span>

            {/* Center Docket & Date */}
            <div className="my-0.5 py-0.5 border-t border-b border-current/60 w-3/4 flex flex-col items-center">
              <span
                className={cn("font-bold leading-tight", sizeConfig.docketText)}
              >
                {docketId}
              </span>
              <span className="text-[9px] tracking-widest opacity-90 leading-tight">
                {date}
              </span>
            </div>

            {/* Subtext at bottom */}
            <span
              className={cn(
                sizeConfig.subtext,
                "tracking-tighter opacity-80 leading-none",
              )}
            >
              ★ {subtext} ★
            </span>
          </div>
        )}

        {variant === "boxed" && (
          <div
            className={cn(
              "rounded border-2 border-dashed flex flex-col items-center justify-center text-center",
              sizeConfig.boxed,
              colorClasses,
            )}
          >
            <div className="flex items-center gap-1.5 font-bold tracking-widest leading-none">
              <span>{city}</span>
              <span>•</span>
              <span>{docketId}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] tracking-widest opacity-85">
              <span>{date}</span>
              <span>{"//"}</span>
              <span>{subtext}</span>
            </div>
          </div>
        )}

        {variant === "cancellation-waves" && (
          <div className={cn("flex items-center gap-2", colorClasses)}>
            {/* Circular Postmark Head */}
            <div
              className={cn(
                "relative rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1.5 text-center shrink-0",
                sizeConfig.circular,
              )}
            >
              <div className="absolute inset-1 rounded-full border border-current opacity-60" />
              <span className="text-[9px] font-bold leading-tight truncate max-w-[85%]">
                {city}
              </span>
              <span className="text-[10px] font-bold leading-tight my-0.5 border-t border-b border-current/50 w-3/4">
                {date}
              </span>
              <span className="text-[8px] opacity-75">{docketId}</span>
            </div>

            {/* Inky Wavy Killer Cancellation Lines */}
            <div className="hidden sm:flex flex-col gap-1.5 opacity-80">
              <svg
                width="68"
                height="32"
                viewBox="0 0 68 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M0 4 C10 0, 20 8, 34 4 C48 0, 58 8, 68 4" />
                <path d="M0 12 C10 8, 20 16, 34 12 C48 8, 58 16, 68 12" />
                <path d="M0 20 C10 16, 20 24, 34 20 C48 16, 58 24, 68 20" />
                <path d="M0 28 C10 24, 20 32, 34 28 C48 24, 58 32, 68 28" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  },
);

PostmarkStamp.displayName = "PostmarkStamp";
