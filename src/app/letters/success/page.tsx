"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { celebrate } from "@/lib/confetti";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { formatLocaleDate } from "@/lib/utils";
import { ArrowLeft, PenTool } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("id");

  const { getCapsuleById, locale, t } = useTimeEcho();
  const capsule = letterId ? getCapsuleById(letterId) : undefined;

  useEffect(() => {
    celebrate("letter-sealed");
  }, []);

  const sealDateFormatted = formatLocaleDate(
    capsule?.createdAt || new Date().toISOString(),
    locale,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const scheduledFormatted = capsule
    ? formatLocaleDate(capsule.scheduledAt, locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : t("success.futureScheduledDate");

  const recipientEmail = capsule?.email || "tu@correo.com";

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-ui animate-fade-in text-center text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-xs">
        {/* Header & Vintage Postal Stamp Docket */}
        <div className="space-y-4 relative">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground leading-tight">
            {t("success.title")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            <span
              dangerouslySetInnerHTML={{
                __html: t("success.description"),
              }}
            />{" "}
            <strong className="text-foreground font-semibold">
              {scheduledFormatted}
            </strong>
          </p>

          {/* Postal Certificate Card with Dashed Border and Cancellation Waves */}
          <div className="relative max-w-[280px] mx-auto border-2 border-dashed border-ink/30 p-4 rounded-xs font-letter text-[11px] tracking-widest text-ink uppercase select-none space-y-1.5 shadow-3xs bg-ink/5 overflow-hidden text-left">
            <div className="flex justify-between items-center px-1">
              <span>
                {t("success.seal")}: {sealDateFormatted}
              </span>
            </div>
            <div className="border-t border-dashed border-ink/20 pt-1.5 flex justify-between items-center px-1 font-serif-editorial italic text-xs tracking-normal text-ink">
              <span>{t("success.opening")}:</span>
              <span className="font-semibold font-letter not-italic tracking-tight text-foreground">
                {scheduledFormatted}
              </span>
            </div>

            {/* Wavy Cancellation Stamp Lines */}
            <div className="absolute -right-3 -top-2 opacity-15 pointer-events-none text-ink transform rotate-6">
              <svg
                className="w-20 h-10"
                fill="none"
                viewBox="0 0 100 30"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M 0,5 Q 25,12 50,5 T 100,5" />
                <path d="M 0,12 Q 25,19 50,12 T 100,12" />
                <path d="M 0,19 Q 25,26 50,19 T 100,19" />
              </svg>
            </div>
          </div>
        </div>

        {/* What Happens Next Card */}
        <div className="archival-folder rounded-xs p-4 space-y-1.5 border border-manila-border text-left font-letter">
          <p className="text-[10px] font-semibold text-ink uppercase tracking-wider">
            {t("success.nextTitle")}
          </p>
          <p className="text-xs text-foreground-muted leading-relaxed">
            {t("success.nextDesc", { email: recipientEmail })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-crease space-y-3 font-letter relative">
          <Link
            href="/dashboard"
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3.5 px-6 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] flex items-center justify-center transition-colors"
          >
            {t("success.ctaVault")}
          </Link>

          <Link
            href="/letters/new"
            className="border border-crease text-foreground hover:bg-manila/50 rounded-xs py-2.5 px-4 text-xs font-semibold uppercase tracking-wider font-letter flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full bg-transparent"
          >
            <PenTool size={13} />
            <span>{t("success.ctaNew")}</span>
          </Link>

          <Link
            href="/"
            className="text-[10px] font-semibold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5 pt-2"
          >
            <ArrowLeft size={12} />
            <span>{t("success.ctaHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LetterSuccessPage() {
  const { t } = useTimeEcho();

  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-16 text-center font-letter text-xs text-foreground-muted animate-pulse">
          <p>{t("common.loading")}</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
