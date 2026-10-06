"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { celebrate } from "@/lib/confetti";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { formatLocaleDate } from "@/lib/utils";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import { WaxSeal } from "@/components/ui/WaxSeal";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import {
  CheckCircle2,
  Calendar,
  Mail,
  ShieldCheck,
  Archive,
  Eye,
  PenTool,
  Clock,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get("id");

  const { getCapsuleById, locale } = useTimeEcho();
  const isEs = locale === "es";

  const capsule = letterId ? getCapsuleById(letterId) : undefined;

  useEffect(() => {
    celebrate("letter-sealed");
  }, []);

  const scheduledFormatted = capsule
    ? new Date(capsule.scheduledAt).toLocaleDateString(
        isEs ? "es-ES" : "en-US",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )
    : isEs
      ? "Fecha futura programada"
      : "Scheduled future date";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="relative rounded-md border border-crease bg-manila p-2 sm:p-3 shadow-[0_12px_36px_rgba(44,72,94,0.08)]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-crease/70 bg-crease/30 font-letter text-xs text-foreground-muted select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-wax" />
            <span className="font-bold text-ink uppercase tracking-wider">
              {isEs ? "RECIBO OFICIAL DE BÓVEDA // TIME-ECHO" : "OFFICIAL VAULT RECEIPT // TIME-ECHO"}
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase">
            {isEs ? "REGISTRO CONFIRMADO" : "RECORD CONFIRMED"}
          </span>
        </div>

        <div className="relative rounded border border-crease bg-parchment p-6 sm:p-10 space-y-8 text-center font-letter overflow-hidden">
          <div className="absolute right-4 top-4 pointer-events-none opacity-85">
            <PostmarkStamp
              city="BOGOTÁ // CENTRAL"
              docketId={capsule?.docketNumber || "TE-00421"}
              date={formatLocaleDate(new Date().toISOString(), locale, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              subtext={isEs ? "TIMBRADO Y SELLADO" : "POSTMARKED & SEALED"}
              variant="circular"
              size="sm"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="w-14 h-14 rounded-full bg-fulfilled-bg border border-fulfilled-border text-fulfilled mx-auto flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-ink">
              {isEs
                ? "Cápsula Sellada con Éxito"
                : "Capsule Sealed Successfully"}
            </h1>

            <p className="text-xs text-foreground-muted max-w-md mx-auto">
              {isEs
                ? "Tu pliego ha sido cifrado y asegurado bajo custodia postal. El lacre carmesí preservará tus reflexiones hasta el día convenido."
                : "Your letter is now encrypted and secured under postal custody. The crimson seal will preserve your words until the appointed day."}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <WaxSeal size="lg" isLocked={true} />
            <span className="text-[11px] text-wax font-mono font-bold tracking-widest uppercase mt-3">
              {isEs ? "LACRE CARMESÍ INTACTO" : "CARMINE WAX SEAL INTACT"}
            </span>
          </div>

          <div className="p-4 rounded border border-crease bg-manila/40 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center border-b border-crease/60 pb-2">
              <span className="text-foreground-muted uppercase tracking-wider text-[11px]">
                {isEs ? "Folio de Bóveda:" : "Vault Docket:"}
              </span>
              <span className="font-mono font-bold text-ink">
                {capsule?.docketNumber || "TE-GENERADO"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-crease/60 pb-2">
              <span className="text-foreground-muted uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Calendar size={12} className="text-ink" />
                <span>{isEs ? "Fecha de Apertura:" : "Release Date:"}</span>
              </span>
              <span className="font-bold text-ink">{scheduledFormatted}</span>
            </div>

            <div className="flex justify-between items-center border-b border-crease/60 pb-2">
              <span className="text-foreground-muted uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Mail size={12} className="text-ink" />
                <span>
                  {isEs ? "Destinatario Notificado:" : "Recipient Notified:"}
                </span>
              </span>
              <span className="font-mono text-ink text-[11px]">
                {capsule?.email || "yo.del.futuro@personal.me"}
              </span>
            </div>

            {capsule && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-foreground-muted uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Clock size={12} className="text-wax" />
                  <span>{isEs ? "Tiempo Restante:" : "Remaining Time:"}</span>
                </span>
                <CountdownBadge
                  targetDate={capsule.scheduledAt}
                  size="sm"
                  variant="pill"
                />
              </div>
            )}
          </div>

          <div className="p-3.5 rounded border border-crease bg-crease/20 flex items-center gap-2.5 text-[11px] text-foreground-muted text-left">
            <ShieldCheck size={16} className="text-fulfilled shrink-0" />
            <p className="leading-relaxed">
              {isEs
                ? "El archivo ha sido cifrado en reposo. Ninguna persona ajena a ti podrá inspeccionar el pliego epistolar."
                : "The letter is encrypted at rest. No external entity will be able to inspect your words."}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-wax bg-wax text-on-wax hover:bg-wax-hover text-xs font-bold uppercase tracking-wider shadow-xs transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax"
            >
              <Archive size={14} />
              <span>{isEs ? "Ir a la Bóveda" : "Go to Vault"}</span>
            </Link>

            {letterId && (
              <Link
                href={`/letters/${letterId}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-crease bg-parchment hover:bg-manila text-ink text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax"
              >
                <Eye size={14} />
                <span>{isEs ? "Inspeccionar Carta" : "Inspect Letter"}</span>
              </Link>
            )}

            <Link
              href="/letters/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-crease bg-parchment hover:bg-manila text-foreground-muted hover:text-ink text-xs uppercase tracking-wider transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax"
            >
              <PenTool size={14} />
              <span>{isEs ? "Redactar Otra" : "Draft Another"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LetterSuccessPage() {
  const { locale } = useTimeEcho();
  const isEs = locale === "es";

  return (
    <div className="paper-texture min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto p-12 text-center font-letter text-xs text-foreground-muted">
            <div className="inline-block w-6 h-6 border-2 border-wax border-t-transparent rounded-full animate-spin mb-3" />
            <p>
              {isEs
                ? "Generando recibo de bóveda..."
                : "Generating vault receipt..."}
            </p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
