"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Mail, AlertTriangle, ArrowLeft, CheckCircle, Sun, Moon, Monitor } from "lucide-react";

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
  const { locale, resetVault, appearanceMode, setAppearanceMode } =
    useTimeEcho();
  const isEs = locale === "es";

  const [email, setEmail] = useState("user@timeecho.me");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDeleteVault = async () => {
    const confirmed = window.confirm(
      isEs
        ? "¿Estás seguro de que deseas eliminar permanentemente todas tus cartas y registros? Esta acción no se puede deshacer."
        : "Are you sure you want to permanently delete all your capsules and records? This action cannot be undone.",
    );
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
            {isEs ? "Ajustes del Baúl" : "Vault Settings"}
          </h1>
          <p className="text-xs font-letter text-foreground-muted tracking-wider">
            {isEs
              ? "Gestiona tus preferencias de correspondencia y custodia."
              : "Manage correspondence preferences and custody."}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-crease font-letter text-xs text-foreground uppercase tracking-wider hover:bg-manila/50 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft size={13} />
          <span>{isEs ? "Volver al Baúl" : "Back to Vault"}</span>
        </Link>
      </div>

      {savedNotice && (
        <div className="paper-sheet rounded-xs border border-crease bg-manila/30 p-3 text-xs font-letter text-foreground flex items-center gap-2">
          <CheckCircle size={13} className="text-ink shrink-0" />
          <span>
            {isEs
              ? "Ajustes guardados correctamente."
              : "Settings saved successfully."}
          </span>
        </div>
      )}

      <div className="paper-sheet rounded-xs border border-crease p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3.5">
          <h2 className="font-serif-editorial text-xl font-semibold text-foreground flex items-center gap-2">
            <Sun size={18} className="text-ink" />
            <span>
              {isEs ? "Apariencia" : "Appearance"}
            </span>
          </h2>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block">
            {isEs ? "Modo de color" : "Color mode"}
          </span>
          <div
            role="group"
            aria-label={isEs ? "Modo de apariencia" : "Appearance mode"}
            className="grid grid-cols-3 gap-2"
          >
            {APPEARANCE_OPTIONS.map(({ value, icon: Icon }) => {
              const active = appearanceMode === value;
              const label =
                value === "light"
                  ? isEs
                    ? "Claro"
                    : "Light"
                  : value === "dark"
                    ? isEs
                      ? "Oscuro"
                      : "Dark"
                    : isEs
                      ? "Sistema"
                      : "System";
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
            {isEs
              ? "Claro y oscuro siguen la paleta de la bóveda; Sistema sigue el ajuste de tu dispositivo."
              : "Light and dark follow the vault palette; System follows your device setting."}
          </p>
        </div>
      </div>

      <div className="paper-sheet rounded-xs border border-crease p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3.5">
          <h2 className="font-serif-editorial text-xl font-semibold text-foreground flex items-center gap-2">
            <Mail size={18} className="text-ink" />
            <span>
              {isEs ? "Cambiar Correo Electrónico" : "Change Email Address"}
            </span>
          </h2>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="settings-email"
              className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
            >
              {isEs ? "Nueva Dirección de Correo" : "New Email Address"}
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
              {isEs
                ? "Las futuras cartas desbloqueadas se enviarán a esta nueva dirección."
                : "Future unlocked letters will be dispatched to this new address."}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3 px-8 text-xs font-semibold tracking-widest uppercase shadow-xs border-none cursor-pointer font-letter min-h-[44px] transition-colors"
          >
            {isEs ? "Actualizar Correo" : "Update Email"}
          </button>
        </form>
      </div>

      <div className="archival-folder rounded-xs border border-red-800/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-red-800/20 pb-3 text-wax font-letter">
          <AlertTriangle size={18} />
          <h2 className="font-serif-editorial text-xl font-semibold text-wax">
            {isEs ? "Zona de Riesgo" : "Danger Zone"}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-letter font-semibold uppercase tracking-wider text-wax">
              {isEs
                ? "Eliminar cuenta y baúl permanentemente"
                : "Permanently Delete Vault"}
            </h4>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-lg">
              {isEs
                ? "Esta acción eliminará de forma irreversible todas tus cartas en tránsito, predicciones y memorias históricas."
                : "This action will irreversibly wipe all capsules in transit, predictions, and historical records."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteVault}
            className="border border-wax/40 text-wax hover:bg-wax/10 rounded-xs cursor-pointer shrink-0 font-letter text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] px-5 whitespace-nowrap bg-transparent"
          >
            {isEs ? "Eliminar mi Baúl" : "Delete My Vault"}
          </button>
        </div>
      </div>
    </div>
  );
}
