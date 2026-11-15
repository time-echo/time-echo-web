"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface PostmarkStampProps extends React.HTMLAttributes<HTMLDivElement> {
  city?: string;
  docketId?: string;
  date?: string;
  subtext?: string;
  variant?: "circular" | "boxed" | "cancellation-waves";
  inkColor?: "ink" | "wax" | "muted";
  tiltAngle?: number;
  size?: "sm" | "md" | "lg";
  ref?: React.Ref<HTMLDivElement>;
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

function getDeterministicTilt(seed?: string): number {
  if (!seed) return -1.2;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (Math.abs(hash) % 300) / 100 - 1.5;
  return Number(normalized.toFixed(1));
}

export function PostmarkStamp({
  city,
  docketId = "TE-00421",
  date = "27 MAR 2026",
  subtext,
  variant = "circular",
  inkColor = "ink",
  tiltAngle,
  size = "md",
  className,
  style,
  ref,
  ...props
}: PostmarkStampProps) {
  const { t } = useTimeEcho();
  const resolvedCity = city ?? t("common.postmark.defaultCity");
  const resolvedSubtext = subtext ?? t("common.postmark.defaultSubtext");

  const angle = useMemo(() => {
    if (tiltAngle !== undefined) return tiltAngle;
    return getDeterministicTilt(docketId + resolvedCity);
  }, [tiltAngle, docketId, resolvedCity]);

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
          <div className="absolute inset-1 rounded-full border border-current opacity-70 pointer-events-none" />

          <span className="font-bold tracking-widest text-[9px] sm:text-[10px] truncate max-w-[90%] leading-tight">
            {resolvedCity}
          </span>

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

          <span
            className={cn(
              sizeConfig.subtext,
              "tracking-tighter opacity-80 leading-none",
            )}
          >
            ★ {resolvedSubtext} ★
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
            <span>{resolvedCity}</span>
            <span>•</span>
            <span>{docketId}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] tracking-widest opacity-85">
            <span>{date}</span>
            <span>{"//"}</span>
            <span>{resolvedSubtext}</span>
          </div>
        </div>
      )}

      {variant === "cancellation-waves" && (
        <div className={cn("flex items-center gap-2", colorClasses)}>
          <div
            className={cn(
              "relative rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1.5 text-center shrink-0",
              sizeConfig.circular,
            )}
          >
            <div className="absolute inset-1 rounded-full border border-current opacity-60" />
            <span className="text-[9px] font-bold leading-tight truncate max-w-[85%]">
              {resolvedCity}
            </span>
            <span className="text-[10px] font-bold leading-tight my-0.5 border-t border-b border-current/50 w-3/4">
              {date}
            </span>
            <span className="text-[8px] opacity-75">{docketId}</span>
          </div>

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
}
