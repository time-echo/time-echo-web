"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { celebrate } from "@/lib/confetti";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Letter, Prediction } from "@/types/timeecho";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Archive,
  RotateCcw,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { Stamp, DEFAULT_STAMP_ID } from "@/components/stamps";

interface LetterPageProps {
  params: Promise<{ id: string }>;
}

function getPredictionQuestion(
  category: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  switch (category) {
    case "city":
      return t("reality.questions.city");
    case "career":
      return t("reality.questions.career");
    case "salary":
      return t("reality.questions.salary");
    case "relationship":
      return t("reality.questions.relationship");
    case "achievement":
      return t("reality.questions.achievement");
    default:
      return t("reality.questions.defaultQuestion", { category });
  }
}

export default function LetterDetailPage({ params }: LetterPageProps) {
  const { id } = use(params);

  const router = useRouter();
  const {
    getCapsuleById,
    repository,
    updateReality,
    archiveCapsule,
    restoreCapsule,
    deleteCapsule,
    locale,
    t,
  } = useTimeEcho();

  const contextLetter = getCapsuleById(id);
  const [localLetter, setLocalLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!contextLetter);
  const [currentTime] = useState(() => Date.now());

  const [realityAnswers, setRealityAnswers] = useState<
    Record<string, { reality: string; matched: boolean }>
  >(() => {
    const initial: Record<string, { reality: string; matched: boolean }> = {};
    contextLetter?.predictions?.forEach((p, idx) => {
      initial[p.id || String(idx)] = {
        reality: p.reality || "",
        matched: p.matched ?? true,
      };
    });
    return initial;
  });
  const [revealHappiness, setRevealHappiness] = useState(5);
  const [revealAnxiety, setRevealAnxiety] = useState(5);
  const [revealMotivation, setRevealMotivation] = useState(5);

  useEffect(() => {
    let isMounted = true;
    if (!contextLetter) {
      repository.getById(id).then((item) => {
        if (isMounted && item) {
          setLocalLetter(item);
          if (item.predictions) {
            const initial: Record<
              string,
              { reality: string; matched: boolean }
            > = {};
            item.predictions.forEach((p, idx) => {
              initial[p.id || String(idx)] = {
                reality: p.reality || "",
                matched: p.matched ?? true,
              };
            });
            setRealityAnswers(initial);
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id, contextLetter, repository]);

  const letter = localLetter || contextLetter;

  if (isLoading || !letter) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center font-letter text-xs text-foreground-muted animate-pulse">
        {t("reveal.loadingDocket")}
      </div>
    );
  }

  const isLocked = letter.status === "pending";
  const isDeliveredNotRevealed =
    (letter.status === "delivered" || letter.status === "opened") &&
    letter.revealHappiness == null &&
    !letter.isWaxBroken;

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(letter.scheduledAt).getTime() - currentTime) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const formattedCreated = formatLocaleDate(letter.createdAt, locale);

  const formattedScheduled = formatLocaleDate(letter.scheduledAt, locale);

  const handleRealitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      celebrate("reality-submitted");
    } catch {
      // Confetti fallback
    }

    const verifiedPredictions = (letter.predictions || []).map((p, idx) => {
      const ans = realityAnswers[p.id || String(idx)] || {
        reality: "",
        matched: true,
      };
      return {
        id: p.id || String(idx),
        reality: ans.reality || t("reveal.confirmed"),
        matched: ans.matched,
      };
    });

    const updated = await updateReality({
      id: letter.id,
      revealHappiness,
      revealAnxiety,
      revealMotivation,
      predictions: verifiedPredictions,
      isWaxBroken: true,
    });

    setLocalLetter(updated);
  };

  if (letter.status === "archived" && !letter.isWaxBroken && !letter.openedAt) {
    return (
      <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
        <div className="max-w-xl mx-auto py-8">
          <div className="paper-sheet rounded-xs p-8 sm:p-12 text-center space-y-7 border border-crease">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-foreground-muted border border-crease bg-manila select-none">
              <Archive size={32} />
            </div>

            <div className="space-y-2">
              <span className="postmark-stamp text-[10px] py-0.5 px-2.5 text-ink">
                {t("reveal.archivedDocket")}
              </span>
              <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
                {letter.title}
              </h1>
              <p className="text-xs font-letter text-foreground-muted max-w-sm mx-auto leading-relaxed">
                {t("reveal.archivedDocketDesc")}
              </p>
            </div>

            <div className="pt-4 border-t border-crease flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[44px] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>{t("reveal.backToVault")}</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  const updated = await restoreCapsule(letter.id);
                  setLocalLetter(updated);
                }}
                className="border border-crease text-foreground hover:bg-manila hover:text-ink rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[44px] transition-colors cursor-pointer bg-transparent"
              >
                <RotateCcw size={14} />
                <span>{t("reveal.restore")}</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const confirmMsg = t("reveal.deleteConfirm");
                  if (window.confirm(confirmMsg)) {
                    await deleteCapsule(letter.id);
                    router.push("/dashboard");
                  }
                }}
                className="border border-crease text-foreground-muted hover:text-wax hover:border-wax/40 hover:bg-wax/5 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[44px] transition-colors cursor-pointer bg-transparent"
              >
                <Trash2 size={14} />
                <span>{t("reveal.delete")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 1: Locked Capsule in Transit
  if (isLocked) {
    return (
      <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
        <div className="max-w-xl mx-auto py-8">
          <div className="paper-sheet rounded-xs p-8 sm:p-12 text-center space-y-7 border border-crease">
            <div className="flex items-center justify-center gap-6 select-none my-2">
              <div className="wax-seal w-24 h-24 rounded-full flex items-center justify-center text-on-wax shadow-md">
                <Lock size={36} />
              </div>
              <div className="relative">
                <Stamp
                  id={letter.stampId || DEFAULT_STAMP_ID}
                  size="lg"
                  hasPostmark
                  postmarkVariant="combo"
                  postmarkDate={formattedScheduled}
                  rotation={3.5}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
                {t("reveal.lockedTitle")}
              </h1>
              <p className="text-xs font-letter text-foreground-muted max-w-sm mx-auto leading-relaxed">
                {t("reveal.lockedDesc", { email: letter.email })}
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
                {t("reveal.remainingTime")}
              </span>
              <div className="postmark-stamp text-2xl font-letter py-2.5 px-6">
                {t("reveal.daysRemaining", { days: daysLeft })}
              </div>
              <p className="text-xs font-letter text-foreground-muted">
                {t("reveal.willBeDeliveredOn", { date: formattedScheduled })}
              </p>
            </div>

            <div className="pt-4 border-t border-crease flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[44px] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>{t("reveal.backToVault")}</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await archiveCapsule(letter.id);
                  router.push("/dashboard");
                }}
                className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[44px] transition-colors cursor-pointer bg-transparent"
              >
                <Archive size={14} />
                <span>{t("reveal.archiveLetter")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Delivered but Pending Reality Comparison
  if (isDeliveredNotRevealed) {
    return (
      <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
        <form onSubmit={handleRealitySubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Unlocked Notification Card */}
            <div className="lg:col-span-4 paper-sheet rounded-xs p-6 sm:p-8 text-center space-y-6 border border-crease">
              <div className="space-y-2">
                <span className="postmark-stamp text-[10px] py-0.5 px-2.5">
                  {t("reveal.capsuleUnlockedTitle")}
                </span>
                <h2 className="font-serif-editorial text-2xl font-semibold text-foreground leading-snug">
                  {t("reveal.unlockedAwaits")}
                </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {t("reveal.unlockedAwaitsDesc")}
                </p>
              </div>

              <div className="my-6 relative select-none flex items-center justify-center gap-6 h-32">
                <div className="wax-seal w-20 h-20 rounded-full flex items-center justify-center text-on-wax animate-seal-left">
                  <Unlock size={28} />
                </div>
                <div className="relative">
                  <Stamp
                    id={letter.stampId || DEFAULT_STAMP_ID}
                    size="md"
                    hasPostmark
                    postmarkVariant="combo"
                    postmarkDate={formattedScheduled}
                    rotation={3}
                  />
                </div>
              </div>

              <div className="archival-folder rounded-xs p-4 text-xs font-letter text-foreground/80 space-y-1 text-left border border-manila-border">
                <p className="font-semibold uppercase tracking-wider text-[10px] text-foreground">
                  {t("reveal.reflectionTipTitle")}
                </p>
                <p className="leading-relaxed">
                  {t("reveal.reflectionTipDesc")}
                </p>
              </div>
            </div>

            {/* Middle Column: Fact Matching / Predictions Reality Questions */}
            <div className="lg:col-span-5 archival-folder rounded-xs p-6 sm:p-8 space-y-6 border border-manila-border">
              <div className="border-b border-manila-border pb-3">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {t("reveal.factMatching")}
                </span>
                <h3 className="font-serif-editorial text-xl font-semibold text-foreground mt-0.5">
                  {t("reveal.presentRealityTitle")}
                </h3>
                <p className="text-xs font-letter text-foreground-muted mt-1">
                  {t("reveal.presentRealityDesc")}
                </p>
              </div>

              <div className="space-y-4">
                {(letter.predictions || []).map(
                  (pred: Prediction, idx: number) => {
                    const key = pred.id || String(idx);
                    const currentAnswer = realityAnswers[key] || {
                      reality: "",
                      matched: true,
                    };

                    return (
                      <div
                        key={key}
                        className="paper-sheet rounded-xs p-4 space-y-3 border border-crease"
                      >
                        <label className="text-xs font-semibold text-foreground flex items-center gap-2 font-letter">
                          <span>{getPredictionQuestion(pred.category, t)}</span>
                        </label>

                        <div className="text-xs text-foreground-muted italic font-letter bg-manila/40 px-3 py-1.5 rounded-xs border border-crease/50">
                          {t("reveal.pastPredictionLabel")} &ldquo;
                          {pred.prediction}&rdquo;
                        </div>

                        <div className="space-y-2.5 font-letter text-xs">
                          <input
                            type="text"
                            value={currentAnswer.reality}
                            onChange={(e) =>
                              setRealityAnswers({
                                ...realityAnswers,
                                [key]: {
                                  ...currentAnswer,
                                  reality: e.target.value,
                                },
                              })
                            }
                            placeholder={t("reveal.describeRealityPlaceholder")}
                            required
                            className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                          />

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                              {t("reveal.didPredictionComeTrue")}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setRealityAnswers({
                                    ...realityAnswers,
                                    [key]: { ...currentAnswer, matched: true },
                                  })
                                }
                                className={cn(
                                  "w-full text-center py-2 px-3 rounded-xs border text-xs font-semibold font-letter inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                                  currentAnswer.matched
                                    ? "bg-ink text-on-wax border-ink shadow-2xs"
                                    : "border-crease bg-manila/30 text-foreground-muted hover:bg-manila/50",
                                )}
                              >
                                <Check size={13} />
                                <span>{t("reveal.yesDidIt")}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setRealityAnswers({
                                    ...realityAnswers,
                                    [key]: { ...currentAnswer, matched: false },
                                  })
                                }
                                className={cn(
                                  "w-full text-center py-2 px-3 rounded-xs border text-xs font-semibold font-letter inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                                  !currentAnswer.matched
                                    ? "bg-wax text-on-wax border-wax shadow-2xs"
                                    : "border-crease bg-manila/30 text-foreground-muted hover:bg-manila/50",
                                )}
                              >
                                <X size={13} />
                                <span>{t("reveal.notExactly")}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Right Column: Present Emotional Baseline & Submit */}
            <div className="lg:col-span-3 space-y-6">
              <div className="archival-folder rounded-xs p-6 space-y-5 border border-manila-border">
                <div className="border-b border-manila-border pb-3">
                  <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                    {t("reveal.currentState")}
                  </span>
                  <h3 className="font-serif-editorial text-lg font-semibold text-foreground mt-0.5">
                    {t("reveal.emotionalBaselineToday")}
                  </h3>
                  <p className="text-xs font-letter text-foreground-muted mt-1">
                    {t("reveal.howFeelRightNow")}
                  </p>
                </div>

                <div className="space-y-4 font-letter text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{t("common.happiness")}</span>
                      <span className="text-foreground-muted">
                        {revealHappiness} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={revealHappiness}
                      onChange={(e) =>
                        setRevealHappiness(Number(e.target.value))
                      }
                      aria-label={t("common.happiness")}
                      className="w-full accent-wax cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{t("common.anxiety")}</span>
                      <span className="text-foreground-muted">
                        {revealAnxiety} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={revealAnxiety}
                      onChange={(e) => setRevealAnxiety(Number(e.target.value))}
                      aria-label={t("common.anxiety")}
                      className="w-full accent-wax cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{t("common.motivation")}</span>
                      <span className="text-foreground-muted">
                        {revealMotivation} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={revealMotivation}
                      onChange={(e) =>
                        setRevealMotivation(Number(e.target.value))
                      }
                      aria-label={t("common.motivation")}
                      className="w-full accent-wax cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-wax hover:bg-wax-hover text-on-wax rounded-xs py-3.5 px-6 text-xs font-semibold tracking-widest uppercase border-none cursor-pointer min-h-[46px] shadow-xs font-letter inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Unlock size={16} />
                <span>{t("reveal.saveAndViewLetter")}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Case 3: Fully Revealed Manuscript with Twin-Column Ledger
  const predictions: Prediction[] = letter.predictions || [];
  const matchedCount = predictions.filter((p: Prediction) => p.matched).length;
  const totalCount = predictions.length;
  const accuracyPct =
    totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 100;

  const pastHappiness = letter.emotionalSnapshot?.happinessLevel ?? 6;
  const currHappiness = letter.revealHappiness ?? 7;
  const hapShift = currHappiness - pastHappiness;

  const pastAnxiety = letter.emotionalSnapshot?.anxietyLevel ?? 4;
  const currAnxiety = letter.revealAnxiety ?? 3;
  const anxShift = currAnxiety - pastAnxiety;

  const pastMotivation = letter.emotionalSnapshot?.motivationLevel ?? 7;
  const currMotivation = letter.revealMotivation ?? 8;
  const motShift = currMotivation - pastMotivation;
  const isArchived = letter.status === "archived";

  return (
    <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      {isArchived && (
        <div className="paper-sheet rounded-xs p-4 sm:p-5 border border-crease mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-letter">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-foreground-muted border border-crease bg-manila shrink-0">
              <Archive size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="postmark-stamp text-[9px] py-0.5 px-2 text-ink">
                  {t("reveal.archivedDocket")}
                </span>
                <span className="font-semibold text-xs text-foreground">
                  {letter.docketNumber}
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted mt-0.5">
                {t("reveal.archivedDocketDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={async () => {
                const updated = await restoreCapsule(letter.id);
                setLocalLetter(updated);
              }}
              className="border border-crease text-foreground hover:bg-manila hover:text-ink rounded-xs px-3.5 py-2 text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent"
            >
              <RotateCcw size={13} />
              <span>{t("reveal.restore")}</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                const confirmMsg = t("reveal.deleteConfirm");
                if (window.confirm(confirmMsg)) {
                  await deleteCapsule(letter.id);
                  router.push("/dashboard");
                }
              }}
              className="border border-crease text-foreground-muted hover:text-wax hover:border-wax/40 hover:bg-wax/5 rounded-xs px-3.5 py-2 text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent"
            >
              <Trash2 size={13} />
              <span>{t("reveal.delete")}</span>
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="paper-sheet rounded-xs p-6 sm:p-10 space-y-6 border border-crease">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-crease pb-4 text-xs font-letter">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div>
                    <p className="uppercase tracking-wider font-semibold text-[10px] text-foreground-muted">
                      {t("reveal.written")}
                    </p>
                    <p className="font-semibold text-foreground text-xs">
                      {formattedCreated}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider font-semibold text-[10px] text-foreground-muted">
                      {t("reveal.delivered")}
                    </p>
                    <p className="font-semibold text-foreground text-xs">
                      {formattedScheduled}
                    </p>
                  </div>
                </div>

                <span className="postmark-stamp text-[10px] py-0.5 px-2.5 inline-block">
                  {t("reveal.letterFromPast")}
                </span>
              </div>

              <div className="shrink-0">
                <Stamp
                  id={letter.stampId || DEFAULT_STAMP_ID}
                  size="md"
                  hasPostmark
                  postmarkVariant="combo"
                  postmarkDate={formattedScheduled}
                  rotation={-2}
                />
              </div>
            </div>

            <article className="p-5 sm:p-6 border border-crease rounded-xs bg-transparent text-foreground/90 min-h-[300px] whitespace-pre-wrap break-words select-text font-letter text-sm leading-loose shadow-inner">
              {letter.content}
            </article>

            <div className="pt-4 border-t border-crease flex justify-between items-center text-xs font-letter">
              <Link
                href="/dashboard"
                className="hover:text-foreground text-foreground-muted transition-colors flex items-center gap-1.5 font-semibold uppercase tracking-wider"
              >
                <ArrowLeft size={14} />
                <span>{t("reveal.backToVault")}</span>
              </Link>
            </div>
          </div>

          {predictions.length > 0 && (
            <div className="archival-folder rounded-xs p-6 sm:p-8 space-y-5 border border-manila-border">
              <div className="border-b border-manila-border pb-3">
                <h2 className="font-serif-editorial text-xl font-semibold text-foreground">
                  {t("reveal.predictionsVsReality")}
                </h2>
                <p className="text-xs font-letter text-foreground-muted mt-1">
                  {t("reveal.predictionsVsRealityDesc")}
                </p>
              </div>

              <div className="space-y-4">
                {predictions.map((pred: Prediction, idx: number) => (
                  <div
                    key={pred.id || String(idx)}
                    className="paper-sheet rounded-xs overflow-hidden border border-crease"
                  >
                    <div className="bg-manila/40 px-4 py-2.5 flex justify-between items-center border-b border-crease font-letter">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        {getPredictionQuestion(pred.category, t)}
                      </span>
                      <span
                        className={cn(
                          "py-0.5 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-xs inline-flex items-center gap-1",
                          pred.matched
                            ? "bg-fulfilled-bg text-fulfilled border border-fulfilled-border"
                            : "bg-wax/10 text-wax border border-wax/20",
                        )}
                      >
                        {pred.matched ? <Check size={12} /> : <X size={12} />}
                        <span>
                          {pred.matched
                            ? t("reveal.accomplished")
                            : t("reveal.diverged")}
                        </span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-crease font-letter text-xs">
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {t("reveal.pastPrediction")}
                        </span>
                        <p className="text-foreground/80 leading-relaxed italic">
                          &ldquo;{pred.prediction}&rdquo;
                        </p>
                      </div>

                      <div className="p-4 space-y-1 bg-manila/10">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {t("reveal.realityToday")}
                        </span>
                        <p className="text-foreground/90 leading-relaxed font-semibold">
                          &ldquo;
                          {pred.reality || t("reveal.fulfilled")}
                          &rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Score Dial & Emotional Evolution */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prediction Score Card */}
          <div className="paper-sheet rounded-xs p-6 space-y-4 text-center border border-crease">
            <div className="border-b border-crease pb-2.5">
              <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
                {t("reveal.accuracyScore")}
              </h3>
            </div>

            {predictions.length > 0 ? (
              <>
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
                  <div
                    className="radial-progress text-ink font-letter text-2xl font-bold"
                    style={{
                      ["--value" as string]: accuracyPct,
                      ["--size" as string]: "8rem",
                      ["--thickness" as string]: "8px",
                    }}
                    role="progressbar"
                    aria-valuenow={accuracyPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {accuracyPct}%
                  </div>
                </div>

                <div className="space-y-1 text-xs font-letter">
                  <p className="font-semibold text-foreground">
                    {t("reveal.accuracySummary", {
                      matched: matchedCount,
                      total: totalCount,
                      percent: accuracyPct,
                    })}
                  </p>
                  <p className="text-foreground-muted leading-relaxed max-w-xs mx-auto">
                    {accuracyPct >= 70
                      ? t("reveal.accuracyHigh")
                      : accuracyPct >= 40
                        ? t("reveal.accuracyMedium")
                        : t("reveal.accuracyLow")}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs font-letter text-foreground-muted py-3">
                {t("reveal.noPredictions")}
              </p>
            )}
          </div>

          {/* Emotional Evolution Breakdown */}
          <div className="archival-folder rounded-xs p-6 space-y-5 border border-manila-border">
            <div className="border-b border-manila-border pb-2.5">
              <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
                {t("reveal.emotionalEvolution")}
              </h3>
              <p className="text-[10px] font-letter text-foreground-muted uppercase tracking-wider mt-0.5">
                {t("reveal.emotionalShiftDesc")}
              </p>
            </div>

            <div className="space-y-4 font-letter text-xs">
              <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {t("common.happiness")}
                  </span>
                  {hapShift > 0 ? (
                    <span className="text-[10px] font-semibold text-ink">
                      +{hapShift} {t("reveal.growth")}
                    </span>
                  ) : hapShift < 0 ? (
                    <span className="text-[10px] font-semibold text-wax">
                      {hapShift} {t("reveal.decline")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-foreground-muted">
                      {t("reveal.steady")}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-foreground-muted">
                  <span>
                    {t("reveal.past")} <strong>{pastHappiness}</strong>
                  </span>
                  <span>&rarr;</span>
                  <span>
                    {t("reveal.today")} <strong>{currHappiness}</strong>
                  </span>
                </div>
              </div>

              <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {t("common.anxiety")}
                  </span>
                  {anxShift < 0 ? (
                    <span className="text-[10px] font-semibold text-ink">
                      {anxShift} {t("reveal.calmer")}
                    </span>
                  ) : anxShift > 0 ? (
                    <span className="text-[10px] font-semibold text-wax">
                      +{anxShift} {t("reveal.stress")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-foreground-muted">
                      {t("reveal.steady")}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-foreground-muted">
                  <span>
                    {t("reveal.past")} <strong>{pastAnxiety}</strong>
                  </span>
                  <span>&rarr;</span>
                  <span>
                    {t("reveal.today")} <strong>{currAnxiety}</strong>
                  </span>
                </div>
              </div>

              <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {t("common.motivation")}
                  </span>
                  {motShift > 0 ? (
                    <span className="text-[10px] font-semibold text-ink">
                      +{motShift} {t("reveal.inspired")}
                    </span>
                  ) : motShift < 0 ? (
                    <span className="text-[10px] font-semibold text-wax">
                      {motShift} {t("reveal.decline")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-foreground-muted">
                      {t("reveal.steady")}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-foreground-muted">
                  <span>
                    {t("reveal.past")} <strong>{pastMotivation}</strong>
                  </span>
                  <span>&rarr;</span>
                  <span>
                    {t("reveal.today")} <strong>{currMotivation}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
