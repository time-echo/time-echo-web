"use client";

import React from "react";
import Link from "next/link";
import { Letter } from "@/types/timeecho";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import {
  Calendar,
  Compass,
  ArrowRight,
  Lock,
  CheckCircle,
  Archive,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Stamp } from "@/components/stamps";

export interface CapsuleCardProps {
  capsule: Letter;
  className?: string;
}

export function CapsuleCard({ capsule, className }: CapsuleCardProps) {
  const { locale, t } = useTimeEcho();

  const isPending = capsule.status === "pending";
  const isDelivered = capsule.status === "delivered";
  const isOpened = capsule.status === "opened";
  const isArchived = capsule.status === "archived";

  const scheduledFormatted = formatLocaleDate(capsule.scheduledAt, locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className={cn(
        "group relative rounded border border-crease bg-parchment p-6 sm:p-7 shadow-sm",
        "hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-ink/40 transition-all duration-200",
        "flex flex-col justify-between overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/80 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 border-b border-crease/70 pb-3 font-letter text-xs text-foreground-muted select-none">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isPending && "bg-ink animate-pulse",
                isDelivered && "bg-wax",
                isOpened && "bg-ink",
                isArchived && "bg-foreground-muted",
              )}
            />
            <span className="font-bold tracking-wider text-ink uppercase">
              {capsule.docketNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {capsule.stampId && (
              <Stamp
                id={capsule.stampId}
                size="sm"
                hasPostmark={isDelivered || isOpened}
                rotation={-2}
              />
            )}
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-crease bg-manila/50">
              {capsule.language.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
          {isPending && (
            <CountdownBadge
              targetDate={capsule.scheduledAt}
              variant="pill"
              size="sm"
            />
          )}

          {isDelivered && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-wax bg-wax/10 text-wax font-letter text-[11px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-wax animate-pulse" />
              <span>{t("dashboard.unlockedSealIntact")}</span>
            </span>
          )}

          {isOpened && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 bg-ink/10 text-ink font-letter text-[11px] font-semibold tracking-wider uppercase">
              <CheckCircle size={12} />
              <span>{t("common.opened").toUpperCase()}</span>
            </span>
          )}

          {isArchived && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-crease bg-crease/40 text-foreground-muted font-letter text-[11px] tracking-wider uppercase">
              <Archive size={12} />
              <span>{t("common.archived").toUpperCase()}</span>
            </span>
          )}

          <div className="flex items-center gap-1.5 font-letter text-[11px] text-foreground-muted">
            <Calendar size={12} />
            <span>{scheduledFormatted}</span>
          </div>
        </div>

        <h3 className="mt-4 font-serif-editorial text-xl sm:text-2xl font-bold text-ink leading-snug group-hover:text-wax transition-colors">
          <Link href={`/letters/${capsule.id}`} className="focus:outline-none">
            {capsule.title}
          </Link>
        </h3>

        <p className="mt-2.5 font-letter text-xs sm:text-sm text-foreground-muted line-clamp-3 leading-relaxed">
          {isPending ? (
            <span className="italic opacity-70 flex items-center gap-1.5">
              <Lock size={12} className="shrink-0" />
              <span>{t("dashboard.sealedNotice")}</span>
            </span>
          ) : (
            capsule.content
          )}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-crease/70 flex flex-wrap items-center justify-between gap-3 font-letter text-xs">
        <div className="flex items-center gap-3 text-foreground-muted">
          {capsule.predictions && capsule.predictions.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Compass size={13} className="text-ink" />
              <span>
                {capsule.predictions.length} {t("dashboard.predictionsCount")}
              </span>
            </span>
          )}
        </div>

        <Link
          href={`/letters/${capsule.id}`}
          className={cn(
            "inline-flex items-center gap-1.5 font-letter text-xs uppercase tracking-wider font-bold transition-all min-h-[44px] py-1",
            isDelivered
              ? "text-wax hover:translate-x-1"
              : "text-ink hover:text-wax hover:translate-x-1",
          )}
        >
          <span>
            {isDelivered ? t("dashboard.breakSeal") : t("common.inspect")}
          </span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="absolute right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <PostmarkStamp
          docketId={capsule.docketNumber}
          date={scheduledFormatted}
          variant="circular"
          size="sm"
        />
      </div>
    </article>
  );
}
