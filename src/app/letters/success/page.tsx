"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { celebrate } from "@/lib/confetti";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { formatLocaleDate } from "@/lib/utils";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import { WaxSeal } from "@/components/ui/WaxSeal";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import {
  Calendar,
  Mail,
  ShieldCheck,
  Archive,
  Eye,
  PenTool,
  Clock,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("id");

  const { getCapsuleById, locale, t } = useTimeEcho();

  const capsule = letterId ? getCapsuleById(letterId) : undefined;

  useEffect(() => {
    celebrate("letter-sealed");
  }, []);

  const scheduledFormatted = capsule
    ? new Date(capsule.scheduledAt).toLocaleDateString(
        locale === "es" ? "es-ES" : "en-US",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )
    : t("success.futureScheduledDate");

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative rounded-md border border-crease bg-manila p-2 sm:p-2.5 shadow-[0_12px_36px_rgba(44,72,94,0.08)]">
        {/* Top Tab Bar */}
        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-crease/70 bg-crease/30 font-letter text-xs text-foreground-muted select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-wax animate-pulse" />
            <span className="font-bold text-ink uppercase tracking-wider text-[11px]">
              {`${t("success.badge")} // TIME-ECHO`}
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase">
            {t("success.recordConfirmed")}
          </span>
        </div>

        {/* Parchment Document Body */}
        <div className="relative rounded border border-crease bg-parchment p-4 sm:p-6 font-letter space-y-4 overflow-hidden">
          {/* Header Row: Title & Postmark */}
          <div className="flex items-start justify-between gap-4 border-b border-crease/60 pb-3.5 text-left">
            <div className="space-y-1">
              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-ink leading-tight">
                {t("success.title")}
              </h1>
              <p className="text-xs text-foreground-muted max-w-lg leading-relaxed">
                {t("success.description")}
              </p>
            </div>

            <div className="shrink-0 pointer-events-none opacity-85 hidden sm:block">
              <PostmarkStamp
                city="BOGOTÁ // CENTRAL"
                docketId={capsule?.docketNumber || "TE-00421"}
                date={formatLocaleDate(new Date().toISOString(), locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                subtext={t("success.postmarkedAndSealed")}
                variant="circular"
                size="sm"
              />
            </div>
          </div>

          {/* Main 2-Column Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Left: Wax Seal & Status */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 rounded border border-crease/80 bg-manila/30 text-center">
              <WaxSeal size="md" isLocked={true} />
              <span className="text-[10px] sm:text-[11px] text-wax font-mono font-bold tracking-widest uppercase mt-2">
                {t("success.sealIntact")}
              </span>

              {capsule && (
                <div className="mt-2.5 pt-2 border-t border-crease/60 w-full flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-foreground-muted flex items-center gap-1">
                    <Clock size={11} className="text-wax" />
                    <span>{t("success.remainingTime")}:</span>
                  </span>
                  <CountdownBadge
                    targetDate={capsule.scheduledAt}
                    size="sm"
                    variant="pill"
                  />
                </div>
              )}
            </div>

            {/* Right: Metadata & Security Notice */}
            <div className="md:col-span-7 flex flex-col justify-between gap-2.5">
              <div className="p-3.5 rounded border border-crease/80 bg-manila/40 text-left text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-crease/50 pb-1.5">
                  <span className="text-foreground-muted uppercase tracking-wider text-[11px]">
                    {t("success.docketNumber")}:
                  </span>
                  <span className="font-mono font-bold text-ink">
                    {capsule?.docketNumber || "TE-GENERADO"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-crease/50 pb-1.5">
                  <span className="text-foreground-muted uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Calendar size={12} className="text-wax" />
                    <span>{t("success.releaseDate")}:</span>
                  </span>
                  <span className="font-bold text-ink">{scheduledFormatted}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Mail size={12} className="text-wax" />
                    <span>{t("success.recipient")}:</span>
                  </span>
                  <span className="font-mono text-ink text-[11px] truncate max-w-[180px] sm:max-w-[220px]">
                    {capsule?.email || "yo.del.futuro@personal.me"}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded border border-crease/70 bg-crease/20 flex items-center gap-2 text-[11px] text-foreground-muted text-left">
                <ShieldCheck size={15} className="text-wax shrink-0" />
                <p className="leading-snug">
                  {t("success.encryptedNotice")}
                </p>
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-end gap-2.5 border-t border-crease/50">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-wax bg-wax text-on-wax hover:bg-wax-hover text-xs font-bold uppercase tracking-wider shadow-xs transition-all min-h-[38px] focus-visible:outline-2 focus-visible:outline-wax"
            >
              <Archive size={14} />
              <span>{t("success.ctaVault")}</span>
            </Link>

            {letterId && (
              <Link
                href={`/letters/${letterId}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-crease bg-parchment hover:bg-manila text-ink text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[38px] focus-visible:outline-2 focus-visible:outline-wax"
              >
                <Eye size={14} />
                <span>{t("success.ctaInspect")}</span>
              </Link>
            )}

            <Link
              href="/letters/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-crease bg-parchment hover:bg-manila text-foreground-muted hover:text-ink text-xs uppercase tracking-wider transition-colors min-h-[38px] focus-visible:outline-2 focus-visible:outline-wax"
            >
              <PenTool size={14} />
              <span>{t("success.ctaNew")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LetterSuccessPage() {
  const { t } = useTimeEcho();

  return (
    <div className="w-full flex items-center justify-center">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto p-12 text-center font-letter text-xs text-foreground-muted">
            <div className="inline-block w-6 h-6 border-2 border-wax border-t-transparent rounded-full animate-spin mb-3" />
            <p>{t("common.loading")}</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
