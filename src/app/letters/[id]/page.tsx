"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
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
import { cn } from "@/lib/utils";

interface LetterPageProps {
  params: Promise<{ id: string }>;
}

function getPredictionQuestion(category: string, isEs: boolean): string {
  switch (category) {
    case "city":
      return isEs ? "¿Dónde vives hoy en día?" : "Where do you live today?";
    case "career":
      return isEs ? "¿En qué trabajas hoy en día?" : "What do you do today?";
    case "salary":
      return isEs
        ? "¿Cuánto ganas hoy al mes?"
        : "How much do you earn per month?";
    case "relationship":
      return isEs
        ? "¿Cómo está tu relación sentimental hoy?"
        : "How is your relationship today?";
    case "achievement":
      return isEs
        ? "¿Cuál terminó siendo tu mayor logro?"
        : "What was your greatest achievement?";
    default:
      return isEs
        ? `¿Qué ocurrió con: ${category}?`
        : `What happened with: ${category}?`;
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
  } = useTimeEcho();

  const isEs = locale === "es";

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
  const [revealHappiness, setRevealHappiness] = useState(7);
  const [revealAnxiety, setRevealAnxiety] = useState(3);
  const [revealMotivation, setRevealMotivation] = useState(8);

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
        {isEs
          ? "Accediendo al expediente postal..."
          : "Accessing postal docket..."}
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

  const formattedCreated = new Date(letter.createdAt).toLocaleDateString(
    isEs ? "es-ES" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  );

  const formattedScheduled = new Date(letter.scheduledAt).toLocaleDateString(
    isEs ? "es-ES" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  );

  const handleRealitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8E2818", "#2C485E", "#D8D2C2", "#FAF9F5"],
      });
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
        reality: ans.reality || (isEs ? "Confirmado" : "Confirmed"),
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

  if (letter.status === "archived") {
    return (
      <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
        <div className="max-w-xl mx-auto py-8">
          <div className="paper-sheet rounded-xs p-8 sm:p-12 text-center space-y-7 border border-crease">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-foreground-muted border border-crease bg-manila select-none">
              <Archive size={32} />
            </div>

            <div className="space-y-2">
              <span className="postmark-stamp text-[10px] py-0.5 px-2.5 text-[#2C485E]">
                {isEs ? "Expediente Archivado" : "Archived Docket"}
              </span>
              <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
                {letter.title}
              </h1>
              <p className="text-xs font-letter text-foreground-muted max-w-sm mx-auto leading-relaxed">
                {isEs
                  ? "Esta carta se encuentra archivada en la bóveda postal. Puedes restaurarla para reintegrarla o eliminarla permanentemente."
                  : "This letter is archived in the postal vault. You can restore it to your vault or permanently delete it."}
              </p>
            </div>

            <div className="pt-4 border-t border-crease flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[38px] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>{isEs ? "Volver a mis cartas" : "Back to Vault"}</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  const updated = await restoreCapsule(letter.id);
                  setLocalLetter(updated);
                }}
                className="border border-crease text-foreground hover:bg-manila hover:text-ink rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[38px] transition-colors cursor-pointer bg-transparent"
              >
                <RotateCcw size={14} />
                <span>{isEs ? "Restaurar" : "Restore"}</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const confirmMsg = isEs
                    ? "¿Estás seguro de que deseas eliminar permanentemente esta carta? Esta acción no se puede deshacer."
                    : "Are you sure you want to permanently delete this letter? This action cannot be undone.";
                  if (window.confirm(confirmMsg)) {
                    await deleteCapsule(letter.id);
                    router.push("/dashboard");
                  }
                }}
                className="border border-crease text-foreground-muted hover:text-wax hover:border-wax/40 hover:bg-wax/5 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[38px] transition-colors cursor-pointer bg-transparent"
              >
                <Trash2 size={14} />
                <span>{isEs ? "Eliminar" : "Delete"}</span>
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
            <div className="wax-seal w-24 h-24 rounded-full mx-auto flex items-center justify-center text-parchment select-none">
              <Lock size={36} />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
                {isEs ? "Esta cápsula está sellada" : "This capsule is sealed"}
              </h1>
              <p className="text-xs font-letter text-foreground-muted max-w-sm mx-auto leading-relaxed">
                {isEs
                  ? `Este mensaje fue sellado por ${letter.email} y actualmente está viajando a través del tiempo.`
                  : `This message was sealed by ${letter.email} and is currently voyaging across time.`}
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block font-letter">
                {isEs ? "Tiempo restante" : "Time remaining"}
              </span>
              <div className="postmark-stamp text-2xl font-letter py-2.5 px-6">
                {isEs ? `Faltan ${daysLeft} días` : `${daysLeft} days left`}
              </div>
              <p className="text-xs font-letter text-foreground-muted">
                {isEs ? "Se entregará el" : "Will be delivered on"}{" "}
                {formattedScheduled}
              </p>
            </div>

            <div className="pt-4 border-t border-crease flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-5 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[38px] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>{isEs ? "Volver a mis cartas" : "Back to Vault"}</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await archiveCapsule(letter.id);
                  router.push("/dashboard");
                }}
                className="border border-crease text-foreground-muted hover:text-ink hover:border-ink/40 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[38px] transition-colors cursor-pointer bg-transparent"
              >
                <Archive size={14} />
                <span>{isEs ? "Archivar carta" : "Archive Letter"}</span>
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
                  {isEs ? "Cápsula Desbloqueada" : "Capsule Unlocked"}
                </span>
                <h2 className="font-serif-editorial text-2xl font-semibold text-foreground leading-snug">
                  {isEs
                    ? "Tu carta del pasado te está esperando."
                    : "Your letter from the past awaits."}
                </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {isEs
                    ? "Antes de leerla, cuéntanos qué pasó realmente. Esto nos permitirá calcular el score de predicciones y shifts emocionales."
                    : "Before reading it, tell us what actually unfolded. This enables the calculation of your reality score and emotional shift."}
                </p>
              </div>

              <div className="my-6 relative select-none flex items-center justify-center h-32">
                <div className="wax-seal w-20 h-20 rounded-full flex items-center justify-center text-parchment animate-seal-left">
                  <Unlock size={28} />
                </div>
              </div>

              <div className="archival-folder rounded-xs p-4 text-xs font-letter text-foreground/80 space-y-1 text-left border border-[#D5CEBD]">
                <p className="font-semibold uppercase tracking-wider text-[10px] text-foreground">
                  {isEs ? "Consejo de reflexión:" : "Reflection tip:"}
                </p>
                <p className="leading-relaxed">
                  {isEs
                    ? "Sé honesto contigo mismo. No hay respuestas correctas o incorrectas. Esta experiencia es 100% tuya y te ayuda a ver lo mucho que has crecido."
                    : "Be honest with yourself. There are no right or wrong answers. This reflection is entirely yours."}
                </p>
              </div>
            </div>

            {/* Middle Column: Fact Matching / Predictions Reality Questions */}
            <div className="lg:col-span-5 archival-folder rounded-xs p-6 sm:p-8 space-y-6 border border-[#D5CEBD]">
              <div className="border-b border-[#D5CEBD] pb-3">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {isEs ? "COTEJO DE HECHOS" : "FACT MATCHING"}
                </span>
                <h3 className="font-serif-editorial text-xl font-semibold text-foreground mt-0.5">
                  {isEs
                    ? "Cuéntanos tu realidad actual"
                    : "Tell Us Your Present Reality"}
                </h3>
                <p className="text-xs font-letter text-foreground-muted mt-1">
                  {isEs
                    ? "Responde estas preguntas para comparar tu pasado con tu yo actual."
                    : "Answer these questions to contrast your past mindset with your present reality."}
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
                          <span>
                            {getPredictionQuestion(pred.category, isEs)}
                          </span>
                        </label>

                        <div className="text-xs text-foreground-muted italic font-letter bg-manila/40 px-3 py-1.5 rounded-xs border border-crease/50">
                          {isEs
                            ? "Tu predicción del pasado:"
                            : "Past prediction:"}{" "}
                          &ldquo;{pred.prediction}&rdquo;
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
                            placeholder={
                              isEs
                                ? "Describe tu realidad ahora..."
                                : "Describe your reality now..."
                            }
                            required
                            className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                          />

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                              {isEs
                                ? "¿Se cumplió tu predicción?"
                                : "Did this prediction come true?"}
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
                                  "w-full text-center py-2 px-3 rounded-xs border text-xs font-semibold font-letter inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
                                  currentAnswer.matched
                                    ? "bg-[#2C485E] text-[#FAF9F5] border-[#2C485E]"
                                    : "border-crease bg-manila/30 text-foreground-muted",
                                )}
                              >
                                <Check size={13} />
                                <span>
                                  {isEs ? "Sí, lo logré" : "Yes, I did it"}
                                </span>
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
                                  "w-full text-center py-2 px-3 rounded-xs border text-xs font-semibold font-letter inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
                                  !currentAnswer.matched
                                    ? "bg-[#8E2818] text-[#FAF9F5] border-[#8E2818]"
                                    : "border-crease bg-manila/30 text-foreground-muted",
                                )}
                              >
                                <X size={13} />
                                <span>
                                  {isEs ? "No exactamente" : "Not exactly"}
                                </span>
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
              <div className="archival-folder rounded-xs p-6 space-y-5 border border-[#D5CEBD]">
                <div className="border-b border-[#D5CEBD] pb-3">
                  <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                    {isEs ? "ESTADO ACTUAL" : "CURRENT STATE"}
                  </span>
                  <h3 className="font-serif-editorial text-lg font-semibold text-foreground mt-0.5">
                    {isEs ? "Estado emocional hoy" : "Emotional baseline today"}
                  </h3>
                  <p className="text-xs font-letter text-foreground-muted mt-1">
                    {isEs
                      ? "¿Cómo te sientes en este momento?"
                      : "How do you feel right now?"}
                  </p>
                </div>

                <div className="space-y-4 font-letter text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{isEs ? "Felicidad" : "Happiness"}</span>
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
                      className="w-full accent-[#8E2818] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{isEs ? "Ansiedad" : "Anxiety"}</span>
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
                      className="w-full accent-[#8E2818] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{isEs ? "Motivación" : "Motivation"}</span>
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
                      className="w-full accent-[#8E2818] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-3.5 px-6 text-xs font-semibold tracking-widest uppercase border-none cursor-pointer min-h-[46px] shadow-xs font-letter inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Unlock size={16} />
                <span>
                  {isEs ? "Guardar y ver mi carta" : "Save & View My Letter"}
                </span>
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

  return (
    <div className="max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Letter Manuscript + Predictions vs Reality Ledger */}
        <div className="lg:col-span-8 space-y-6">
          <div className="paper-sheet rounded-xs p-6 sm:p-10 space-y-6 border border-crease">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-crease pb-4 text-xs font-letter">
              <div>
                <p className="uppercase tracking-wider font-semibold text-[10px] text-foreground-muted">
                  {isEs ? "Escrito" : "Written"}
                </p>
                <p className="font-semibold text-foreground text-xs">
                  {formattedCreated}
                </p>
              </div>
              <div className="text-center">
                <span className="postmark-stamp text-[10px] py-0.5 px-2.5">
                  {isEs ? "Carta del pasado" : "Letter from Past"}
                </span>
              </div>
              <div className="sm:text-right">
                <p className="uppercase tracking-wider font-semibold text-[10px] text-foreground-muted">
                  {isEs ? "Entregado" : "Delivered"}
                </p>
                <p className="font-semibold text-foreground text-xs">
                  {formattedScheduled}
                </p>
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
                <span>{isEs ? "Volver a mis cartas" : "Back to Vault"}</span>
              </Link>
            </div>
          </div>

          {predictions.length > 0 && (
            <div className="archival-folder rounded-xs p-6 sm:p-8 space-y-5 border border-[#D5CEBD]">
              <div className="border-b border-[#D5CEBD] pb-3">
                <h2 className="font-serif-editorial text-xl font-semibold text-foreground">
                  {isEs ? "Predicciones vs Realidad" : "Predictions vs Reality"}
                </h2>
                <p className="text-xs font-letter text-foreground-muted mt-1">
                  {isEs
                    ? "Compara lo que imaginabas hace un tiempo con la vida que estás viviendo hoy."
                    : "Compare what you once envisioned with the life you are actively living today."}
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
                        {getPredictionQuestion(pred.category, isEs)}
                      </span>
                      <span
                        className={cn(
                          "py-0.5 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-xs inline-flex items-center gap-1",
                          pred.matched
                            ? "bg-emerald-800/10 text-emerald-800"
                            : "bg-red-800/10 text-wax",
                        )}
                      >
                        {pred.matched ? <Check size={12} /> : <X size={12} />}
                        <span>
                          {pred.matched
                            ? isEs
                              ? "¡LO LOGRASTE!"
                              : "ACCOMPLISHED"
                            : isEs
                              ? "NO EXACTAMENTE"
                              : "DIVERGED"}
                        </span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-crease font-letter text-xs">
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Predicción del pasado:" : "Past Prediction:"}
                        </span>
                        <p className="text-foreground/80 leading-relaxed italic">
                          &ldquo;{pred.prediction}&rdquo;
                        </p>
                      </div>

                      <div className="p-4 space-y-1 bg-manila/10">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Realidad hoy en día:" : "Reality Today:"}
                        </span>
                        <p className="text-foreground/90 leading-relaxed font-semibold">
                          &ldquo;
                          {pred.reality || (isEs ? "Cumplida" : "Fulfilled")}
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
                {isEs
                  ? "Tu Score de Predicciones"
                  : "Prediction Accuracy Score"}
              </h3>
            </div>

            {predictions.length > 0 ? (
              <>
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
                  <div
                    className="radial-progress text-[#2C485E] font-letter text-2xl font-bold"
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
                    {isEs
                      ? `Acertaste ${matchedCount} de ${totalCount} predicciones (${accuracyPct}%).`
                      : `You matched ${matchedCount} of ${totalCount} predictions (${accuracyPct}%).`}
                  </p>
                  <p className="text-foreground-muted leading-relaxed max-w-xs mx-auto">
                    {accuracyPct >= 70
                      ? isEs
                        ? "¡Tu brújula del futuro está sumamente afilada! Excelente intuición."
                        : "Your future compass is sharp! Remarkable intuition."
                      : accuracyPct >= 40
                        ? isEs
                          ? "Vas por un gran camino. Muchas cosas cambiaron, pero tu rumbo sigue claro."
                          : "You are on a good path. Circumstances shifted, but your compass remains steadfast."
                        : isEs
                          ? "¡La vida te sorprendió con giros inesperados! Y eso hace el camino más interesante."
                          : "Life gifted you unexpected twists and growth!"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs font-letter text-foreground-muted py-3">
                {isEs
                  ? "No registraste predicciones para esta carta."
                  : "No predictions registered for this capsule."}
              </p>
            )}
          </div>

          {/* Emotional Evolution Breakdown */}
          <div className="archival-folder rounded-xs p-6 space-y-5 border border-[#D5CEBD]">
            <div className="border-b border-[#D5CEBD] pb-2.5">
              <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
                {isEs ? "Evolución emocional" : "Emotional Evolution"}
              </h3>
              <p className="text-[10px] font-letter text-foreground-muted uppercase tracking-wider mt-0.5">
                {isEs
                  ? "Cambio en tu bienestar interno"
                  : "Shift in your internal wellbeing"}
              </p>
            </div>

            <div className="space-y-4 font-letter text-xs">
              <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {isEs ? "Felicidad" : "Happiness"}
                  </span>
                  {hapShift > 0 ? (
                    <span className="text-[10px] font-semibold text-[#2C485E]">
                      +{hapShift} {isEs ? "Crecimiento" : "Growth"}
                    </span>
                  ) : hapShift < 0 ? (
                    <span className="text-[10px] font-semibold text-[#8E2818]">
                      {hapShift} {isEs ? "Descenso" : "Decline"}
                    </span>
                  ) : (
                    <span className="text-[10px] text-foreground-muted">
                      {isEs ? "Estable" : "Steady"}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-foreground-muted">
                  <span>
                    {isEs ? "Pasado:" : "Past:"}{" "}
                    <strong>{pastHappiness}</strong>
                  </span>
                  <span>&rarr;</span>
                  <span>
                    {isEs ? "Hoy:" : "Today:"} <strong>{currHappiness}</strong>
                  </span>
                </div>
              </div>

              <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {isEs ? "Ansiedad" : "Anxiety"}
                  </span>
                  {anxShift < 0 ? (
                    <span className="text-[10px] font-semibold text-[#2C485E]">
                      {anxShift} {isEs ? "Más Calma" : "Calmer"}
                    </span>
                  ) : anxShift > 0 ? (
                    <span className="text-[10px] font-semibold text-[#8E2818]">
                      +{anxShift} {isEs ? "Estrés" : "Stress"}
                    </span>
                  ) : (
                    <span className="text-[10px] text-foreground-muted">
                      {isEs ? "Estable" : "Steady"}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-foreground-muted">
                  <span>
                    {isEs ? "Pasado:" : "Past:"} <strong>{pastAnxiety}</strong>
                  </span>
                  <span>&rarr;</span>
                  <span>
                    {isEs ? "Hoy:" : "Today:"} <strong>{currAnxiety}</strong>
                  </span>
                </div>
              </div>

              <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {isEs ? "Motivación" : "Motivation"}
                  </span>
                  {motShift > 0 ? (
                    <span className="text-[10px] font-semibold text-amber-700">
                      +{motShift} {isEs ? "Inspirado" : "Inspired"}
                    </span>
                  ) : motShift < 0 ? (
                    <span className="text-[10px] font-semibold text-[#8E2818]">
                      {motShift} {isEs ? "Descenso" : "Decline"}
                    </span>
                  ) : (
                    <span className="text-[10px] text-foreground-muted">
                      {isEs ? "Estable" : "Steady"}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-foreground-muted">
                  <span>
                    {isEs ? "Pasado:" : "Past:"}{" "}
                    <strong>{pastMotivation}</strong>
                  </span>
                  <span>&rarr;</span>
                  <span>
                    {isEs ? "Hoy:" : "Today:"} <strong>{currMotivation}</strong>
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
