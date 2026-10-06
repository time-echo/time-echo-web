"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PredictionCategory } from "@/types/timeecho";
import {
  Lock,
  Clock,
  Sparkles,
  ShieldCheck,
  Mail,
  FileText,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const { locale, createCapsule } = useTimeEcho();
  const isEs = locale === "es";

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const targetElement = document.getElementById(hash.slice(1));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToHash();
    const frameId = requestAnimationFrame(scrollToHash);
    const timeoutId = setTimeout(scrollToHash, 150);
    window.addEventListener("hashchange", scrollToHash);
    window.addEventListener("popstate", scrollToHash);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("popstate", scrollToHash);
    };
  }, []);

  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [selectedHorizonDays, setSelectedHorizonDays] = useState<number>(365);
  const [customDate, setCustomDate] = useState<string>("");
  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);

  const [predictionCity, setPredictionCity] = useState("");
  const [predictionCareer, setPredictionCareer] = useState("");
  const [predictionSalary, setPredictionSalary] = useState("");
  const [predictionRelationship, setPredictionRelationship] = useState("");
  const [predictionAchievement, setPredictionAchievement] = useState("");

  const [happiness, setHappiness] = useState(6);
  const [anxiety, setAnxiety] = useState(4);
  const [motivation, setMotivation] = useState(7);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minCustomDate] = useState(
    () => new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );

  const currentDateFormatted = formatLocaleDate(
    new Date().toISOString(),
    locale,
  );

  const handlePresetDate = (days: number) => {
    setSelectedHorizonDays(days);
    setShowCustomDate(false);
  };

  const handleToggleCustomDate = () => {
    setShowCustomDate(true);
    setSelectedHorizonDays(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const deliverDate = new Date();
    if (showCustomDate && customDate) {
      const parsed = new Date(customDate);
      if (!isNaN(parsed.getTime())) {
        deliverDate.setTime(parsed.getTime());
      } else {
        deliverDate.setDate(deliverDate.getDate() + 365);
      }
    } else {
      deliverDate.setDate(deliverDate.getDate() + (selectedHorizonDays || 365));
    }

    const predictionsList: Array<{
      category: PredictionCategory;
      prediction: string;
    }> = [
      { category: "city" as const, prediction: predictionCity },
      { category: "career" as const, prediction: predictionCareer },
      { category: "salary" as const, prediction: predictionSalary },
      { category: "relationship" as const, prediction: predictionRelationship },
      { category: "achievement" as const, prediction: predictionAchievement },
    ].filter((p) => p.prediction.trim().length > 0);

    try {
      const capsule = await createCapsule({
        title: isEs ? "Tu carta para el futuro" : "Your letter to the future",
        content,
        email,
        scheduledAt: deliverDate.toISOString(),
        emotionalSnapshot: {
          happinessLevel: happiness,
          anxietyLevel: anxiety,
          motivationLevel: motivation,
        },
        predictions: predictionsList,
      });

      router.push(`/letters/success?id=${encodeURIComponent(capsule.id)}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const isUnderMinChars = charCount < 80;

  return (
    <div className="space-y-24 max-w-6xl mx-auto -mt-4 font-ui animate-fade-in text-foreground">
      {/* ===================================================================
          HERO SECTION: 2-COLUMN GRID (Features + Live Letter Card)
          =================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
        {/* Left Column: Headlines & 3 Archival Feature Cards */}
        <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-24">
          <div className="space-y-4">
            <h1 className="font-serif-editorial text-4xl sm:text-6xl font-normal text-foreground leading-tight tracking-tight">
              {isEs ? (
                <>
                  Escribe hoy.
                  <br />
                  Descubre mañana.
                </>
              ) : (
                <>
                  Write today.
                  <br />
                  Discover tomorrow.
                </>
              )}
            </h1>

            <p className="font-letter text-xs sm:text-sm text-foreground-muted leading-relaxed max-w-xl">
              {isEs
                ? "Escribe una carta a tu yo del futuro, registra tu estado emocional y formula predicciones de vida. Une a quien eres hoy con la persona en la que te convertirás."
                : "Write a letter to your future self, calibrate your emotional baseline, and forecast your life milestones. Compare who you are today with who you will become."}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="paper-sheet rounded-xs p-4 border border-crease flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xs bg-wax/10 text-wax flex items-center justify-center shrink-0 border border-wax/20">
                <Lock size={16} />
              </div>
              <div className="space-y-0.5">
              <h2 className="text-xs font-letter font-semibold uppercase tracking-wider text-foreground">
                {isEs ? "100% Privado y Seguro" : "100% Private & Sealed"}
              </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {isEs
                    ? "Solo tú puedes leer tu carta. Permanece resguardada de forma segura en tu bóveda personal hasta la fecha que elijas."
                    : "Only you can read your letter. It remains securely locked in your personal vault until your delivery date."}
                </p>
              </div>
            </div>

            <div className="paper-sheet rounded-xs p-4 border border-crease flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xs bg-ink/10 text-ink flex items-center justify-center shrink-0 border border-ink/20">
                <Clock size={16} />
              </div>
              <div className="space-y-0.5">
              <h2 className="text-xs font-letter font-semibold uppercase tracking-wider text-foreground">
                {isEs ? "Entrega a Tiempo" : "Delivered on Schedule"}
              </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {isEs
                    ? "Llega directo a tu bandeja de entrada en la mañana exacta que elegiste, en tu horario local."
                    : "Arrives straight to your inbox on the exact morning you chose, in your local timezone."}
                </p>
              </div>
            </div>

            <div className="paper-sheet rounded-xs p-4 border border-crease flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xs bg-ink/10 text-ink flex items-center justify-center shrink-0 border border-ink/20">
                <Sparkles size={16} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-letter font-semibold uppercase tracking-wider text-foreground">
                  {isEs
                    ? "Predicciones vs. Realidad"
                    : "Predictions vs. Reality"}
                </h2>
                <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                  {isEs
                    ? "Compara lo que imaginabas con lo que realmente viviste y descubre cuánto has evolucionado."
                    : "Put your past expectations side-by-side with real life to see how much you’ve evolved."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Letter Composition Paper Sheet */}
        <div className="lg:col-span-7 paper-sheet rounded-xs p-6 sm:p-8 space-y-6 border border-crease">
          <div className="flex items-center justify-between border-b border-crease pb-4">
            <div>
              <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                {isEs
                  ? "PASO 01 / REDACCIÓN INICIAL"
                  : "STEP 01 / INITIAL DRAFT"}
              </span>
              <h2 className="font-serif-editorial text-2xl text-foreground font-semibold mt-0.5">
                {isEs
                  ? "Escribe tu carta a tu futuro"
                  : "Write your letter to your future"}
              </h2>
            </div>
            <span className="postmark-stamp text-[10px] py-0.5 px-2.5">
              {currentDateFormatted}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="landing-content"
                className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block"
              >
                {isEs ? "Tu carta" : "Your Letter"}
              </label>
              <textarea
                id="landing-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isEs ? "Querido yo del futuro..." : "Dear future self..."
                }
                rows={7}
                maxLength={2000}
                required
                aria-describedby="landing-content-counter"
                className="w-full p-4 sm:p-5 border border-crease rounded-xs font-letter text-sm leading-loose text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-all shadow-inner bg-transparent"
              />
              <div className="flex justify-between items-center text-[11px] font-letter text-foreground-muted pt-1">
                <span className="italic">
                  {isEs
                    ? "Solo tú podrás verla"
                    : "Only you will be able to see it"}
                </span>
                <span
                  id="landing-content-counter"
                  className={cn(isUnderMinChars && "text-wax")}
                >
                  {isUnderMinChars
                    ? isEs
                      ? `${charCount} / 80 mín (2000 máx)`
                      : `${charCount} / 80 min (2000 max)`
                    : `${charCount} / 2000`}
                </span>
              </div>
              {isUnderMinChars && (
                <p
                  className="text-[11px] font-letter text-wax pt-0.5"
                  aria-live="polite"
                >
                  {isEs
                    ? "Escribe al menos 80 caracteres para sellar tu carta."
                    : "Write at least 80 characters to seal your letter."}
                </p>
              )}
            </div>

            {/* Delivery Horizon Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block">
                {isEs
                  ? "¿Cuándo quieres recibirla?"
                  : "When do you want to receive it?"}
              </label>
              <div
                role="group"
                aria-label={
                  isEs
                    ? "Fecha de entrega"
                    : "Delivery date"
                }
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-letter"
              >
                <button
                  type="button"
                  onClick={() => handlePresetDate(180)}
                  aria-pressed={selectedHorizonDays === 180 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 180 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "6 meses" : "6 months"}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDate(365)}
                  aria-pressed={selectedHorizonDays === 365 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 365 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "1 año" : "1 year"}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDate(1095)}
                  aria-pressed={selectedHorizonDays === 1095 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 1095 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "3 años" : "3 years"}
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDate(1825)}
                  aria-pressed={selectedHorizonDays === 1825 && !showCustomDate}
                  className={cn(
                    "py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 1825 && !showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "5 años" : "5 years"}
                </button>
                <button
                  type="button"
                  onClick={handleToggleCustomDate}
                  aria-pressed={showCustomDate}
                  className={cn(
                    "col-span-2 sm:col-span-1 py-2 min-h-[44px] rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    showCustomDate
                      ? "border-wax bg-wax text-on-wax font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "Fecha personalizada" : "Custom date"}
                </button>
              </div>

              {showCustomDate && (
                <div className="animate-fade-in pt-1">
                  <div className="archival-folder rounded-xs p-3 border border-crease">
                    <label
                      htmlFor="landing-custom-date"
                      className="text-[10px] text-foreground-muted font-letter uppercase tracking-wider block mb-1 font-semibold"
                    >
                      {isEs
                        ? "Elige una fecha específica"
                        : "Choose a specific date"}
                    </label>
                    <input
                      id="landing-custom-date"
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={minCustomDate}
                      className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground focus:border-wax focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Annex I: Optional Predictions */}
            <div className="archival-folder rounded-xs p-4 sm:p-5 space-y-4 border border-manila-border">
              <div className="border-b border-manila-border pb-2">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {isEs ? "ANEXO I / PREDICCIONES" : "ANNEX I / PREDICTIONS"}
                </span>
                <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block mt-0.5">
                  {isEs
                    ? "Tus predicciones (opcional)"
                    : "Your predictions (optional)"}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-letter">
                <div className="space-y-1">
                  <label
                    htmlFor="pred-city"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">01.</span>
                    <span>
                      {isEs
                        ? "¿Dónde crees que vivirás?"
                        : "Where will you live?"}
                    </span>
                  </label>
                  <input
                    id="pred-city"
                    type="text"
                    value={predictionCity}
                    onChange={(e) => setPredictionCity(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-career"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">02.</span>
                    <span>
                      {isEs ? "¿A qué te dedicarás?" : "What work will you do?"}
                    </span>
                  </label>
                  <input
                    id="pred-career"
                    type="text"
                    value={predictionCareer}
                    onChange={(e) => setPredictionCareer(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-salary"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">03.</span>
                    <span>
                      {isEs
                        ? "¿Cuánto dinero ganarás?"
                        : "How much money will you earn?"}
                    </span>
                  </label>
                  <input
                    id="pred-salary"
                    type="text"
                    value={predictionSalary}
                    onChange={(e) => setPredictionSalary(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="pred-relationship"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">04.</span>
                    <span>
                      {isEs
                        ? "¿Cómo será tu relación sentimental?"
                        : "How will your relationship be?"}
                    </span>
                  </label>
                  <input
                    id="pred-relationship"
                    type="text"
                    value={predictionRelationship}
                    onChange={(e) => setPredictionRelationship(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label
                    htmlFor="pred-achievement"
                    className="text-[10px] font-semibold text-foreground-muted flex items-center gap-1"
                  >
                    <span className="opacity-60">05.</span>
                    <span>
                      {isEs
                        ? "¿Cuál será tu mayor logro?"
                        : "What will be your greatest achievement?"}
                    </span>
                  </label>
                  <input
                    id="pred-achievement"
                    type="text"
                    value={predictionAchievement}
                    onChange={(e) => setPredictionAchievement(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Annex II: Emotional Baseline Sliders */}
            <div className="archival-folder rounded-xs p-4 sm:p-5 space-y-3 border border-manila-border">
              <div className="border-b border-manila-border pb-1.5">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {isEs
                    ? "ANEXO II / ESTADO EMOCIONAL"
                    : "ANNEX II / EMOTIONAL BASELINE"}
                </span>
                <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block mt-0.5">
                  {isEs ? "¿Cómo te sientes hoy?" : "How do you feel today?"}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-letter">
                <div className="paper-sheet rounded-xs p-3 border border-crease space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-foreground">
                    <span>{isEs ? "Felicidad" : "Happiness"}</span>
                    <span className="text-foreground-muted">
                      {happiness} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={happiness}
                    onChange={(e) => setHappiness(Number(e.target.value))}
                    aria-label={isEs ? "Felicidad" : "Happiness"}
                    className="w-full accent-wax cursor-pointer"
                  />
                </div>

                <div className="paper-sheet rounded-xs p-3 border border-crease space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-foreground">
                    <span>{isEs ? "Ansiedad" : "Anxiety"}</span>
                    <span className="text-foreground-muted">
                      {anxiety} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={anxiety}
                    onChange={(e) => setAnxiety(Number(e.target.value))}
                    aria-label={isEs ? "Ansiedad" : "Anxiety"}
                    className="w-full accent-wax cursor-pointer"
                  />
                </div>

                <div className="paper-sheet rounded-xs p-3 border border-crease space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-foreground">
                    <span>{isEs ? "Motivación" : "Motivation"}</span>
                    <span className="text-foreground-muted">
                      {motivation} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={motivation}
                    onChange={(e) => setMotivation(Number(e.target.value))}
                    aria-label={isEs ? "Motivación" : "Motivation"}
                    className="w-full accent-wax cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Email Field and Submit Button */}
            <div className="space-y-2.5 pt-1">
              <label
                htmlFor="landing-email"
                className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block"
              >
                {isEs
                  ? "¿A dónde te enviamos tu carta?"
                  : "Where should we deliver your letter?"}
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="landing-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full paper-sheet rounded-xs px-3.5 py-2.5 text-xs font-letter text-foreground border border-crease placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isUnderMinChars}
                  className={cn(
                    "bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-6 py-3 text-xs font-semibold tracking-widest uppercase font-letter inline-flex items-center justify-center gap-2 border-none shadow-xs shrink-0 min-h-[44px] cursor-pointer transition-colors",
                    (isSubmitting || isUnderMinChars) &&
                      "opacity-60 cursor-not-allowed",
                  )}
                >
                  <span>
                    {isSubmitting
                      ? isEs
                        ? "Sellando..."
                        : "Sealing..."
                      : isEs
                        ? "Sellar y Enviar a mi Yo Futuro"
                        : "Seal & Send to Future Self"}
                  </span>
                  <Mail size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-letter text-foreground-muted pt-2 border-t border-crease">
              <ShieldCheck size={14} className="text-ink" />
              <span>
                {isEs
                  ? "Tu carta es 100% privada y segura."
                  : "Your letter is 100% private and encrypted."}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* ===================================================================
          SECTION 2: HOW IT LOOKS WHEN OPENED (INTERACTIVE DOSSIER PREVIEW)
          =================================================================== */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {isEs
              ? "Así se verá cuando abras tu carta"
              : "This is how it will look when you open your letter"}
          </h2>
          <p className="text-xs font-letter text-foreground-muted max-w-md mx-auto leading-relaxed">
            {isEs
              ? "Compara tus predicciones con tu realidad y reflexiona sobre tu evolución."
              : "Compare your past predictions with your reality and reflect on your personal evolution."}
          </p>
        </div>

        <div className="max-w-5xl mx-auto font-ui text-foreground space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="paper-sheet rounded-xs p-6 sm:p-8 space-y-6 border border-crease">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-crease pb-4 text-xs font-letter">
                  <div>
                    <p className="uppercase tracking-wider font-semibold text-[10px] text-foreground-muted">
                      {isEs ? "Escrito" : "Written"}
                    </p>
                    <p className="font-semibold text-foreground text-xs">
                      {isEs ? "15 sep 2022" : "Sep 15, 2022"}
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
                      {isEs ? "15 sep 2022" : "Sep 15, 2022"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif-editorial text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                      {isEs
                        ? "Cuaderno de bitácora: La primera chispa de la idea"
                        : "Logbook: The First Spark of the Idea"}
                    </h3>
                    <span className="font-letter text-[10px] font-semibold text-foreground-muted uppercase tracking-widest shrink-0">
                      TE-00108
                    </span>
                  </div>
                </div>

                <article className="p-5 sm:p-6 border border-crease rounded-xs bg-transparent text-foreground/90 whitespace-pre-wrap break-words select-text font-letter text-sm leading-loose shadow-inner">
                  {isEs
                    ? `Para el expediente histórico de TimeEcho:\n\nEste folio representa el momento germinal. Aquella noche donde anoté por primera vez en un papel manila: "¿Y si pudiéramos enviar cartas al futuro con lacre físico y verificación de realidad?".\n\nTodo parecía desmedido y complejo, pero decidí confiar en la belleza de la palabra escrita y el peso del tiempo.`
                    : `For the historical record of TimeEcho:\n\nThis sheet represents the seminal moment. That evening when I first jotted down on a manila folio: "What if we could send letters into the future with physical wax seals and reality verification?".\n\nEverything seemed daunting and complex, yet I chose to trust in the beauty of the written word and the weight of time.`}
                </article>

                <div className="pt-3 border-t border-crease flex flex-wrap justify-between items-center gap-2 text-xs font-letter">
                  <span className="text-[11px] text-foreground-muted italic">
                    {isEs
                      ? "Sellada bajo custodia postal con lacre carmesí"
                      : "Sealed in postal custody under crimson wax"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-ink">
                    yo.del.futuro@timeecho.internal
                  </span>
                </div>
              </div>

              <div className="archival-folder rounded-xs p-6 sm:p-8 space-y-5 border border-manila-border">
                <div className="border-b border-manila-border pb-3">
                  <h3 className="font-serif-editorial text-xl font-semibold text-foreground">
                    {isEs ? "Predicciones vs Realidad" : "Predictions vs Reality"}
                  </h3>
                  <p className="text-xs font-letter text-foreground-muted mt-1">
                    {isEs
                      ? "Compara lo que imaginabas hace un tiempo con la vida que estás viviendo hoy."
                      : "Compare what you once envisioned with the life you are actively living today."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="paper-sheet rounded-xs overflow-hidden border border-crease">
                    <div className="bg-manila/40 px-4 py-2.5 flex justify-between items-center border-b border-crease font-letter">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        {isEs ? "¿En qué trabajas hoy en día?" : "What do you do today?"}
                      </span>
                      <span className="py-0.5 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-xs inline-flex items-center gap-1 bg-fulfilled-bg text-fulfilled border border-fulfilled-border">
                        <Check size={12} />
                        <span>{isEs ? "¡LO LOGRASTE!" : "ACCOMPLISHED"}</span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-crease font-letter text-xs">
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Predicción del pasado:" : "Past Prediction:"}
                        </span>
                        <p className="text-foreground/80 leading-relaxed italic">
                          &ldquo;
                          {isEs
                            ? "Construir una arquitectura limpia basada en el patrón Adapter."
                            : "Build a clean architecture based on the Adapter pattern."}
                          &rdquo;
                        </p>
                      </div>

                      <div className="p-4 space-y-1 bg-manila/10">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Realidad hoy en día:" : "Reality Today:"}
                        </span>
                        <p className="text-foreground/90 leading-relaxed font-semibold">
                          &ldquo;
                          {isEs
                            ? "Completada e implementada en Next.js con soporte offline y tipado estricto."
                            : "Completed and implemented in Next.js with offline support and strict typing."}
                          &rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="paper-sheet rounded-xs overflow-hidden border border-crease">
                    <div className="bg-manila/40 px-4 py-2.5 flex justify-between items-center border-b border-crease font-letter">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        {isEs ? "¿Dónde vives hoy en día?" : "Where do you live today?"}
                      </span>
                      <span className="py-0.5 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-xs inline-flex items-center gap-1 bg-fulfilled-bg text-fulfilled border border-fulfilled-border">
                        <Check size={12} />
                        <span>{isEs ? "¡LO LOGRASTE!" : "ACCOMPLISHED"}</span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-crease font-letter text-xs">
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Predicción del pasado:" : "Past Prediction:"}
                        </span>
                        <p className="text-foreground/80 leading-relaxed italic">
                          &ldquo;
                          {isEs
                            ? "Mudarme a un estudio con balcón soleado para escribir."
                            : "Move to a studio with a sunny balcony to write."}
                          &rdquo;
                        </p>
                      </div>

                      <div className="p-4 space-y-1 bg-manila/10">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Realidad hoy en día:" : "Reality Today:"}
                        </span>
                        <p className="text-foreground/90 leading-relaxed font-semibold">
                          &ldquo;
                          {isEs
                            ? "Encontré un ático con terraza iluminada y vistas al parque."
                            : "Found a penthouse with a sunlit terrace and park views."}
                          &rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="paper-sheet rounded-xs overflow-hidden border border-crease">
                    <div className="bg-manila/40 px-4 py-2.5 flex justify-between items-center border-b border-crease font-letter">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        {isEs
                          ? "¿Cuál terminó siendo tu mayor logro?"
                          : "What was your greatest achievement?"}
                      </span>
                      <span className="py-0.5 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-xs inline-flex items-center gap-1 bg-wax/10 text-wax border border-wax/20">
                        <X size={12} />
                        <span>{isEs ? "NO EXACTAMENTE" : "DIVERGED"}</span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-crease font-letter text-xs">
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Predicción del pasado:" : "Past Prediction:"}
                        </span>
                        <p className="text-foreground/80 leading-relaxed italic">
                          &ldquo;
                          {isEs
                            ? "Publicar una novela epistolar en formato tradicional."
                            : "Publish an epistolary novel in traditional print format."}
                          &rdquo;
                        </p>
                      </div>

                      <div className="p-4 space-y-1 bg-manila/10">
                        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                          {isEs ? "Realidad hoy en día:" : "Reality Today:"}
                        </span>
                        <p className="text-foreground/90 leading-relaxed font-semibold">
                          &ldquo;
                          {isEs
                            ? "El proyecto evolucionó hacia TimeEcho en formato de cartas digitales selladas."
                            : "The project evolved into TimeEcho in the format of sealed digital letters."}
                          &rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="paper-sheet rounded-xs p-6 space-y-4 text-center border border-crease">
                <div className="border-b border-crease pb-2.5">
                  <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
                    {isEs
                      ? "Tu Score de Predicciones"
                      : "Prediction Accuracy Score"}
                  </h3>
                </div>

                <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
                  <div
                    className="radial-progress text-ink font-letter text-2xl font-bold"
                    style={{
                      ["--value" as string]: 67,
                      ["--size" as string]: "8rem",
                      ["--thickness" as string]: "8px",
                    }}
                    role="progressbar"
                    aria-valuenow={67}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    67%
                  </div>
                </div>

                <div className="space-y-1 text-xs font-letter">
                  <p className="font-semibold text-foreground">
                    {isEs
                      ? "Acertaste 2 de 3 predicciones (67%)."
                      : "You matched 2 of 3 predictions (67%)."}
                  </p>
                  <p className="text-foreground-muted leading-relaxed max-w-xs mx-auto">
                    {isEs
                      ? "Vas por un gran camino. Muchas cosas cambiaron, pero tu rumbo sigue claro."
                      : "You are on a good path. Circumstances shifted, but your compass remains steadfast."}
                  </p>
                </div>
              </div>

              <div className="archival-folder rounded-xs p-6 space-y-5 border border-manila-border">
                <div className="border-b border-manila-border pb-2.5">
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
                      <span className="text-[10px] font-semibold text-ink">
                        +3 {isEs ? "Crecimiento" : "Growth"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-foreground-muted">
                      <span>
                        {isEs ? "Pasado:" : "Past:"} <strong>6</strong>
                      </span>
                      <span>&rarr;</span>
                      <span>
                        {isEs ? "Hoy:" : "Today:"} <strong>9</strong>
                      </span>
                    </div>
                  </div>

                  <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">
                        {isEs ? "Ansiedad" : "Anxiety"}
                      </span>
                      <span className="text-[10px] font-semibold text-ink">
                        -4 {isEs ? "Más Calma" : "Calmer"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-foreground-muted">
                      <span>
                        {isEs ? "Pasado:" : "Past:"} <strong>7</strong>
                      </span>
                      <span>&rarr;</span>
                      <span>
                        {isEs ? "Hoy:" : "Today:"} <strong>3</strong>
                      </span>
                    </div>
                  </div>

                  <div className="paper-sheet p-3 rounded-xs border border-crease space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">
                        {isEs ? "Motivación" : "Motivation"}
                      </span>
                      <span className="text-[10px] font-semibold text-ink">
                        +1 {isEs ? "Inspirado" : "Inspired"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-foreground-muted">
                      <span>
                        {isEs ? "Pasado:" : "Past:"} <strong>7</strong>
                      </span>
                      <span>&rarr;</span>
                      <span>
                        {isEs ? "Hoy:" : "Today:"} <strong>8</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/letters/capsule-archived-2022"
                className="paper-sheet rounded-xs p-4 border border-crease hover:border-ink/50 flex items-center justify-between group transition-all text-xs font-letter"
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-ink shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground block group-hover:text-wax transition-colors">
                      {isEs
                        ? "Ver este folio en la bóveda"
                        : "View this folio in the vault"}
                    </span>
                    <span className="text-[10px] text-foreground-muted block">
                      TE-00108 · {isEs ? "Expediente histórico abierto" : "Opened historical docket"}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-foreground-muted group-hover:translate-x-1 group-hover:text-wax transition-all shrink-0"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 3: HOW IT WORKS (WAX SEALS 01, 02, 03)
          =================================================================== */}
      <section id="how-it-works" className="space-y-12 scroll-mt-24">
        <div className="text-center space-y-2">
          <div className="postmark-stamp text-[10px] py-0.5 px-2.5 mx-auto">
            {isEs ? "SIMPLE Y SIGNIFICATIVO" : "SIMPLE & MEANINGFUL"}
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-foreground font-semibold">
            {isEs ? "Cómo funciona" : "How It Works"}
          </h2>
          <p className="text-xs font-letter text-foreground-muted max-w-xs mx-auto leading-relaxed">
            {isEs
              ? "Un viaje simple hacia tu mejor yo."
              : "A simple journey toward your best self."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-3 text-center">
            <div className="wax-seal w-12 h-12 rounded-full mx-auto flex items-center justify-center text-on-wax font-letter font-bold text-sm select-none">
              01
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {isEs ? "1. Escribe y Predice" : "1. Write & Predict"}
              </h3>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {isEs
                  ? "Escribe con honestidad a tu futuro yo. Registra cómo te sientes hoy y haz predicciones sobre tu trabajo, relaciones y metas."
                  : "Write honestly to your future self. Record how you feel today and make predictions about your career, relationships, and life goals."}
              </p>
            </div>
          </div>

          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-3 text-center">
            <div className="wax-seal w-12 h-12 rounded-full mx-auto flex items-center justify-center text-on-wax font-letter font-bold text-sm select-none">
              02
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {isEs ? "2. Sella y Programa" : "2. Seal & Schedule"}
              </h3>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {isEs
                  ? "Elige cuándo quieres recibirla, desde 6 meses hasta 5 años. Tus palabras quedan completamente cifradas y resguardadas en tu bóveda privada hasta ese día."
                  : "Pick when you want it back—from 6 months to 5 years. Your words are securely encrypted and locked in your private vault until that exact day."}
              </p>
            </div>
          </div>

          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-3 text-center">
            <div className="wax-seal w-12 h-12 rounded-full mx-auto flex items-center justify-center text-on-wax font-letter font-bold text-sm select-none">
              03
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {isEs ? "3. Desbloquea y Compara" : "3. Unlock & Compare"}
              </h3>
              <p className="text-xs font-letter text-foreground-muted leading-relaxed">
                {isEs
                  ? "El día señalado, tu carta llega a tu correo. Reencuéntrate con quién eras, comprueba qué predicciones se cumplieron y descubre cuánto has crecido."
                  : "When the day arrives, your letter lands in your inbox. Rediscover who you were, see which predictions came true, and reflect on how much you’ve grown."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Archival Closing Tag */}
      <footer className="max-w-5xl mx-auto px-4 border-t border-crease pt-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xl font-serif-editorial text-foreground select-none font-semibold">
          <span>TimeEcho</span>
        </div>
        <p className="text-xs font-letter text-foreground-muted leading-relaxed">
          {isEs
            ? "Enviado con esperanza, recibido con nostalgia."
            : "Sent with hope, received with nostalgia."}
        </p>
      </footer>
    </div>
  );
}
