"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  Mail,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { t, locale } = useTimeEcho();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setError(t("login.invalidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Locale": locale,
        },
        body: JSON.stringify({ email: trimmed, locale }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message || t("login.requestError"));
        return;
      }

      const payload = json?.data || json;
      setSentMessage(payload?.message || t("login.forgotSent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.requestError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-ui animate-fade-in text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="text-center space-y-3">
          <div className="wax-seal w-14 h-14 rounded-full mx-auto flex items-center justify-center text-on-wax select-none shadow-xs">
            <Mail size={22} />
          </div>
          <h1 className="font-serif-editorial text-3xl text-foreground font-semibold leading-tight">
            {t("login.forgotTitle")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            {t("login.forgotSubtitle")}
          </p>
        </div>

        {sentMessage ? (
          <div className="p-4 bg-manila/40 border border-crease rounded-xs text-xs font-letter text-foreground flex items-start gap-2.5">
            <CheckCircle size={16} className="text-ink shrink-0 mt-0.5" />
            <span>{sentMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-wax/10 border border-wax/20 text-wax text-xs rounded-xs space-y-1 font-letter">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>{t("login.errorHeader")}</span>
                </p>
                <p className="pl-5 opacity-90">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="forgot-email"
                className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
              >
                {t("login.emailLabel")}
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{t("login.forgotButton")}...</span>
                </>
              ) : (
                <span>{t("login.forgotButton")}</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-crease">
          <Link
            href="/login"
            className="text-xs font-letter font-semibold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>{t("login.backToLogin")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
