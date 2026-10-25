"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { useFlash } from "@/components/ui/FlashBanner";
import { Mail, AlertTriangle, ArrowLeft, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { resetVault, t } = useTimeEcho();
  const { notice } = useFlash();

  const [email, setEmail] = useState("user@timeecho.me");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    notice(t("settings.savedNotice"));
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
            className="border border-wax/40 text-wax hover:bg-wax/10 rounded-xs cursor-pointer shrink-0 font-letter text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] px-5 whitespace-nowrap bg-transparent"
          >
            {t("settings.deleteVaultButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
