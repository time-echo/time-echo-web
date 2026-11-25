"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { SocialAuthButtons } from "@/components/ui/SocialAuthButtons";
import { Mail, Lock, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

type LoginMode = "password" | "magic_link";

function getInitialOauthErrorKey(): string | null {
  if (typeof window === "undefined") return null;
  const errCode = new URLSearchParams(window.location.search).get("error");
  if (!errCode) return null;
  if (errCode === "email_required") return "login.oauthEmailRequired";
  if (errCode === "unverified_provider_email") {
    return "login.oauthUnverifiedEmail";
  }
  return "login.oauthFailed";
}

export default function LoginPage() {
  const router = useRouter();
  const { requestMagicLink, loginWithPassword } = useAuth();
  const { t, locale } = useTimeEcho();

  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const key = getInitialOauthErrorKey();
    return key ? t(key) : null;
  });

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
      if (mode === "password") {
        await loginWithPassword(trimmed, password);
        router.push("/dashboard");
      } else {
        await requestMagicLink(trimmed, locale);
        router.push(`/check_email?email=${encodeURIComponent(trimmed)}`);
      }
    } catch (err) {
      const fallback =
        mode === "password"
          ? t("login.invalidCredentials")
          : t("login.requestError");
      const msg = err instanceof Error ? err.message : fallback;
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-ui animate-fade-in text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="text-center space-y-3">
          <div className="wax-seal w-14 h-14 rounded-full mx-auto flex items-center justify-center text-on-wax select-none shadow-xs">
            {mode === "password" ? <Lock size={22} /> : <Mail size={24} />}
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold leading-tight">
            {t("login.title")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            {t("login.subtitle")}
          </p>
        </div>

        <div
          role="tablist"
          className="grid grid-cols-2 border border-crease rounded-xs p-0.5 bg-manila/40"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "password"}
            onClick={() => {
              setMode("password");
              setError(null);
            }}
            className={`py-2 text-xs font-letter font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              mode === "password"
                ? "bg-wax text-on-wax"
                : "text-foreground-muted hover:text-foreground bg-transparent"
            }`}
          >
            {t("login.passwordTab")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "magic_link"}
            onClick={() => {
              setMode("magic_link");
              setError(null);
            }}
            className={`py-2 text-xs font-letter font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              mode === "magic_link"
                ? "bg-wax text-on-wax"
                : "text-foreground-muted hover:text-foreground bg-transparent"
            }`}
          >
            {t("login.magicLinkTab")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              htmlFor="login-email"
              className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
            >
              {t("login.emailLabel")}
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="you@example.com"
              className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
              required
            />
          </div>

          {mode === "password" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-letter font-semibold text-foreground-muted uppercase tracking-wider block"
                >
                  {t("login.passwordLabel")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-letter text-ink hover:underline"
                >
                  {t("login.forgotPasswordLink")}
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={t("login.passwordPlaceholder")}
                className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted focus:border-wax focus:outline-none min-h-[44px]"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>
                  {mode === "password"
                    ? t("login.signInButton")
                    : t("login.sendButton")}
                  ...
                </span>
              </>
            ) : (
              <span>
                {mode === "password"
                  ? t("login.signInButton")
                  : t("login.sendButton")}
              </span>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-crease" />
          <span className="shrink mx-3 text-[11px] font-letter uppercase tracking-widest text-foreground-muted">
            {t("login.orDivider")}
          </span>
          <div className="flex-grow border-t border-crease" />
        </div>

        <SocialAuthButtons purpose="login" />

        <div className="text-center pt-2 border-t border-crease">
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
  );
}
