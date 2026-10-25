"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const { t } = useTimeEcho();
  const email = searchParams.get("email") || "tu@email.com";

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-ui text-center text-foreground animate-fade-in">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs">
        {/* Seal Icon */}
        <div className="wax-seal w-16 h-16 rounded-full mx-auto flex items-center justify-center text-on-wax select-none shadow-xs">
          <Mail size={28} />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
            {t("checkEmail.title")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-sm mx-auto">
            {t("checkEmail.subtitle")}
            <br />
            <strong className="text-foreground font-semibold break-all">
              {email}
            </strong>
          </p>
        </div>

        {/* Spam Notice Card */}
        <div className="archival-folder rounded-xs p-3.5 text-xs font-letter text-foreground-muted leading-relaxed border border-manila-border text-center">
          {t("checkEmail.spamNotice")}
        </div>

        {/* Navigation & Actions */}
        <div className="space-y-3 pt-3 border-t border-crease">
          {/* Temporary Demo Mode Action (as requested) */}
          <Link
            href="/dashboard"
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>{t("checkEmail.continueDemo")}</span>
            <ArrowRight size={14} />
          </Link>

          {/* Try Another Email Link */}
          <div>
            <Link
              href="/login"
              className="border border-crease text-foreground hover:bg-manila/50 rounded-xs text-xs font-semibold uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 transition-colors cursor-pointer w-full bg-transparent"
            >
              <ArrowLeft size={14} />
              <span>{t("checkEmail.tryAnotherEmail")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-16 text-center font-letter text-xs text-foreground-muted animate-pulse">
          ...
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
