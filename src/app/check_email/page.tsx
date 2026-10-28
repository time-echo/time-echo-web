"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { useAuth } from "@/lib/context/AuthContext";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const { t } = useTimeEcho();
  const { requestMagicLink } = useAuth();
  const email = searchParams.get("email") || "tu@email.com";

  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email || email === "tu@email.com") return;
    setIsResending(true);
    setResendNotice(null);
    try {
      await requestMagicLink(email);
      setResendNotice(t("login.dispatchedTitle") || "¡Enlace reenviado!");
      setTimeout(() => setResendNotice(null), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al reenviar.";
      setResendNotice(msg);
    } finally {
      setIsResending(false);
    }
  };

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

        {/* Resend Notice banner if resent */}
        {resendNotice && (
          <div className="p-3 bg-wax/10 border border-wax/20 text-wax text-xs rounded-xs flex items-center justify-center gap-2 font-letter animate-fade-in">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{resendNotice}</span>
          </div>
        )}

        {/* Spam Notice Card */}
        <div className="archival-folder rounded-xs p-3.5 text-xs font-letter text-foreground-muted leading-relaxed border border-manila-border text-center">
          {t("checkEmail.spamNotice")}
        </div>

        {/* Navigation & Actions */}
        <div className="space-y-3 pt-3 border-t border-crease">
          {/* Resend Link button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isResending ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                <span>Reenviar enlace</span>
              </>
            )}
          </button>

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
