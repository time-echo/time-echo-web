"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export interface CountdownBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Target delivery timestamp (ISO string or Date).
   */
  targetDate: string | Date;
  /**
   * Visual style variant.
   * @default 'pill'
   */
  variant?: "pill" | "segmented" | "docket";
  /**
   * Size variant.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional callback triggered when the countdown reaches 0.
   */
  onComplete?: () => void;
  /**
   * Custom label when target date is already in the past.
   * @default 'LISTA PARA ABRIR'
   */
  completedLabel?: string;
}

interface TimeRemaining {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

function calculateTimeRemaining(target: Date): TimeRemaining {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isCompleted: false,
  };
}

/**
 * CountdownBadge Component
 *
 * Real-time ticking ticker badge for in-transit letters with days/hours/minutes/seconds,
 * physical archival border styling, and accessible completion states.
 */
export const CountdownBadge = React.forwardRef<
  HTMLDivElement,
  CountdownBadgeProps
>(
  (
    {
      targetDate,
      variant = "pill",
      size = "md",
      onComplete,
      completedLabel = "LISTA PARA ABRIR",
      className,
      ...props
    },
    ref,
  ) => {
    const target = useMemo(() => new Date(targetDate), [targetDate]);
    const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
      calculateTimeRemaining(target),
    );
    const isMounted = useIsMounted();

    const handleComplete = useCallback(() => {
      onComplete?.();
    }, [onComplete]);

    useEffect(() => {
      const interval = setInterval(() => {
        const next = calculateTimeRemaining(target);
        setTimeLeft(next);

        if (next.isCompleted) {
          clearInterval(interval);
          handleComplete();
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [target, handleComplete]);

    // Format numbers with leading zeros
    const formatNumber = (num: number): string => String(num).padStart(2, "0");

    // Safe SSR fallback display
    const days = isMounted ? timeLeft.days : 0;
    const hours = isMounted ? formatNumber(timeLeft.hours) : "00";
    const minutes = isMounted ? formatNumber(timeLeft.minutes) : "00";
    const seconds = isMounted ? formatNumber(timeLeft.seconds) : "00";
    const isCompleted = isMounted ? timeLeft.isCompleted : false;

    // Completed State
    if (isCompleted) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded border border-wax bg-wax/10 text-wax font-letter text-xs uppercase tracking-wider select-none font-bold",
            size === "sm" && "px-2 py-0.5 text-[10px]",
            size === "lg" && "px-4 py-1.5 text-sm",
            className,
          )}
          {...props}
        >
          <CheckCircle2 size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
          <span>{completedLabel}</span>
        </div>
      );
    }

    // Segmented Ticker Variant
    if (variant === "segmented") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1 select-none font-letter",
            className,
          )}
          {...props}
        >
          <Segment value={days} label="DÍAS" size={size} />
          <span className="text-foreground-muted font-bold -mt-2">:</span>
          <Segment value={hours} label="HRS" size={size} />
          <span className="text-foreground-muted font-bold -mt-2">:</span>
          <Segment value={minutes} label="MIN" size={size} />
          <span className="text-foreground-muted font-bold -mt-2">:</span>
          <Segment value={seconds} label="SEG" size={size} />
        </div>
      );
    }

    // Docket Boxed Variant
    if (variant === "docket") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex flex-col p-2.5 rounded border border-crease bg-manila/80 font-letter select-none",
            className,
          )}
          {...props}
        >
          <div className="flex items-center justify-between gap-3 text-[10px] text-foreground-muted uppercase tracking-widest border-b border-crease pb-1">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-ink" />
              <span>TIEMPO EN TRÁNSITO</span>
            </span>
            <span className="font-bold text-ink">BÓVEDA ACTIVA</span>
          </div>

          <div className="mt-1.5 flex items-center justify-center gap-2 font-mono font-bold text-sm tracking-widest text-ink">
            <span>{days}d</span>
            <span className="opacity-40">•</span>
            <span>{hours}h</span>
            <span className="opacity-40">•</span>
            <span>{minutes}m</span>
            <span className="opacity-40">•</span>
            <span className="text-wax">{seconds}s</span>
          </div>
        </div>
      );
    }

    // Default Pill Variant
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink/40 bg-ink/5 text-ink font-letter select-none",
          size === "sm" && "px-2.5 py-0.5 text-[10px]",
          size === "md" && "px-3 py-1 text-xs",
          size === "lg" && "px-4 py-1.5 text-sm",
          className,
        )}
        {...props}
      >
        <Clock
          size={size === "sm" ? 12 : size === "lg" ? 16 : 13}
          className="text-ink animate-pulse"
        />
        <span className="font-mono font-semibold tracking-wider">
          {days > 0 ? `${days}d ` : ""}
          {hours}:{minutes}:{seconds}
        </span>
      </div>
    );
  },
);

CountdownBadge.displayName = "CountdownBadge";

function Segment({
  value,
  label,
  size,
}: {
  value: string | number;
  label: string;
  size: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded border border-crease bg-parchment p-1 shadow-sm",
        size === "sm" && "min-w-[34px] px-1 py-0.5",
        size === "md" && "min-w-[44px] px-2 py-1",
        size === "lg" && "min-w-[56px] px-3 py-1.5",
      )}
    >
      <span
        className={cn(
          "font-mono font-bold leading-none text-ink",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-[8px] font-letter tracking-widest text-foreground-muted uppercase leading-none mt-1",
          size === "lg" && "text-[9px]",
        )}
      >
        {label}
      </span>
    </div>
  );
}
