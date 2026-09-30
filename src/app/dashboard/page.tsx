"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  Calendar,
  Plus,
  Mail,
  Lock,
  Unlock,
  Archive,
  Eye,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const isTimeline = searchParams.get("timeline") === "true";

  const { capsules, archiveCapsule, restoreCapsule, locale } = useTimeEcho();

  const [currentTime] = useState(() => Date.now());
  const isEs = locale === "es";

  const activeCapsules = capsules.filter((c) => c.status !== "archived");
  const archivedCapsules = capsules.filter((c) => c.status === "archived");

  const deliveredCapsules = activeCapsules.filter(
    (c) => c.status === "delivered" || c.status === "opened",
  );
  const scheduledCapsules = activeCapsules.filter(
    (c) => c.status === "pending",
  );

  const getDaysLeft = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - currentTime;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(isEs ? "es-ES" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isTimeline) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-4 font-ui animate-fade-in text-foreground">
        {/* Timeline Header */}
        <div className="border-b border-crease pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
              {isEs ? "Línea de Tiempo" : "Timeline"}
            </h1>
            <p className="text-xs font-letter text-foreground-muted tracking-wider">
              {isEs
                ? "Tu historia de crecimiento personal a través del tiempo."
                : "Your journey of personal growth charted across time."}
            </p>
          </div>
          <div className="flex gap-3 shrink-0 items-center">
            <Link
              href="/dashboard"
              className="border border-crease text-foreground hover:bg-manila/50 rounded-xs text-xs font-medium uppercase tracking-wider px-4 min-h-[40px] font-letter inline-flex items-center gap-1.5 transition-colors"
            >
              <Mail size={15} />
              <span>{isEs ? "Mis cartas" : "My Letters"}</span>
            </Link>
            <Link
              href="/letters/new"
              className="bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-2 px-5 text-xs font-medium border-none cursor-pointer tracking-wider uppercase font-letter inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>{isEs ? "Escribir carta" : "Write Letter"}</span>
            </Link>
          </div>
        </div>

        {/* Timeline Stream */}
        {activeCapsules.length > 0 ? (
          <div className="relative border-l-2 border-crease pl-6 sm:pl-8 ml-3 sm:ml-5 space-y-8 select-none">
            {activeCapsules.map((letter) => {
              const daysLeft = getDaysLeft(letter.scheduledAt);
              const isDelivered =
                letter.status === "delivered" || letter.status === "opened";
              const hasRevealedReality =
                letter.status === "opened" || letter.isWaxBroken;

              return (
                <div key={letter.id} className="relative">
                  {/* Timeline Dot Node */}
                  <div
                    className={cn(
                      "absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-parchment shadow-xs",
                      isDelivered
                        ? hasRevealedReality
                          ? "bg-[#2C485E]"
                          : "bg-amber-600"
                        : "bg-[#8E2818]",
                    )}
                  />

                  <div className="paper-sheet rounded-xs p-5 sm:p-7 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-letter text-xs text-foreground-muted font-semibold tracking-wider">
                          № TE-
                          {letter.docketNumber ||
                            letter.id.slice(0, 5).toUpperCase()}
                        </span>
                        <span className="postmark-stamp text-[11px] py-0.5 px-2">
                          {isDelivered ? (
                            <span className="inline-flex items-center gap-1">
                              <Unlock size={13} />
                              <span>
                                {hasRevealedReality
                                  ? isEs
                                    ? "Revelada & Comparada"
                                    : "Revealed & Compared"
                                  : isEs
                                    ? "Pendiente por revelación"
                                    : "Pending Revelation"}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Lock size={13} />
                              <span>
                                {isEs ? "Cápsula Sellada" : "Sealed Capsule"}
                              </span>
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="font-letter text-xs text-foreground-muted inline-flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>
                          {isEs ? "Creado el:" : "Created on:"}{" "}
                          {formatDate(letter.createdAt)}
                        </span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="font-serif-editorial text-xl font-semibold text-foreground break-words min-w-0">
                        {letter.title}
                      </h2>
                      <p className="font-letter text-xs text-foreground-muted">
                        {isDelivered
                          ? `${isEs ? "Entregada el" : "Delivered on"} ${formatDate(letter.scheduledAt)}`
                          : `${isEs ? "Se abrirá el" : "Will open on"} ${formatDate(letter.scheduledAt)}`}
                      </p>
                    </div>

                    {isDelivered ? (
                      <>
                        <p className="font-letter text-sm text-foreground/85 leading-relaxed pl-4 border-l-2 border-[#2C485E]/30 italic">
                          &ldquo;{letter.content}&rdquo;
                        </p>

                        <div className="archival-folder rounded-xs p-4 text-xs font-letter space-y-2 text-foreground/80">
                          {letter.emotionalSnapshot && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="font-semibold text-foreground uppercase text-[10px] tracking-wider">
                                {isEs
                                  ? "Evolución emocional:"
                                  : "Emotional evolution:"}
                              </span>
                              <span>
                                {isEs ? "Felicidad:" : "Happiness:"}{" "}
                                <strong>
                                  {letter.emotionalSnapshot.happinessLevel}
                                </strong>
                              </span>
                              <span>
                                {isEs ? "Ansiedad:" : "Anxiety:"}{" "}
                                <strong>
                                  {letter.emotionalSnapshot.anxietyLevel}
                                </strong>
                              </span>
                            </div>
                          )}

                          {letter.predictions &&
                            letter.predictions.length > 0 && (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#D5CEBD] pt-2">
                                <span className="font-semibold text-foreground uppercase text-[10px] tracking-wider">
                                  {isEs ? "Predicciones:" : "Predictions:"}
                                </span>
                                <span>
                                  {letter.predictions.length}{" "}
                                  {isEs
                                    ? "predicciones selladas"
                                    : "sealed predictions"}
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-1">
                          <Link
                            href={`/letters/${letter.id}`}
                            className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-4 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[36px] transition-colors"
                          >
                            <Eye size={14} />
                            <span>
                              {hasRevealedReality
                                ? isEs
                                  ? "Ver comparación completa"
                                  : "View Full Comparison"
                                : isEs
                                  ? "Completar comparación"
                                  : "Complete Comparison"}
                            </span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="archival-folder rounded-xs p-4 text-xs font-letter flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-foreground/80">
                        <div className="space-y-1">
                          <p className="font-semibold uppercase tracking-wider text-[10px] text-foreground">
                            {isEs
                              ? "Cápsula del tiempo sellada"
                              : "Time capsule sealed"}
                          </p>
                          <p className="text-foreground-muted">
                            {isEs
                              ? `Esta carta viaja de forma privada y encriptada hacia el futuro. Quedan aproximadamente ${daysLeft} días.`
                              : `This letter voyages securely towards the future. Approximately ${daysLeft} days remaining.`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <Link
                            href={`/letters/${letter.id}`}
                            className="postmark-stamp text-[11px] py-1 px-3 hover:bg-manila/40 transition-colors"
                          >
                            <span>
                              {isEs
                                ? `Se abre en ${daysLeft} días`
                                : `Opens in ${daysLeft} days`}
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => archiveCapsule(letter.id)}
                            className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 rounded-xs px-2.5 py-1 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1 min-h-[32px] transition-colors cursor-pointer bg-transparent"
                            title={isEs ? "Archivar carta" : "Archive letter"}
                          >
                            <Archive size={13} />
                            <span>{isEs ? "Archivar" : "Archive"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="paper-sheet rounded-xs p-12 text-center max-w-lg mx-auto space-y-5">
            <div className="text-[#2C485E] flex justify-center">
              <Mail size={40} />
            </div>
            <h2 className="font-serif-editorial text-2xl font-semibold text-foreground">
              {isEs
                ? "Tu línea de tiempo está vacía"
                : "Your timeline is empty"}
            </h2>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-sm mx-auto">
              {isEs
                ? "Escribe tu primera carta al futuro para comenzar a graficar tu historia de crecimiento."
                : "Write your first letter to the future to begin charting your journey of growth."}
            </p>
            <Link
              href="/letters/new"
              className="bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-2 px-6 text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>{isEs ? "Comenzar a escribir" : "Start Writing"}</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Ledger Mode (Default)
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      {/* Top Ledger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
        <div className="space-y-1">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
            {isEs ? "Mis cartas" : "My Letters"}
          </h1>
          <p className="text-xs font-letter text-foreground-muted tracking-wider">
            {isEs
              ? "Administra tus cápsulas del tiempo digital, estados emocionales y predicciones."
              : "Manage your digital time capsules, emotional baselines, and predictions."}
          </p>
        </div>
        <div className="flex gap-3 shrink-0 items-center">
          <Link
            href="/dashboard?timeline=true"
            className="border border-crease text-foreground hover:bg-manila/50 rounded-xs text-xs font-medium uppercase tracking-wider px-4 min-h-[40px] font-letter inline-flex items-center gap-1.5 transition-colors"
          >
            <Calendar size={15} />
            <span>{isEs ? "Ver línea de tiempo" : "View Timeline"}</span>
          </Link>
          <Link
            href="/letters/new"
            className="bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-2.5 px-5 text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>{isEs ? "Escribir carta" : "Write Letter"}</span>
          </Link>
        </div>
      </div>

      {/* 3 Stat Metric Paper Sheets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="paper-sheet rounded-xs p-5 space-y-1 border border-crease">
          <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
            {isEs ? "Cápsulas totales" : "Total Capsules"}
          </span>
          <span className="font-serif-editorial text-3xl font-semibold text-foreground block">
            {capsules.length}
          </span>
          <span className="text-[11px] font-letter text-foreground-muted pt-1 block">
            {isEs ? "Mensajes al futuro" : "Messages to future"}
          </span>
        </div>

        <div className="paper-sheet rounded-xs p-5 space-y-1 border border-crease">
          <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
            {isEs ? "Abiertas" : "Delivered"}
          </span>
          <span className="font-serif-editorial text-3xl font-semibold text-[#2C485E] block">
            {deliveredCapsules.length}
          </span>
          <span className="text-[11px] font-letter text-foreground-muted pt-1 block">
            {isEs ? "Listas para comparar" : "Ready to compare"}
          </span>
        </div>

        <div className="paper-sheet rounded-xs p-5 space-y-1 border border-crease">
          <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
            {isEs ? "Selladas en el tiempo" : "Sealed in Time"}
          </span>
          <span className="font-serif-editorial text-3xl font-semibold text-[#8E2818] block">
            {scheduledCapsules.length}
          </span>
          <span className="text-[11px] font-letter text-foreground-muted pt-1 block">
            {isEs ? "En tránsito" : "In transit"}
          </span>
        </div>
      </div>

      {/* Active Capsules List */}
      {activeCapsules.length > 0 ? (
        <div className="space-y-5">
          {activeCapsules.map((letter) => {
            const daysLeft = getDaysLeft(letter.scheduledAt);
            const isDelivered =
              letter.status === "delivered" || letter.status === "opened";
            const hasRevealedReality =
              letter.status === "opened" || letter.isWaxBroken;

            return (
              <div
                key={letter.id}
                className="paper-sheet rounded-xs p-6 sm:p-7 space-y-4 border border-crease"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-letter text-xs text-foreground-muted font-semibold tracking-wider">
                      № TE-
                      {letter.docketNumber ||
                        letter.id.slice(0, 5).toUpperCase()}
                    </span>
                    <span className="postmark-stamp text-[11px] py-0.5 px-2">
                      {isDelivered ? (
                        <span className="inline-flex items-center gap-1">
                          <Unlock size={13} />
                          <span>
                            {hasRevealedReality
                              ? isEs
                                ? "Revelada & Comparada"
                                : "Revealed & Compared"
                              : isEs
                                ? "Pendiente por revelación"
                                : "Pending Revelation"}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Lock size={13} />
                          <span>
                            {isEs
                              ? "En tránsito al futuro"
                              : "In Transit to Future"}
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-letter text-xs text-foreground-muted inline-flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>
                      {isEs ? "Creado el:" : "Created on:"}{" "}
                      {formatDate(letter.createdAt)}
                    </span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-serif-editorial text-2xl font-semibold text-foreground break-words min-w-0">
                    {letter.title}
                  </h2>
                  <p className="font-letter text-xs text-foreground-muted">
                    {isDelivered
                      ? `${isEs ? "Entregada el" : "Delivered on"} ${formatDate(letter.scheduledAt)}`
                      : `${isEs ? "Abriéndose en" : "Opening in"} ${formatDate(letter.scheduledAt)}`}
                  </p>
                </div>

                {isDelivered ? (
                  <div className="space-y-4">
                    <p className="font-letter text-sm text-foreground/85 leading-relaxed pl-4 border-l-2 border-[#2C485E]/30 line-clamp-3 italic">
                      &ldquo;{letter.content}&rdquo;
                    </p>

                    {letter.emotionalSnapshot && (
                      <div className="archival-folder rounded-xs p-4 text-xs font-letter space-y-2 text-foreground/80">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-semibold text-foreground uppercase text-[10px] tracking-wider">
                            {isEs
                              ? "Instantánea Emocional:"
                              : "Emotional Snapshot:"}
                          </span>
                          <span>
                            {isEs ? "Felicidad:" : "Happiness:"}{" "}
                            <strong>
                              {letter.emotionalSnapshot.happinessLevel}
                            </strong>
                          </span>
                          <span>
                            {isEs ? "Ansiedad:" : "Anxiety:"}{" "}
                            <strong>
                              {letter.emotionalSnapshot.anxietyLevel}
                            </strong>
                          </span>
                          <span>
                            {isEs ? "Motivación:" : "Motivation:"}{" "}
                            <strong>
                              {letter.emotionalSnapshot.motivationLevel}
                            </strong>
                          </span>
                        </div>

                        {letter.predictions &&
                          letter.predictions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#D5CEBD] pt-2">
                              <span className="font-semibold text-foreground uppercase text-[10px] tracking-wider">
                                {isEs ? "Predicciones:" : "Predictions:"}
                              </span>
                              <span>
                                {letter.predictions.length}{" "}
                                {isEs
                                  ? hasRevealedReality
                                    ? "predicciones selladas. Comparación completada."
                                    : "predicciones selladas. Pendiente por comparar."
                                  : "sealed predictions."}
                              </span>
                            </div>
                          )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      {hasRevealedReality ? (
                        <Link
                          href={`/letters/${letter.id}`}
                          className="border border-crease text-foreground hover:bg-manila/50 rounded-xs py-2 px-5 text-xs font-medium tracking-wider uppercase min-h-[38px] font-letter inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Eye size={14} />
                          <span>
                            {isEs
                              ? "Ver predicciones vs realidad"
                              : "View Predictions vs Reality"}
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href={`/letters/${letter.id}`}
                          className="bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-2 px-5 text-xs font-medium tracking-wider uppercase min-h-[38px] font-letter inline-flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Unlock size={14} />
                          <span>
                            {isEs
                              ? "Completar revelación"
                              : "Complete Revelation"}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="archival-folder rounded-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-letter">
                    <div className="flex items-center gap-3">
                      <span className="text-[#8E2818]">
                        <Lock size={18} />
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                          {isEs
                            ? "Cápsula del tiempo sellada"
                            : "Time capsule sealed"}
                        </p>
                        <p className="text-foreground-muted">
                          {isEs
                            ? `Esta carta viaja de forma privada hacia el futuro. Quedan aproximadamente ${daysLeft} días.`
                            : `This letter voyages securely towards the future. Approximately ${daysLeft} days remaining.`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Link
                        href={`/letters/${letter.id}`}
                        className="postmark-stamp text-[11px] py-1 px-3 hover:bg-manila/40 transition-colors"
                      >
                        <span>
                          {isEs
                            ? `Se abre en ${daysLeft} días`
                            : `Opens in ${daysLeft} days`}
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => archiveCapsule(letter.id)}
                        className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 rounded-xs px-2.5 py-1 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1 min-h-[32px] transition-colors cursor-pointer bg-transparent"
                        title={isEs ? "Archivar carta" : "Archive letter"}
                      >
                        <Archive size={13} />
                        <span>{isEs ? "Archivar" : "Archive"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="paper-sheet rounded-xs p-12 text-center max-w-xl mx-auto space-y-5">
          <div className="text-[#2C485E] flex justify-center">
            <Mail size={40} />
          </div>
          <h2 className="font-serif-editorial text-2xl font-semibold text-foreground">
            {isEs ? "Tu baúl está vacío" : "Your vault is empty"}
          </h2>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-sm mx-auto">
            {isEs
              ? "No has escrito ninguna carta todavía. Las cartas al futuro te ayudan a reflexionar y comparar tus predicciones con la realidad."
              : "You have not written any letters yet. Letters to the future help you reflect and compare past predictions with reality."}
          </p>
          <Link
            href="/letters/new"
            className="bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-2.5 px-6 text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>
              {isEs ? "Escribir mi primera carta" : "Write First Letter"}
            </span>
          </Link>
        </div>
      )}

      {/* Archived Letters Section */}
      {archivedCapsules.length > 0 && (
        <div className="mt-12 pt-8 border-t border-crease space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#2C485E]">
                  <Archive size={18} />
                </span>
                <h2 className="font-serif-editorial text-2xl font-semibold text-foreground tracking-tight">
                  {isEs ? "Cartas Archivadas" : "Archived Letters"}
                </h2>
              </div>
              <p className="text-xs font-letter text-foreground-muted tracking-wider">
                {isEs
                  ? "Cartas que has archivado. No se enviarán a menos que las restaures."
                  : "Letters you have archived. They will remain silent unless restored."}
              </p>
            </div>
            <span className="postmark-stamp text-xs font-letter py-1 px-3 self-start sm:self-auto">
              {archivedCapsules.length} {isEs ? "Archivadas" : "Archived"}
            </span>
          </div>

          <div className="space-y-3">
            {archivedCapsules.map((letter) => (
              <div
                key={letter.id}
                className="archival-folder rounded-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-letter border border-[#D5CEBD]"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-letter text-xs text-foreground-muted font-semibold tracking-wider">
                      № TE-
                      {letter.docketNumber ||
                        letter.id.slice(0, 5).toUpperCase()}
                    </span>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 text-[#2C485E]">
                      {isEs ? "Archivada" : "Archived"}
                    </span>
                    <span className="text-foreground-muted text-[11px] inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {isEs ? "Creado el:" : "Created on:"}{" "}
                      {formatDate(letter.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-serif-editorial text-lg font-semibold text-foreground break-words min-w-0">
                    {letter.title}
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => restoreCapsule(letter.id)}
                    className="border border-crease text-foreground hover:bg-manila hover:text-ink rounded-xs px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[36px] transition-colors cursor-pointer bg-transparent"
                    title={isEs ? "Restaurar carta" : "Restore letter"}
                  >
                    <RotateCcw size={14} />
                    <span>{isEs ? "Restaurar" : "Restore"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
