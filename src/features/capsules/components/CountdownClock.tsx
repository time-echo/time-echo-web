"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Clock, ShieldCheck, Calendar, Lock } from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface CountdownClockProps {
  scheduledAt: string;
  createdAt: string;
  docketNumber?: string;
  onArrival?: () => void;
  className?: string;
}

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function CountdownClock({
  scheduledAt,
  createdAt,
  docketNumber = "TE-00000",
  onArrival,
  className,
}: CountdownClockProps) {
  const { locale, t } = useTimeEcho();

  const isMounted = useIsMounted();
  const targetDate = useMemo(() => new Date(scheduledAt), [scheduledAt]);
  const createdDate = useMemo(() => new Date(createdAt), [createdAt]);

  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (current >= targetDate.getTime()) {
        clearInterval(timer);
        onArrival?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onArrival]);

  const totalDuration = Math.max(
    1,
    targetDate.getTime() - createdDate.getTime(),
  );
  const elapsed = Math.max(0, now - createdDate.getTime());
  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsed / totalDuration) * 100),
  );

  const diff = Math.max(0, targetDate.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isCompleted = diff <= 0;

  const format2 = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={cn(
        "p-6 sm:p-8 rounded border border-crease bg-manila/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-crease pb-4 font-letter text-xs">
        <div className="flex items-center gap-2 text-ink">
          <Clock size={16} className="text-wax animate-pulse" />
          <span className="font-bold tracking-wider uppercase">
            {t("reveal.capsuleInTransit", { docket: docketNumber })}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-foreground-muted text-[11px]">
          <Calendar size={13} />
          <span>
            {formatLocaleDate(scheduledAt, locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-6 space-y-2">
          <div className="inline-flex p-3 rounded-full bg-wax/10 text-wax border border-wax/30 mb-2">
            <ShieldCheck size={32} />
          </div>
          <h4 className="font-serif-editorial text-2xl text-ink font-bold">
            {t("reveal.unlockableBadge")}
          </h4>
          <p className="font-letter text-xs text-foreground-muted max-w-md mx-auto">
            {t("reveal.unlockedNotice")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          <TimeBlock
            value={isMounted ? days : 0}
            label={t("common.days").toUpperCase()}
          />
          <TimeBlock
            value={isMounted ? format2(hours) : "00"}
            label={t("common.hours").toUpperCase()}
          />
          <TimeBlock
            value={isMounted ? format2(minutes) : "00"}
            label={t("common.minutes").toUpperCase()}
          />
          <TimeBlock
            value={isMounted ? format2(seconds) : "00"}
            label={t("common.seconds").toUpperCase()}
            highlight
          />
        </div>
      )}

      <div className="space-y-1.5 pt-2">
        <div className="flex justify-between items-center text-[10px] font-letter text-foreground-muted uppercase tracking-widest">
          <span>{t("reveal.voyageElapsed")}</span>
          <span className="font-mono font-bold text-ink">
            {isMounted ? `${progressPercent.toFixed(1)}%` : "0%"}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("reveal.voyageElapsed")}
          className="h-2 w-full rounded-full bg-crease/60 overflow-hidden border border-crease shadow-inner"
        >
          <div
            className="h-full bg-wax transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="p-3 rounded border border-crease bg-parchment/80 flex items-start gap-2.5 font-letter text-[11px] text-foreground-muted">
        <Lock size={14} className="text-ink shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t("reveal.encryptedAtRest")}
        </p>
      </div>
    </div>
  );
}

function TimeBlock({
  value,
  label,
  highlight = false,
}: {
  value: string | number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-3 sm:p-4 rounded border border-crease bg-parchment shadow-sm flex flex-col items-center justify-center">
      <span
        className={cn(
          "font-mono text-2xl sm:text-4xl font-extrabold leading-none",
          highlight ? "text-wax" : "text-ink",
        )}
      >
        {value}
      </span>
      <span className="font-letter text-[9px] sm:text-[10px] text-foreground-muted uppercase tracking-widest mt-2 leading-none">
        {label}
      </span>
    </div>
  );
}
