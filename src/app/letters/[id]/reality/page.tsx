"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { celebrate } from "@/lib/confetti";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { formatLocaleDate } from "@/lib/utils";
import { Letter } from "@/types/timeecho";
import { RealityLedger } from "@/features/reality-ledger/components/RealityLedger";
import { ArchivalFolder } from "@/components/ui/ArchivalFolder";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import {
  Scale,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface RealityPageProps {
  params: Promise<{ id: string }>;
}

export default function LetterRealityPage({ params }: RealityPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const {
    getCapsuleById,
    repository,
    isLoading: isGlobalLoading,
    locale,
    t,
  } = useTimeEcho();

  // Check context first
  const contextLetter = getCapsuleById(id);

  const [localLetter, setLocalLetter] = useState<Letter | null>(null);
  const [isFetchingLocal, setIsFetchingLocal] = useState<boolean>(
    () => !contextLetter,
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSettled, setIsSettled] = useState<boolean>(false);

  useEffect(() => {
    if (contextLetter) return;

    let isCancelled = false;
    repository
      .getById(id)
      .then((item) => {
        if (!isCancelled) {
          setLocalLetter(item);
          setIsFetchingLocal(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setFetchError(
            err instanceof Error ? err.message : "Error al cargar la carta",
          );
          setIsFetchingLocal(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id, contextLetter, repository]);

  const letter = localLetter || contextLetter;

  // Handle settlement success callback
  const handleSettled = (updated: Letter) => {
    setLocalLetter(updated);
    setIsSettled(true);

    try {
      celebrate("reality-settled");
    } catch {
      // Confetti fallback for environments without canvas
    }
  };

  // 1. Loading State
  if ((isGlobalLoading && !letter) || (isFetchingLocal && !letter)) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-crease/60 rounded" />
        <div className="h-96 w-full bg-manila/50 rounded-md border border-crease/60" />
      </div>
    );
  }

  // 2. Not Found State
  if (!letter || fetchError) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="rounded-md border border-crease bg-manila p-6 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-wax/10 text-wax border border-wax/30 mx-auto flex items-center justify-center">
            <AlertCircle size={26} />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-wax font-bold">
              FOLIO № {id} {"//"} NO ENCONTRADO
            </span>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-ink">
              {t("reality.docketNotFound")}
            </h1>
            <p className="font-letter text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
              {t("reality.docketNotFoundDesc")}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-crease bg-parchment font-letter text-xs uppercase tracking-wider text-ink font-bold hover:border-ink transition-colors"
          >
            <ArrowLeft size={14} />
            <span>
              {t("reality.returnCentralLedger")}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Locked State: Cannot evaluate reality if letter is still sealed and in-transit
  const isLocked = letter.status === "pending" && !letter.isWaxBroken;
  if (isLocked) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="rounded-md border border-crease bg-manila p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="w-14 h-14 rounded-full bg-wax/10 text-wax border border-wax/30 mx-auto flex items-center justify-center">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-wax font-bold">
              ACCESO DENEGADO // BÓVEDA CERRADA
            </span>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-ink">
              {t("reality.notUnsealedYet")}
            </h1>
            <p className="font-letter text-xs sm:text-sm text-foreground-muted max-w-lg mx-auto leading-relaxed">
              {t("reality.notUnsealedYetDesc")}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => router.push(`/letters/${letter.id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-wax hover:bg-wax-hover text-on-wax font-letter text-xs uppercase tracking-wider font-bold shadow transition-all"
            >
              <ArrowLeft size={14} />
              <span>
                {t("reality.breakSealButton")}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const createdFormatted = formatLocaleDate(letter.createdAt, locale);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Navigation Breadcrumb Bar */}
      <nav
        aria-label="Navegación de expediente"
        className="flex items-center justify-between font-letter text-xs text-foreground-muted"
      >
        <Link
          href={`/letters/${letter.id}`}
          className="inline-flex items-center gap-1.5 hover:text-ink transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>{t("reality.backToLetterNav")}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 text-[11px] text-ink hover:text-wax transition-colors uppercase tracking-wider font-bold"
          >
            <BarChart3 size={13} />
            <span>{t("reality.globalAnalyticsNav")}</span>
          </Link>
        </div>
      </nav>

      {/* Manila Dossier Shell */}
      <ArchivalFolder
        tabLabel={`EXPEDIENTE DE REALIDAD // № ${letter.docketNumber}`}
        tabPosition="left"
        classification="ASIENTO RETROSPECTIVO // ARCHIVO CENTRAL"
        badgeSlot={
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-wax font-bold tracking-widest uppercase bg-wax/10 px-2.5 py-0.5 rounded border border-wax/20">
            <Scale size={11} />
            <span>CONTRASTE DE HECHOS</span>
          </div>
        }
      >
        <div className="space-y-8">
          {/* Header Introduction Banner */}
          <div className="relative border-b border-crease pb-6">
            <div className="absolute right-0 top-0 pointer-events-none opacity-80 hidden sm:block">
              <PostmarkStamp
                city="BOGOTÁ // CENTRAL"
                docketId={letter.docketNumber}
                date={createdFormatted}
                subtext={t("reality.realityRecord")}
                variant="circular"
                size="sm"
              />
            </div>

            <div className="space-y-2 max-w-xl">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-wax font-bold">
                AUDITORÍA DE EXPECTATIVAS // TIME-ECHO
              </span>
              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-ink">
                {letter.title}
              </h1>
              <p className="font-letter text-xs sm:text-sm text-foreground-muted leading-relaxed">
                {t("reality.subtitle")}
              </p>
            </div>
          </div>

          {isSettled && (
            <div className="rounded-md border border-fulfilled-border bg-fulfilled-bg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-letter text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-fulfilled text-parchment flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {t("reality.settledSuccessTitle")}
                  </h4>
                  <p className="text-foreground-muted text-[11px] mt-0.5">
                    {t("reality.settledSuccessDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/letters/${letter.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-crease bg-parchment hover:border-ink text-ink font-bold transition-colors"
                >
                  <FileText size={13} />
                  <span>{t("reality.viewLetterButton")}</span>
                </Link>

                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-wax hover:bg-wax-hover text-on-wax font-bold shadow transition-all"
                >
                  <Sparkles size={13} />
                  <span>{t("reality.viewAnalyticsButton")}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* The RealityLedger Component */}
          <RealityLedger capsule={letter} onSettled={handleSettled} />
        </div>
      </ArchivalFolder>
    </div>
  );
}
