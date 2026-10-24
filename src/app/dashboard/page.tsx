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
  Trash2,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const isTimeline = searchParams.get("timeline") === "true";

  const { capsules, archiveCapsule, restoreCapsule, deleteCapsule, locale, t } =
    useTimeEcho();

  const [currentTime] = useState(() => Date.now());

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
    return formatLocaleDate(iso, locale);
  };

  if (isTimeline) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-4 font-ui animate-fade-in text-foreground">
        <div className="border-b border-crease pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
              {t("dashboard.timelineTitle")}
            </h1>
            <p className="text-xs font-letter text-foreground-muted tracking-wider">
              {t("dashboard.timelineDesc")}
            </p>
          </div>
          <div className="flex gap-3 shrink-0 items-center">
            <Link
              href="/dashboard"
              className="border border-crease text-foreground hover:bg-manila/60 hover:border-wax/50 rounded-xs text-xs font-medium uppercase tracking-wider px-4 min-h-[44px] font-letter inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax cursor-pointer"
            >
              <Mail size={15} />
              <span>{t("dashboard.myLetters")}</span>
            </Link>
            <Link
              href="/letters/new"
              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-5 min-h-[44px] text-xs font-medium border-none cursor-pointer tracking-wider uppercase font-letter inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
            >
              <Plus size={15} />
              <span>{t("dashboard.writeLetter")}</span>
            </Link>
          </div>
        </div>

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
                  <div
                    className={cn(
                      "absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-parchment shadow-xs",
                      isDelivered
                        ? hasRevealedReality
                          ? "bg-ink"
                          : "bg-amber-600"
                        : "bg-wax",
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
                                  ? t("dashboard.revealedCompared")
                                  : t("dashboard.pendingRevelation")}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Lock size={13} />
                              <span>{t("dashboard.sealedCapsule")}</span>
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="font-letter text-xs text-foreground-muted inline-flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>
                          {t("dashboard.createdOn")}{" "}
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
                          ? `${t("dashboard.deliveredOn")} ${formatDate(letter.scheduledAt)}`
                          : `${t("dashboard.willOpenOn")} ${formatDate(letter.scheduledAt)}`}
                      </p>
                    </div>

                    {isDelivered ? (
                      <>
                        <p className="font-letter text-sm text-foreground/85 leading-relaxed pl-4 border-l-2 border-ink/30 italic">
                          &ldquo;{letter.content}&rdquo;
                        </p>

                        <div className="archival-folder rounded-xs p-4 text-xs font-letter space-y-2 text-foreground/80">
                          {letter.emotionalSnapshot && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="font-semibold text-foreground uppercase text-xs tracking-wider">
                                {t("dashboard.emotionalEvolutionLabel")}
                              </span>
                              <span>
                                {t("dashboard.happinessLabel")}{" "}
                                <strong>
                                  {letter.emotionalSnapshot.happinessLevel}
                                </strong>
                              </span>
                              <span>
                                {t("dashboard.anxietyLabel")}{" "}
                                <strong>
                                  {letter.emotionalSnapshot.anxietyLevel}
                                </strong>
                              </span>
                            </div>
                          )}

                          {letter.predictions &&
                            letter.predictions.length > 0 && (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-manila-border pt-2">
                                <span className="font-semibold text-foreground uppercase text-xs tracking-wider">
                                  {t("dashboard.predictionsLabel")}
                                </span>
                                <span>
                                  {t("dashboard.sealedPredictionsCount", {
                                    count: letter.predictions.length,
                                  })}
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => archiveCapsule(letter.id)}
                            className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 hover:bg-manila/40 rounded-xs px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all cursor-pointer bg-transparent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                            title={t("dashboard.archiveLetter")}
                          >
                            <Archive size={14} />
                            <span>{t("dashboard.archive")}</span>
                          </button>

                          {hasRevealedReality ? (
                            <Link
                              href={`/letters/${letter.id}`}
                              className="border border-crease text-foreground hover:bg-manila/60 hover:border-wax/50 rounded-xs px-4 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                            >
                              <Eye size={14} />
                              <span>{t("dashboard.viewFullComparison")}</span>
                            </Link>
                          ) : (
                            <Link
                              href={`/letters/${letter.id}`}
                              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-5 py-2 text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center justify-center gap-2 min-h-[44px] shadow-xs hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                            >
                              <Unlock size={14} />
                              <span>{t("dashboard.completeComparison")}</span>
                            </Link>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="archival-folder rounded-xs p-4 text-xs font-letter flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-foreground/80">
                        <div className="space-y-1">
                          <p className="font-semibold uppercase tracking-wider text-xs text-foreground">
                            {t("dashboard.timeCapsuleSealed")}
                          </p>
                          <p className="text-foreground-muted">
                            {t("dashboard.timeCapsuleSealedDesc", {
                              days: daysLeft,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <Link
                            href={`/letters/${letter.id}`}
                            className="postmark-stamp text-[11px] px-3.5 min-h-[44px] inline-flex items-center justify-center font-letter hover:border-ink/60 hover:bg-manila/40 transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                          >
                            <span>
                              {t("dashboard.opensInDays", { days: daysLeft })}
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => archiveCapsule(letter.id)}
                            className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 hover:bg-manila/40 rounded-xs px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all cursor-pointer bg-transparent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                            title={t("dashboard.archiveLetter")}
                          >
                            <Archive size={14} />
                            <span>{t("dashboard.archive")}</span>
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
            <div className="text-ink flex justify-center">
              <Mail size={40} />
            </div>
            <h2 className="font-serif-editorial text-2xl font-semibold text-foreground">
              {t("dashboard.emptyTimelineTitle")}
            </h2>
            <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-sm mx-auto">
              {t("dashboard.emptyTimelineDesc")}
            </p>
            <Link
              href="/letters/new"
              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-6 min-h-[44px] text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
            >
              <Plus size={15} />
              <span>{t("dashboard.startWriting")}</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
        <div className="space-y-1">
          <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
            {t("dashboard.myLetters")}
          </h1>
          <p className="text-xs font-letter text-foreground-muted tracking-wider">
            {t("dashboard.lettersSubtitle")}
          </p>
        </div>
        <div className="flex gap-3 shrink-0 items-center">
          <Link
            href="/dashboard?timeline=true"
            className="border border-crease text-foreground hover:bg-manila/60 hover:border-wax/50 rounded-xs text-xs font-medium uppercase tracking-wider px-4 min-h-[44px] font-letter inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax cursor-pointer"
          >
            <Calendar size={15} />
            <span>{t("dashboard.viewTimeline")}</span>
          </Link>
          <Link
            href="/letters/new"
            className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-5 min-h-[44px] text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
          >
            <Plus size={15} />
            <span>{t("dashboard.writeLetter")}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="paper-sheet rounded-xs p-5 space-y-1 border border-crease">
          <span className="text-xs font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
            {t("dashboard.totalCapsules")}
          </span>
          <span className="font-serif-editorial text-3xl font-semibold text-foreground block">
            {capsules.length}
          </span>
          <span className="text-[11px] font-letter text-foreground-muted pt-1 block">
            {t("dashboard.messagesToFuture")}
          </span>
        </div>

        <div className="paper-sheet rounded-xs p-5 space-y-1 border border-crease">
          <span className="text-xs font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
            {t("dashboard.openedCountLabel")}
          </span>
          <span className="font-serif-editorial text-3xl font-semibold text-ink block">
            {deliveredCapsules.length}
          </span>
          <span className="text-[11px] font-letter text-foreground-muted pt-1 block">
            {t("dashboard.readyToCompare")}
          </span>
        </div>

        <div className="paper-sheet rounded-xs p-5 space-y-1 border border-crease">
          <span className="text-xs font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
            {t("dashboard.sealedInTime")}
          </span>
          <span className="font-serif-editorial text-3xl font-semibold text-wax block">
            {scheduledCapsules.length}
          </span>
          <span className="text-[11px] font-letter text-foreground-muted pt-1 block">
            {t("dashboard.inTransit")}
          </span>
        </div>
      </div>

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
                              ? t("dashboard.revealedCompared")
                              : t("dashboard.pendingRevelation")}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Lock size={13} />
                          <span>{t("dashboard.inTransitToFuture")}</span>
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-letter text-xs text-foreground-muted inline-flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>
                      {t("dashboard.createdOn")} {formatDate(letter.createdAt)}
                    </span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-serif-editorial text-2xl font-semibold text-foreground break-words min-w-0">
                    {letter.title}
                  </h2>
                  <p className="font-letter text-xs text-foreground-muted">
                    {isDelivered
                      ? `${t("dashboard.deliveredOn")} ${formatDate(letter.scheduledAt)}`
                      : `${t("dashboard.openingIn")} ${formatDate(letter.scheduledAt)}`}
                  </p>
                </div>

                {isDelivered ? (
                  <div className="space-y-4">
                    <p className="font-letter text-sm text-foreground/85 leading-relaxed pl-4 border-l-2 border-ink/30 line-clamp-3 italic">
                      &ldquo;{letter.content}&rdquo;
                    </p>

                    {letter.emotionalSnapshot && (
                      <div className="archival-folder rounded-xs p-4 text-xs font-letter space-y-2 text-foreground/80">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-semibold text-foreground uppercase text-xs tracking-wider">
                            {t("dashboard.emotionalSnapshotLabel")}
                          </span>
                          <span>
                            {t("dashboard.happinessLabel")}{" "}
                            <strong>
                              {letter.emotionalSnapshot.happinessLevel}
                            </strong>
                          </span>
                          <span>
                            {t("dashboard.anxietyLabel")}{" "}
                            <strong>
                              {letter.emotionalSnapshot.anxietyLevel}
                            </strong>
                          </span>
                          <span>
                            {t("dashboard.motivationLabel")}{" "}
                            <strong>
                              {letter.emotionalSnapshot.motivationLevel}
                            </strong>
                          </span>
                        </div>

                        {letter.predictions &&
                          letter.predictions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-manila-border pt-2">
                              <span className="font-semibold text-foreground uppercase text-xs tracking-wider">
                                {t("dashboard.predictionsLabel")}
                              </span>
                              <span>
                                {hasRevealedReality
                                  ? t("dashboard.sealedComparisonDone", {
                                      count: letter.predictions.length,
                                    })
                                  : t("dashboard.sealedComparisonPending", {
                                      count: letter.predictions.length,
                                    })}
                              </span>
                            </div>
                          )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => archiveCapsule(letter.id)}
                        className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 hover:bg-manila/40 rounded-xs px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all cursor-pointer bg-transparent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                        title={t("dashboard.archiveLetter")}
                      >
                        <Archive size={14} />
                        <span>{t("dashboard.archive")}</span>
                      </button>

                      {hasRevealedReality ? (
                        <Link
                          href={`/letters/${letter.id}`}
                          className="border border-crease text-foreground hover:bg-manila/60 hover:border-wax/50 rounded-xs px-5 min-h-[44px] text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                        >
                          <Eye size={14} />
                          <span>{t("dashboard.viewPredictionsVsReality")}</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/letters/${letter.id}`}
                          className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-5 min-h-[44px] text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                        >
                          <Unlock size={14} />
                          <span>{t("dashboard.completeRevelation")}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="archival-folder rounded-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-letter">
                    <div className="flex items-center gap-3">
                      <span className="text-wax">
                        <Lock size={18} />
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground uppercase tracking-wider text-xs">
                          {t("dashboard.timeCapsuleSealed")}
                        </p>
                        <p className="text-foreground-muted">
                          {t("dashboard.timeCapsuleSealedDesc", {
                            days: daysLeft,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Link
                        href={`/letters/${letter.id}`}
                        className="postmark-stamp text-[11px] px-3.5 min-h-[44px] inline-flex items-center justify-center font-letter hover:border-ink/60 hover:bg-manila/40 transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                      >
                        <span>
                          {t("dashboard.opensInDays", { days: daysLeft })}
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => archiveCapsule(letter.id)}
                        className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 hover:bg-manila/40 rounded-xs px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all cursor-pointer bg-transparent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                        title={t("dashboard.archiveLetter")}
                      >
                        <Archive size={14} />
                        <span>{t("dashboard.archive")}</span>
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
          <div className="text-ink flex justify-center">
            <Mail size={40} />
          </div>
          <h2 className="font-serif-editorial text-2xl font-semibold text-foreground">
            {t("dashboard.emptyVault")}
          </h2>
          <p className="text-xs font-letter text-foreground-muted leading-relaxed max-w-sm mx-auto">
            {t("dashboard.emptyVaultDesc")}
          </p>
          <Link
            href="/letters/new"
            className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-6 min-h-[44px] text-xs font-medium tracking-wider uppercase font-letter inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
          >
            <Plus size={15} />
            <span>{t("dashboard.writeFirstLetter")}</span>
          </Link>
        </div>
      )}

      {archivedCapsules.length > 0 && (
        <div className="mt-12 pt-8 border-t border-crease space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-ink">
                  <Archive size={18} />
                </span>
                <h2 className="font-serif-editorial text-2xl font-semibold text-foreground tracking-tight">
                  {t("dashboard.archivedLetters")}
                </h2>
              </div>
              <p className="text-xs font-letter text-foreground-muted tracking-wider">
                {t("dashboard.archivedSilentNotice")}
              </p>
            </div>
            <span className="postmark-stamp text-xs font-letter py-1 px-3 self-start sm:self-auto">
              {archivedCapsules.length} {t("dashboard.archivedCount")}
            </span>
          </div>

          <div className="space-y-3">
            {archivedCapsules.map((letter) => (
              <div
                key={letter.id}
                className="archival-folder rounded-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-letter border border-manila-border"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-letter text-xs text-foreground-muted font-semibold tracking-wider">
                      № TE-
                      {letter.docketNumber ||
                        letter.id.slice(0, 5).toUpperCase()}
                    </span>
                    <span className="postmark-stamp text-xs py-0.5 px-2 text-ink">
                      {t("dashboard.archivedSingle")}
                    </span>
                    <span className="text-foreground-muted text-[11px] inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {t("dashboard.createdOn")} {formatDate(letter.createdAt)}
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
                    className="border border-crease text-foreground hover:bg-manila/60 hover:text-ink hover:border-wax/40 rounded-xs px-4 py-2 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all cursor-pointer bg-transparent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                    title={t("dashboard.restoreLetter")}
                  >
                    <RotateCcw size={14} />
                    <span>{t("dashboard.restore")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmMsg = t("dashboard.deleteConfirm");
                      if (window.confirm(confirmMsg)) {
                        deleteCapsule(letter.id);
                      }
                    }}
                    className="border border-crease text-foreground-muted hover:text-wax hover:border-wax/50 hover:bg-wax/5 rounded-xs px-4 py-2 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center justify-center gap-1.5 min-h-[44px] transition-all cursor-pointer bg-transparent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wax"
                    title={t("dashboard.deleteLetter")}
                  >
                    <Trash2 size={14} />
                    <span>{t("dashboard.delete")}</span>
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
