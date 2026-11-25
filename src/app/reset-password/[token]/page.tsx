"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  Lock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { t, locale } = useTimeEcho();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 10) {
      setError(t("login.passwordTooShort"));
      return;
    }

    if (password !== passwordConfirmation) {
      setError(t("login.passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      const token = params?.token || "";
      const res = await fetch(
        `/api/auth/password-reset/${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Locale": locale,
          },
          body: JSON.stringify({
            password,
            password_confirmation: passwordConfirmation,
          }),
        },
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message || t("login.resetError"));
        return;
      }

      const payload = json?.data || json;
      setSuccessMessage(payload?.message || t("login.resetSuccess"));
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.resetError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-ui animate-fade-in text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="text-center space-y-3">
          <div className="wax-seal w-14 h-14 rounded-full mx-auto flex items-center justify-center text-on-wax select-none shadow-xs">
            <Lock size={22} />
          </div>
          <h1 className="font-serif-editorial text-3xl text-foreground font-semibold leading-tight">
            {t("login.resetTitle")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            {t("login.resetSubtitle")}
          </p>
        </div>

        {successMessage ? (
          <div className="p-4 bg-manila/40 border border-crease rounded-xs text-xs font-letter text-foreground flex items-start gap-2.5">
            <CheckCircle size={16} className="text-ink shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                htmlFor="reset-password"
                className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
              >
                {t("login.newPasswordLabel")}
              </label>
              <input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={10}
                placeholder={t("login.passwordPlaceholder")}
                className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reset-password-confirm"
                className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
              >
                {t("login.confirmPasswordLabel")}
              </label>
              <input
                id="reset-password-confirm"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                minLength={10}
                placeholder={t("login.confirmPasswordPlaceholder")}
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
                  <span>{t("login.resetButton")}...</span>
                </>
              ) : (
                <span>{t("login.resetButton")}</span>
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
