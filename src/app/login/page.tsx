"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Mail, ArrowLeft, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTimeEcho();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError(t("login.invalidEmail"));
      return;
    }

    // Basic email check
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError(t("login.invalidEmail"));
      return;
    }

    setIsSubmitting(true);
    // Redirect to /check_email (matching the monolith Rails redirect to check_email_path)
    router.push(`/check_email?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-ui animate-fade-in text-foreground">
      <div className="paper-sheet rounded-xs border border-crease p-8 sm:p-10 space-y-6 shadow-xs">
        {/* Header Icon, Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="wax-seal w-14 h-14 rounded-full mx-auto flex items-center justify-center text-on-wax select-none shadow-xs">
            <Mail size={24} />
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold leading-tight">
            {t("login.title")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Alert Box matching monolith */}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-5 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors disabled:opacity-60"
          >
            {t("login.sendButton")}
          </button>
        </form>

        {/* Return to Home link */}
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
