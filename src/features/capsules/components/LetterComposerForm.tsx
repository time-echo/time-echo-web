"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLetterComposer, HorizonPreset } from "@/features/capsules";
import { LinedPaperCanvas } from "./LinedPaperCanvas";
import { EmotionalSliders } from "./EmotionalSliders";
import { PredictionFields } from "./PredictionFields";
import { WaxSeal } from "@/components/ui/WaxSeal";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Letter } from "@/types/timeecho";
import {
  Calendar,
  Mail,
  Type,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS_ES: Array<{ id: HorizonPreset; label: string; desc: string }> = [
  { id: "6m", label: "6 Meses", desc: "Próxima estación" },
  { id: "1y", label: "1 Año", desc: "Ciclo anual" },
  { id: "3y", label: "3 Años", desc: "Horizonte de vida" },
  { id: "5y", label: "5 Años", desc: "Metamorfosis" },
  { id: "custom", label: "Elegir Fecha", desc: "Personalizado" },
];

const PRESETS_EN: Array<{ id: HorizonPreset; label: string; desc: string }> = [
  { id: "6m", label: "6 Months", desc: "Next season" },
  { id: "1y", label: "1 Year", desc: "Annual cycle" },
  { id: "3y", label: "3 Years", desc: "Life milestone" },
  { id: "5y", label: "5 Years", desc: "Metamorphosis" },
  { id: "custom", label: "Pick Date", desc: "Custom date" },
];

export interface LetterComposerFormProps {
  onSuccess?: (created: Letter) => void;
  showDocketHeader?: boolean;
  className?: string;
  defaultHorizon?: HorizonPreset;
}

export function LetterComposerForm({
  onSuccess,
  showDocketHeader = true,
  className,
  defaultHorizon,
}: LetterComposerFormProps) {
  const router = useRouter();
  const { locale } = useTimeEcho();
  const isEs = locale === "es";
  const presets = isEs ? PRESETS_ES : PRESETS_EN;

  const {
    form,
    setField,
    setHorizonPreset,
    setEmotionalLevel,
    setPredictions,
    validationErrors,
    isValid,
    isSubmitting,
    isSealing,
    error,
    submitLetter,
  } = useLetterComposer(
    defaultHorizon ? { horizonPreset: defaultHorizon } : undefined,
  );

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isValid) return;

    try {
      const created = await submitLetter();
      if (onSuccess) {
        onSuccess(created);
      } else {
        setTimeout(() => {
          router.push(`/letters/success?id=${encodeURIComponent(created.id)}`);
        }, 1200);
      }
    } catch {}
  };

  return (
    <div className={cn("space-y-8", className)}>
      {showDocketHeader && (
        <div className="p-6 rounded border border-crease bg-manila/80 shadow-sm flex flex-wrap items-center justify-between gap-4 font-letter">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-foreground-muted tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-wax animate-pulse" />
              <span>
                {isEs
                  ? "FOLIO № TE-NUEVO // COMPOSICIÓN EPISTOLAR"
                  : "DOCKET № TE-NEW // EPISTOLARY COMPOSITION"}
              </span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-ink">
              {isEs ? "Redactar Carta al Futuro" : "Draft Letter to the Future"}
            </h2>
            <p className="text-xs text-foreground-muted max-w-xl">
              {isEs
                ? "Toma la pluma, calibra tus sentimientos actuales y proyecta tus certezas hacia el horizonte elegido."
                : "Take up the quill, record your baseline emotions, and dispatch your reflections across time."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground-muted bg-parchment/60 px-3 py-1.5 rounded border border-crease">
            <Clock size={13} className="text-ink" />
            <span>{isEs ? "Cifrado al sellar" : "Ciphered on sealing"}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 sm:p-8 rounded border border-crease bg-parchment shadow-sm space-y-6 font-letter">
          <div className="border-b border-crease pb-3 flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Type size={14} className="text-wax" />
              <span>
                {isEs ? "1. Datos de Expedición" : "1. Dispatch Details"}
              </span>
            </span>
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">
              {isEs ? "CAMPOS REQUERIDOS" : "REQUIRED FIELDS"}
            </span>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="landing-letter-title"
              className="text-xs uppercase tracking-wider font-semibold text-ink block"
            >
              {isEs ? "Título de la Cápsula" : "Capsule Title"} *
            </label>
            <input
              id="landing-letter-title"
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder={
                isEs
                  ? "Ej: Reflexiones sobre una nueva etapa // El cruce del umbral"
                  : "E.g., Reflections on a new season // Crossing the threshold"
              }
              className={cn(
                "w-full px-3.5 py-2.5 rounded border border-crease bg-manila/30 font-serif-editorial text-base sm:text-lg text-ink placeholder:text-foreground-muted/40 focus:outline-none focus:border-ink shadow-2xs",
                hasAttemptedSubmit &&
                  validationErrors.title &&
                  "border-wax bg-wax/5",
              )}
            />
            {hasAttemptedSubmit && validationErrors.title && (
              <p className="text-xs text-wax font-mono">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="landing-letter-email"
              className="text-xs uppercase tracking-wider font-semibold text-ink flex items-center gap-1"
            >
              <Mail size={12} className="text-ink" />
              <span>
                {isEs ? "Correo Electrónico de Entrega" : "Delivery Email"} *
              </span>
            </label>
            <input
              id="landing-letter-email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="tu.correo@personal.me"
              className={cn(
                "w-full px-3.5 py-2.5 rounded border border-crease bg-manila/30 font-letter text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/40 focus:outline-none focus:border-ink shadow-2xs min-h-[44px]",
                hasAttemptedSubmit &&
                  validationErrors.email &&
                  "border-wax bg-wax/5",
              )}
            />
            {hasAttemptedSubmit && validationErrors.email && (
              <p className="text-xs text-wax font-mono">
                {validationErrors.email}
              </p>
            )}
            <span className="text-[11px] text-foreground-muted block">
              {isEs
                ? "Te notificaremos cuando el reloj marque el momento exacto para quebrar el sello."
                : "We will dispatch an alert when the time arrives to break the crimson seal."}
            </span>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-crease/60">
            <label className="text-xs uppercase tracking-wider font-semibold text-ink flex items-center gap-1.5">
              <Calendar size={13} className="text-wax" />
              <span>
                {isEs
                  ? "Horizonte de Entrega Programada"
                  : "Scheduled Delivery Horizon"}{" "}
                *
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {presets.map((p) => {
                const isSelected = form.horizonPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setHorizonPreset(p.id)}
                    className={cn(
                      "p-3 rounded border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[48px]",
                      isSelected
                        ? "border-wax bg-wax/10 text-ink shadow-xs"
                        : "border-crease bg-manila/30 hover:bg-manila/70 text-foreground-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold uppercase",
                        isSelected && "text-wax",
                      )}
                    >
                      {p.label}
                    </span>
                    <span className="text-[10px] opacity-75 mt-0.5">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {form.horizonPreset === "custom" && (
              <div className="pt-2">
                <label
                  htmlFor="composer-custom-date"
                  className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5"
                >
                  {isEs ? "Fecha Personalizada" : "Custom Delivery Date"}
                </label>
                <input
                  id="composer-custom-date"
                  type="date"
                  value={form.scheduledAt}
                  onChange={(e) => setField("scheduledAt", e.target.value)}
                  className="px-3.5 py-2.5 rounded border border-crease bg-manila/40 font-mono text-xs text-ink focus:outline-none focus:border-ink cursor-pointer min-h-[44px]"
                />
              </div>
            )}

            {hasAttemptedSubmit && validationErrors.scheduledAt && (
              <p className="text-xs text-wax font-mono">
                {validationErrors.scheduledAt}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between font-letter text-xs text-foreground-muted px-1">
            <span className="font-bold text-ink uppercase tracking-wider">
              {isEs
                ? "2. Pliego Timbrado"
                : "2. Ruled Letter Stationery"}{" "}
              *
            </span>
            <span className="text-[11px] font-mono">
              COURIER PRIME // 2.25rem
            </span>
          </div>

          <LinedPaperCanvas
            value={form.content}
            onChange={(v) => setField("content", v)}
            minRows={16}
          />

          {hasAttemptedSubmit && validationErrors.content && (
            <p className="text-xs text-wax font-mono px-2">
              {validationErrors.content}
            </p>
          )}
        </div>

        <EmotionalSliders
          values={form.emotionalSnapshot}
          onChange={(field, val) => setEmotionalLevel(field, val)}
        />

        <PredictionFields
          predictions={form.predictions}
          onChange={setPredictions}
        />

        {error && (
          <div className="p-3.5 rounded border border-wax/40 bg-wax/10 text-wax font-letter text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded border border-crease bg-manila/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 font-letter">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-ink uppercase tracking-wider">
              <ShieldCheck size={15} className="text-wax" />
              <span>
                {isEs
                  ? "Sello Carmesí Criptográfico"
                  : "Cryptographic Crimson Seal"}
              </span>
            </div>
            <p className="text-xs text-foreground-muted max-w-md">
              {isEs
                ? "Una vez sellada la carta, permanecerá inaccesible en la bóveda hasta la fecha establecida."
                : "Once sealed, the letter will remain encrypted in the vault until the chosen horizon."}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSealing}
            className={cn(
              "inline-flex items-center justify-center gap-3 px-8 py-4 rounded border-2 border-wax bg-wax text-on-wax w-full sm:w-auto min-h-[44px]",
              "font-letter text-sm font-bold uppercase tracking-widest shadow-lg transition-all",
              "hover:bg-wax-hover hover:scale-[1.03] active:scale-[0.97] cursor-pointer",
              (isSubmitting || isSealing) && "opacity-70 cursor-not-allowed",
            )}
          >
            <Sparkles size={16} />
            <span>
              {isSealing
                ? isEs
                  ? "Sellando con Lacre..."
                  : "Sealing with Wax..."
                : isEs
                  ? "Sellar con Lacre Carmesí"
                  : "Seal with Crimson Wax"}
            </span>
            <ArrowRight size={15} />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isSealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sealing-dialog-title"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="p-8 rounded-lg border border-crease bg-parchment max-w-sm w-full space-y-6 shadow-2xl flex flex-col items-center"
            >
              <WaxSeal size="lg" isLocked={false} />

              <div className="space-y-2">
                <h3
                  id="sealing-dialog-title"
                  className="font-serif-editorial text-2xl font-bold text-ink"
                >
                  {isEs ? "Sellando la Bóveda..." : "Sealing the Vault..."}
                </h3>
                <p className="font-letter text-xs text-foreground-muted leading-relaxed">
                  {isEs
                    ? "Vertiendo el lacre carmesí y estampando el folio oficial en la bóveda postal cifrada."
                    : "Pouring crimson wax and stamping official docket onto ciphered vault."}
                </p>
              </div>

              <div className="w-16 h-1 bg-crease rounded-full overflow-hidden">
                <div className="h-full bg-wax animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
