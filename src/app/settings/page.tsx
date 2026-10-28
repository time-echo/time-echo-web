"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { useFlash } from "@/components/ui/FlashBanner";
import { SupportedLanguage } from "@/types/timeecho";
import {
  Mail,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Globe,
  Loader2,
} from "lucide-react";

function getBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:3000/api/v1";
}

export default function SettingsPage() {
  const router = useRouter();
  const {
    user,
    token,
    logout,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const { resetVault, locale, setLocale, t } = useTimeEcho();
  const { notice, alert } = useFlash();

  const [editedEmail, setEditedEmail] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const baseUrl = getBaseUrl();
  const currentEmail = editedEmail ?? (user?.email || "");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmail || !currentEmail.includes("@")) {
      alert(t("composer.errors.emailInvalid"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (token) {
        const res = await fetch(`${baseUrl}/settings`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-Session-Token": token,
            "X-Locale": locale,
          },
          credentials: "include",
          body: JSON.stringify({ email: currentEmail }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errorMsg =
            json?.error?.message || json?.message || t("settings.savedNotice");
          alert(errorMsg);
          return;
        }
      }

      setSavedNotice(true);
      notice(t("settings.savedNotice"));
      setTimeout(() => setSavedNotice(false), 4000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : t("settings.savedNotice");
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = e.target.value as SupportedLanguage;
    setLocale(selectedLocale);
    notice(t("settings.savedNotice"));
  };

  const handleDeleteVault = async () => {
    const confirmed = window.confirm(t("settings.deleteConfirmPrompt"));
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      if (token) {
        await fetch(`${baseUrl}/settings`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-Session-Token": token,
          },
          credentials: "include",
        }).catch(() => {});
      }
      await resetVault();
      await logout();
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-ui pb-16 animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
        <div className="space-y-1">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted tracking-wider">
            {t("settings.subtitle")}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-crease font-letter text-xs text-foreground uppercase tracking-wider hover:bg-manila/50 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft size={13} />
          <span>{t("settings.backToVault")}</span>
        </Link>
      </div>

      {savedNotice && (
        <div className="paper-sheet rounded-xs border border-crease bg-manila/30 p-3 text-xs font-letter text-foreground flex items-center gap-2">
          <CheckCircle size={13} className="text-ink shrink-0" />
          <span>{t("settings.savedNotice")}</span>
        </div>
      )}

      <div className="paper-sheet rounded-xs border border-crease p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3.5">
          <h2 className="font-serif-editorial text-xl font-semibold text-foreground flex items-center gap-2">
            <Globe size={18} className="text-ink" />
            <span>{t("settings.vaultLanguage")}</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="settings-language"
              className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
            >
              {t("settings.correspondenceLanguage")}
            </label>
            <select
              id="settings-language"
              value={locale}
              onChange={handleLanguageChange}
              className="w-full paper-sheet rounded-xs border border-crease px-4 py-2.5 font-letter text-xs text-foreground bg-parchment focus:border-wax focus:outline-none transition-colors min-h-[44px]"
            >
              <option value="es">Español (ES)</option>
              <option value="en">English (EN)</option>
            </select>
            <p className="text-[11px] font-letter text-foreground-muted leading-relaxed">
              {t("settings.languageDesc")}
            </p>
          </div>
        </div>
      </div>

      <div className="paper-sheet rounded-xs border border-crease p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3.5">
          <h2 className="font-serif-editorial text-xl font-semibold text-foreground flex items-center gap-2">
            <Mail size={18} className="text-ink" />
            <span>{t("settings.changeEmail")}</span>
          </h2>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="settings-email"
              className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
            >
              {t("settings.newEmail")}
            </label>
            <input
              id="settings-email"
              type="email"
              value={currentEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="w-full paper-sheet rounded-xs border border-crease px-4 py-2.5 font-letter text-xs text-foreground placeholder:text-foreground-muted focus:border-wax focus:outline-none transition-colors min-h-[44px]"
              placeholder="tu@email.com"
              required
            />
            <p className="text-[11px] font-letter text-foreground-muted leading-relaxed">
              {t("settings.emailDesc")}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-8 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{t("settings.updateEmail")}</span>
              </>
            ) : (
              <span>{t("settings.updateEmail")}</span>
            )}
          </button>
        </form>
      </div>

      <div className="archival-folder rounded-xs border border-wax/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-wax/20 pb-3 text-wax font-letter">
          <AlertTriangle size={18} />
          <h2 className="font-serif-editorial text-xl font-semibold text-wax">
            {t("settings.dangerZone")}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xs font-letter font-semibold uppercase tracking-wider text-wax">
              {t("settings.deleteVaultTitle")}
            </h3>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-lg">
              {t("settings.deleteVaultDesc")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteVault}
            disabled={isDeleting}
            className="border border-wax/40 text-wax hover:bg-wax/10 rounded-xs cursor-pointer shrink-0 font-letter text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] px-5 whitespace-nowrap bg-transparent flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{t("settings.deleteVaultButton")}</span>
              </>
            ) : (
              <span>{t("settings.deleteVaultButton")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
