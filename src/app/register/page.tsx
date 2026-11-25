"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { SocialAuthButtons } from "@/components/ui/SocialAuthButtons";
import { Lock, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithPassword } = useAuth();
  const { t, locale } = useTimeEcho();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setError(t("login.invalidEmail"));
      return;
    }

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
      const result = await registerWithPassword(
        trimmed,
        password,
        passwordConfirmation,
        locale,
      );
      if (result.requiresEmailVerification) {
        router.push(`/check_email?email=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("login.registerError");
      setError(msg);
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
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold leading-tight">
            {t("login.registerTitle")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            {t("login.registerSubtitle")}
          </p>
        </div>

        <SocialAuthButtons purpose="login" />

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-crease" />
          <span className="shrink mx-3 text-[11px] font-letter uppercase tracking-widest text-foreground-muted">
            {t("login.orDivider")}
          </span>
          <div className="flex-grow border-t border-crease" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-wax/10 border border-wax/20 text-wax text-xs rounded-xs space-y-1 animate-fade-in font-letter">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{t("login.errorHeader")}</span>
              </p>
              <ul className="list-disc list-inside opacity-90 pl-1">
                <li>{error}</li>
              </ul>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
            >
              {t("login.emailLabel")}
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="register-password"
              className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
            >
              {t("login.passwordLabel")}
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              minLength={10}
              className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="register-password-confirm"
              className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
            >
              {t("login.confirmPasswordLabel")}
            </label>
            <input
              id="register-password-confirm"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder={t("login.confirmPasswordPlaceholder")}
              minLength={10}
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
                <span>{t("login.registerButton")}...</span>
              </>
            ) : (
              <span>{t("login.registerButton")}</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-letter text-foreground-muted space-y-2 pt-2 border-t border-crease">
          <p>
            {t("login.haveAccountPrompt")}{" "}
            <Link
              href="/login"
              className="text-wax font-semibold hover:underline"
            >
              {t("login.signInLink")}
            </Link>
          </p>
          <div>
            <Link
              href="/"
              className="text-xs font-letter font-semibold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>{t("login.backHome")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
