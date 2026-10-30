"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { ArchivalLoader } from "@/components/ui/ArchivalLoader";
import { Mail, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface TokenLoginPageProps {
  params: Promise<{ token: string }>;
}

export default function TokenLoginPage({ params }: TokenLoginPageProps) {
  const { token } = use(params);
  const router = useRouter();
  const { authenticateWithToken } = useAuth();
  const { refreshCapsules, t } = useTimeEcho();

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!token) {
        setStatus("error");
        setErrorMessage(t("login.invalidToken"));
        return;
      }

      try {
        await authenticateWithToken(token);
        if (!isMounted) return;

        setStatus("success");
        // Refresh vault capsules for authenticated user
        await refreshCapsules().catch(() => {});

        // Redirect after short celebration delay
        setTimeout(() => {
          if (isMounted) {
            router.push("/dashboard");
          }
        }, 1200);
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        const msg =
          err instanceof Error ? err.message : t("login.invalidToken");
        setErrorMessage(msg);
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, authenticateWithToken, refreshCapsules, router, t]);

  return (
    <div className="max-w-md mx-auto py-16 px-4 font-ui animate-fade-in text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs text-center">
        {status === "verifying" && (
          <ArchivalLoader
            variant="inline"
            title={t("login.verifyingTitle")}
            subtitle={t("login.verifyingSubtitle")}
          />
        )}

        {status === "success" && (
          <div className="space-y-6 animate-fade-in">
            <div className="wax-seal w-16 h-16 rounded-full mx-auto flex items-center justify-center text-on-wax select-none shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
                {t("login.successTitle")}
              </h1>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {t("login.successSubtitle")}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>{t("login.goToVault")}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-wax/10 border border-wax/20 text-wax select-none shadow-xs">
              <AlertTriangle size={30} />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
                {t("login.invalidTokenTitle")}
              </h1>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {errorMessage || t("login.invalidToken")}
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <Link
                href="/login"
                className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail size={14} />
                <span>{t("login.requestNewLink")}</span>
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-xs font-letter font-semibold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <span>{t("login.backHome")}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
