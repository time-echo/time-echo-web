"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Skeleton } from "@/components/ui/Skeleton";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

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
    let timerId: ReturnType<typeof setTimeout> | null = null;

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
        await refreshCapsules().catch(() => {});

        timerId = setTimeout(() => {
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
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [token, authenticateWithToken, refreshCapsules, router, t]);

  return (
    <div className="max-w-md mx-auto py-16 px-4 font-ui animate-fade-in text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs text-center">
        {status === "verifying" && (
          <div className="space-y-4 py-4 flex flex-col items-center">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="w-48 h-6 rounded-xs" />
              <Skeleton className="w-64 h-3.5 rounded-xs" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full border border-ink/40 bg-ink/10 flex items-center justify-center text-ink mx-auto shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif-editorial text-2xl font-bold text-foreground">
                {t("login.authenticatedTitle")}
              </h1>
              <p className="text-xs font-letter text-foreground-muted">
                {t("login.redirectingVault")}
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5 py-4">
            <div className="w-16 h-16 rounded-full border border-wax/40 bg-wax/10 flex items-center justify-center text-wax mx-auto shadow-xs">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif-editorial text-2xl font-bold text-foreground">
                {t("login.tokenErrorTitle")}
              </h1>
              <p className="text-xs font-letter text-wax leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-5 py-2.5 text-xs font-medium uppercase tracking-wider font-letter shadow-xs transition-colors"
              >
                <Mail size={14} />
                <span>{t("login.requestNewLink")}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
