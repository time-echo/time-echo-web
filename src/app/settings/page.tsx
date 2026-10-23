"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Mail, AlertTriangle, ArrowLeft, CheckCircle, Sun, Moon, Monitor, Globe } from "lucide-react";

const APPEARANCE_OPTIONS: Array<{
  value: "light" | "dark" | "system";
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}> = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

export default function SettingsPage() {
  const router = useRouter();
  const { locale, setLocale, resetVault, appearanceMode, setAppearanceMode, t } =
    useTimeEcho();

  const [email, setEmail] = useState("user@timeecho.me");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDeleteVault = async () => {
    const confirmed = window.confirm(t("settings.deleteConfirmPrompt"));
    if (confirmed) {
      await resetVault();
      router.push("/");
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
            <Sun size={18} className="text-ink" />
            <span>{t("settings.appearance")}</span>
          </h2>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block">
            {t("settings.colorMode")}
          </span>
          <div
            role="group"
            aria-label={t("settings.colorModeAria")}
            className="grid grid-cols-3 gap-2"
          >
            {APPEARANCE_OPTIONS.map(({ value, icon: Icon }) => {
              const active = appearanceMode === value;
              const label =
                value === "light"
                  ? t("settings.light")
                  : value === "dark"
                    ? t("settings.dark")
                    : t("settings.system");
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAppearanceMode(value)}
                  aria-pressed={active}
                  className={`min-h-[44px] rounded-xs border px-3 py-2.5 text-xs font-letter font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    active
                      ? "border-wax bg-wax text-on-wax"
                      : "border-crease bg-transparent text-foreground hover:bg-manila/50"
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-letter text-foreground-muted leading-relaxed">
            {t("settings.colorModeDesc")}
          </p>
        </div>
      </div>

      <div className="paper-sheet rounded-xs border border-crease p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3.5">
          <h2 className="font-serif-editorial text-xl font-semibold text-foreground flex items-center gap-2">
            <Globe size={18} className="text-ink" />
            <span>{t("settings.vaultLanguage")}</span>
          </h2>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block">
            {t("settings.correspondenceLanguage")}
          </span>
          <div
            role="group"
            aria-label={t("settings.selectLanguage")}
            className="grid grid-cols-2 gap-2"
          >
            {[
              { code: "es" as const, label: "Español", tag: "ES" },
              { code: "en" as const, label: "English", tag: "EN" },
            ].map(({ code, label, tag }) => {
              const active = locale === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  aria-pressed={active}
                  className={`min-h-[44px] rounded-xs border px-3 py-2.5 text-xs font-letter font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    active
                      ? "border-wax bg-wax text-on-wax"
                      : "border-crease bg-transparent text-foreground hover:bg-manila/50"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-xs font-mono font-bold ${
                      active
                        ? "bg-wax-hover text-on-wax"
                        : "bg-manila text-foreground-muted border border-crease/60"
                    }`}
                  >
                    {tag}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-letter text-foreground-muted leading-relaxed">
            {t("settings.languageDesc")}
          </p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full paper-sheet rounded-xs border border-crease px-4 py-2.5 font-letter text-xs text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-colors min-h-[44px]"
              placeholder="tu@email.com"
              required
            />
            <p className="text-[11px] font-letter text-foreground-muted leading-relaxed">
              {t("settings.emailDesc")}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-8 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors"
          >
            {t("settings.updateEmail")}
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
            <h4 className="text-xs font-letter font-semibold uppercase tracking-wider text-wax">
              {t("settings.deleteVaultTitle")}
            </h4>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-lg">
              {t("settings.deleteVaultDesc")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteVault}
            className="border border-wax/40 text-wax hover:bg-wax/10 rounded-xs cursor-pointer shrink-0 font-letter text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] px-5 whitespace-nowrap bg-transparent"
          >
            {t("settings.deleteVaultButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
