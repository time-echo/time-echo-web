"use client";

import React, { useState } from "react";
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
  Calendar,
  BarChart3,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const { locale, createCapsule } = useTimeEcho();
  const isEs = locale === "es";

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

        <div className="paper-sheet rounded-xs border border-crease shadow-sm overflow-hidden max-w-5xl mx-auto font-ui relative">
          {/* Top Dossier Bar with 3 Dots */}
          <div className="bg-manila/50 px-5 py-3 border-b border-crease flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-wax inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-crease inline-block" />
            </div>
            <div className="font-letter text-[11px] text-foreground-muted tracking-wider">
              {isEs
                ? "CÁPSULA DESBLOQUEADA · TE-00412"
                : "UNLOCKED DOSSIER · TE-00412"}
            </div>
            <div className="w-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            {/* Left Dossier Aside */}
            <aside className="md:col-span-3 archival-folder border-r border-crease p-6 flex flex-col justify-between space-y-6 select-none">
              <div className="space-y-6">
                <span className="postmark-stamp text-[10px] py-0.5 px-2">
                  TimeEcho
                </span>

                <nav className="space-y-1 text-xs font-letter">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xs paper-sheet border border-crease font-semibold text-foreground">
                    <FileText size={15} />
                    <span>{isEs ? "Mis Cartas" : "My Letters"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 text-foreground-muted">
                    <Calendar size={15} />
                    <span>{isEs ? "Línea de Tiempo" : "Timeline"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 text-foreground-muted">
                    <BarChart3 size={15} />
                    <span>{isEs ? "Estadísticas" : "Analytics"}</span>
                  </div>
                </nav>
              </div>

              <div className="border-t border-manila-border pt-4">
                <p className="text-[11px] font-letter italic text-foreground-muted leading-relaxed">
                  {isEs
                    ? "«La mejor manera de predecir el futuro es crearlo.»"
                    : "“The best way to predict the future is to create it.”"}
                </p>
              </div>
            </aside>

            {/* Right Dossier Area: Predictions vs Reality & Emotional Chart */}
            <div className="md:col-span-9 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-transparent">
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-crease pb-2.5 flex items-center justify-between">
                  <h3 className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                    {isEs ? "Predicción vs Realidad" : "Prediction vs Reality"}
                  </h3>
                  <span className="postmark-stamp text-[10px] py-0.5 px-2">
                    {isEs ? "Revelada & Comparada" : "Revealed & Compared"}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-letter">
                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {isEs ? "Predicción:" : "Prediction:"}
                        </span>
                        <span className="italic text-foreground/80">
                          {isEs ? "Viviré en Barcelona" : "Living in Barcelona"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {isEs ? "Realidad:" : "Reality:"}
                        </span>
                        <span>
                          {isEs ? "Vivo en Medellín" : "Living in Medellín"}
                        </span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {isEs ? "PARCIALMENTE" : "PARTIALLY"}
                    </span>
                  </div>

                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {isEs ? "Predicción:" : "Prediction:"}
                        </span>
                        <span className="italic text-foreground/80">
                          {isEs
                            ? "Seré diseñadora freelance"
                            : "Freelance designer"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {isEs ? "Realidad:" : "Reality:"}
                        </span>
                        <span>Product Designer</span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {isEs ? "¡LO LOGRASTE!" : "YOU DID IT!"}
                    </span>
                  </div>

                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {isEs ? "Predicción:" : "Prediction:"}
                        </span>
                        <span className="italic text-foreground/80">
                          {isEs ? "Ganaré $5.000.000 COP" : "Earn $5,000 / mo"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {isEs ? "Realidad:" : "Reality:"}
                        </span>
                        <span>
                          {isEs ? "Gano $7.200.000 COP" : "Earning $7,200 / mo"}
                        </span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {isEs ? "¡SUPERASTE!" : "EXCEEDED!"}
                    </span>
                  </div>

                  <div className="paper-sheet border border-crease p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <span className="uppercase text-[9px] font-semibold tracking-wider">
                          {isEs ? "Predicción:" : "Prediction:"}
                        </span>
                        <span className="italic text-foreground/80">
                          8 / 10 {isEs ? "de felicidad" : "happiness"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="uppercase text-[9px] tracking-wider text-foreground-muted">
                          {isEs ? "Realidad:" : "Reality:"}
                        </span>
                        <span>
                          7 / 10 {isEs ? "de felicidad" : "happiness"}
                        </span>
                      </div>
                    </div>
                    <span className="postmark-stamp text-[10px] py-0.5 px-2 self-start sm:self-auto shrink-0">
                      {isEs ? "MUY CERCA" : "VERY CLOSE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Emotional Evolution Graph & Radial Progress Accuracy */}
              <div className="lg:col-span-5 space-y-4">
                <div className="archival-folder rounded-xs p-4 border border-manila-border space-y-3">
                  <div>
                    <h4 className="text-[10px] font-letter font-semibold uppercase tracking-widest text-foreground-muted">
                      {isEs ? "Evolución emocional" : "Emotional Evolution"}
                    </h4>
                    <div className="flex gap-4 text-[10px] font-letter text-foreground-muted mt-1 select-none">
                      <span className="flex items-center gap-1">
                        <span className="border-b border-dashed border-foreground-muted w-3 inline-block" />{" "}
                        {isEs ? "Hace 1 año" : "1 year ago"}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <span className="border-b-2 border-wax w-3 inline-block" />{" "}
                        {isEs ? "Hoy" : "Today"}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-32 flex items-end">
                    <svg
                      viewBox="0 0 100 50"
                      className="w-full h-full overflow-visible"
                    >
                      <line
                        x1="0"
                        y1="2"
                        x2="100"
                        y2="2"
                        stroke="currentColor"
                        opacity="0.1"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1="23"
                        x2="100"
                        y2="23"
                        stroke="currentColor"
                        opacity="0.1"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1="45"
                        x2="100"
                        y2="45"
                        stroke="currentColor"
                        opacity="0.1"
                        strokeWidth="0.5"
                      />

                      <path
                        d="M 15 15 L 50 36 L 85 24"
                        fill="none"
                        stroke="var(--ink)"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <circle cx="15" cy="15" r="1.5" fill="var(--ink)" />
                      <circle cx="50" cy="36" r="1.5" fill="var(--ink)" />
                      <circle cx="85" cy="24" r="1.5" fill="var(--ink)" />

                      <path
                        d="M 15 10 L 50 40 L 85 5"
                        fill="none"
                        stroke="var(--wax)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="15" cy="10" r="2.2" fill="var(--wax)" />
                      <circle cx="50" cy="40" r="2.2" fill="var(--wax)" />
                      <circle cx="85" cy="5" r="2.2" fill="var(--wax)" />
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-letter font-semibold text-foreground-muted tracking-wider uppercase select-none">
                      <span>{isEs ? "Felicidad" : "Happiness"}</span>
                      <span>{isEs ? "Ansiedad" : "Anxiety"}</span>
                      <span>{isEs ? "Motivación" : "Motivation"}</span>
                    </div>
                  </div>
                </div>

                <div className="paper-sheet rounded-xs p-4 border border-crease flex items-center gap-4">
                  <div
                    className="radial-progress text-ink font-letter text-lg font-bold shrink-0"
                    style={{
                      ["--value" as string]: 75,
                      ["--size" as string]: "4.5rem",
                      ["--thickness" as string]: "5px",
                    }}
                    role="progressbar"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    75%
                  </div>

                  <div className="space-y-0.5 font-letter text-xs">
                    <h5 className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                      {isEs ? "Tu precisión general" : "Your overall accuracy"}
                    </h5>
                    <p className="font-semibold text-foreground/90">
                      {isEs
                        ? "Acertaste 3 de 4 predicciones"
                        : "You got 3 out of 4 predictions right"}
                    </p>
                    <p className="text-[10px] text-foreground-muted">
                      {isEs
                        ? "¡Vas por buen camino!"
                        : "You are on the right track!"}
                    </p>
                  </div>
                </div>
              </div>
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
