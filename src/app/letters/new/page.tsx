"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PredictionCategory } from "@/types/timeecho";
import { Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewLetterPage() {
  const router = useRouter();
  const { locale, createCapsule } = useTimeEcho();
  const isEs = locale === "es";

  const [title, setTitle] = useState("");
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

  const currentDateFormatted = new Date().toLocaleDateString(
    isEs ? "es-ES" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  );

  const calculatedDeliverDate = new Date();
  if (showCustomDate && customDate) {
    const parsed = new Date(customDate);
    if (!isNaN(parsed.getTime())) {
      calculatedDeliverDate.setTime(parsed.getTime());
    } else {
      calculatedDeliverDate.setDate(calculatedDeliverDate.getDate() + 365);
    }
  } else {
    calculatedDeliverDate.setDate(
      calculatedDeliverDate.getDate() + (selectedHorizonDays || 365),
    );
  }

  const deliverDateString = calculatedDeliverDate.toISOString().split("T")[0];
  const daysDifference = Math.max(
    1,
    Math.round(
      (calculatedDeliverDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    const predictionsList: Array<{
      category: PredictionCategory;
      prediction: string;
    }> = [
      { category: "career" as const, prediction: predictionCareer },
      { category: "city" as const, prediction: predictionCity },
      { category: "salary" as const, prediction: predictionSalary },
      { category: "relationship" as const, prediction: predictionRelationship },
      { category: "achievement" as const, prediction: predictionAchievement },
    ].filter((p) => p.prediction.trim().length > 0);

    try {
      const capsule = await createCapsule({
        title:
          title.trim() ||
          (isEs ? "Para mi yo del futuro" : "To my future self"),
        content,
        email: email.trim() || "user@timeecho.me",
        scheduledAt: calculatedDeliverDate.toISOString(),
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
    <div className="relative max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
          <div className="space-y-1">
            <h1 className="font-serif-editorial text-3xl font-semibold text-foreground tracking-tight">
              {isEs
                ? "1. Cuando escribes tu carta"
                : "1. When you write your letter"}
            </h1>
            <p className="text-xs font-letter text-foreground-muted tracking-wider">
              {isEs
                ? "Estás creando una carta para tu yo del futuro."
                : "You are creating a letter for your future self."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-letter text-foreground-muted uppercase tracking-wider">
              {isEs ? "Se entregará el" : "Will be delivered on"}
            </span>
            <div className="postmark-stamp flex items-center gap-2 px-3 py-1.5 bg-transparent">
              <span className="bg-transparent text-xs font-letter font-semibold text-foreground uppercase tracking-wider">
                {deliverDateString}
              </span>
              <Calendar size={15} className="text-foreground-muted" />
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Letter Paper Sheet */}
          <div className="lg:col-span-7 paper-sheet rounded-xs p-6 sm:p-10 space-y-6 border border-crease">
            <div className="flex items-center justify-between border-b border-crease pb-4">
              <div>
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  TimeEcho · {isEs ? "Tu carta" : "Your Letter"}
                </span>
                <h2 className="font-serif-editorial text-2xl font-semibold text-foreground mt-0.5">
                  {isEs ? "Tu carta" : "Your Letter"}
                </h2>
              </div>
              <span className="postmark-stamp text-[10px] py-0.5 px-2.5">
                {currentDateFormatted}
              </span>
            </div>

            {/* Title Field with bottom underline */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="letter-title"
                  className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
                >
                  {isEs ? "Título" : "Title"}
                </label>
                <span className="text-[11px] font-letter text-foreground-muted">
                  {title.length} / 100
                </span>
              </div>
              <input
                id="letter-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  isEs ? "Ej: Para mi yo del futuro" : "E.g., To my future self"
                }
                maxLength={100}
                className="w-full border-b-2 border-crease rounded-none bg-transparent px-1 py-2 font-serif-editorial text-xl font-semibold text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-colors"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2 relative">
              <label
                htmlFor="letter-content"
                className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
              >
                {isEs ? "Contenido" : "Content"}
              </label>
              <textarea
                id="letter-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isEs
                    ? "Escribe aquí todo lo que quieras contarle a tu yo del futuro..."
                    : "Write here everything you wish to tell your future self..."
                }
                rows={15}
                maxLength={2000}
                required
                className="w-full p-5 sm:p-6 rounded-xs bg-transparent border border-crease font-letter text-sm leading-loose text-foreground placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none transition-all shadow-inner"
              />
              <div className="flex justify-between items-center text-[11px] font-letter text-foreground-muted pt-1">
                <span className="italic">
                  {isEs
                    ? "Solo tú podrás verla"
                    : "Only you will be able to see it"}
                </span>
                <span className={cn(isUnderMinChars && "text-wax")}>
                  {isUnderMinChars
                    ? isEs
                      ? `${charCount} / 80 mín (2000 máx)`
                      : `${charCount} / 80 min (2000 max)`
                    : `${charCount} / 2000`}
                </span>
              </div>
            </div>

            {/* Horizon Presets */}
            <div className="space-y-2.5 border-t border-crease pt-5">
              <label className="text-xs font-letter font-semibold text-foreground uppercase tracking-wider block">
                {isEs
                  ? "¿Cuándo quieres recibirla?"
                  : "When do you want to receive it?"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-letter">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHorizonDays(180);
                    setShowCustomDate(false);
                  }}
                  className={cn(
                    "py-2 rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 180 && !showCustomDate
                      ? "border-wax bg-wax text-parchment font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "6 meses" : "6 months"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHorizonDays(365);
                    setShowCustomDate(false);
                  }}
                  className={cn(
                    "py-2 rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 365 && !showCustomDate
                      ? "border-wax bg-wax text-parchment font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "1 año" : "1 year"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHorizonDays(1095);
                    setShowCustomDate(false);
                  }}
                  className={cn(
                    "py-2 rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 1095 && !showCustomDate
                      ? "border-wax bg-wax text-parchment font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "3 años" : "3 years"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHorizonDays(1825);
                    setShowCustomDate(false);
                  }}
                  className={cn(
                    "py-2 rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    selectedHorizonDays === 1825 && !showCustomDate
                      ? "border-wax bg-wax text-parchment font-semibold"
                      : "border-crease hover:bg-manila/50 text-foreground",
                  )}
                >
                  {isEs ? "5 años" : "5 years"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomDate(true);
                    setSelectedHorizonDays(0);
                  }}
                  className={cn(
                    "col-span-2 sm:col-span-1 py-2 rounded-xs uppercase tracking-wider transition-all cursor-pointer border",
                    showCustomDate
                      ? "border-wax bg-wax text-parchment font-semibold"
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
                      htmlFor="new-custom-date"
                      className="text-[10px] text-foreground-muted font-letter uppercase tracking-wider block mb-1 font-semibold"
                    >
                      {isEs
                        ? "Elige una fecha específica"
                        : "Choose a specific date"}
                    </label>
                    <input
                      id="new-custom-date"
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={
                        new Date(Date.now() + 86400000)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease font-letter text-foreground focus:border-wax focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2 border-t border-crease pt-5">
              <label
                htmlFor="new-email"
                className="text-xs font-letter uppercase tracking-wider font-semibold text-foreground-muted block"
              >
                {isEs ? "Tu Dirección de Correo" : "Your Email Address"}
              </label>
              <input
                id="new-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full border border-crease rounded-xs bg-transparent text-foreground placeholder:text-foreground-muted/40 text-xs px-3 py-2.5 font-letter focus:border-wax focus:outline-none transition-colors"
              />
              <p className="text-[11px] font-letter text-foreground-muted">
                {isEs
                  ? "Te enviaremos la carta en la fecha programada."
                  : "We will dispatch this letter to you on the scheduled date."}
              </p>
            </div>
          </div>

          {/* Right Column: Annexes & Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Annex I: Predictions */}
            <div className="archival-folder rounded-xs p-6 space-y-5 border border-[#D5CEBD]">
              <div className="border-b border-[#D5CEBD] pb-3">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {isEs ? "ANEXO I" : "ANNEX I"}
                </span>
                <h2 className="font-serif-editorial text-xl font-semibold text-foreground mt-0.5">
                  {isEs ? "Tus predicciones" : "Your Predictions"}
                </h2>
                <p className="text-xs font-letter text-foreground-muted mt-1">
                  {isEs
                    ? "¿Cómo crees que será tu vida cuando abras esta carta?"
                    : "How do you think your life will be when you open this letter?"}
                </p>
              </div>

              <div className="space-y-3.5 text-xs font-letter">
                <div className="space-y-1">
                  <label
                    htmlFor="new-pred-career"
                    className="font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-60">01.</span>
                    <span>
                      {isEs
                        ? "¿En qué trabajarás?"
                        : "What will your career be?"}
                    </span>
                  </label>
                  <input
                    id="new-pred-career"
                    type="text"
                    value={predictionCareer}
                    onChange={(e) => setPredictionCareer(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="new-pred-city"
                    className="font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-60">02.</span>
                    <span>
                      {isEs ? "¿Dónde vivirás?" : "Where will you live?"}
                    </span>
                  </label>
                  <input
                    id="new-pred-city"
                    type="text"
                    value={predictionCity}
                    onChange={(e) => setPredictionCity(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="new-pred-salary"
                    className="font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-60">03.</span>
                    <span>
                      {isEs
                        ? "¿Cuánto ganarás al mes?"
                        : "How much will you earn per month?"}
                    </span>
                  </label>
                  <input
                    id="new-pred-salary"
                    type="text"
                    value={predictionSalary}
                    onChange={(e) => setPredictionSalary(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="new-pred-rel"
                    className="font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-60">04.</span>
                    <span>
                      {isEs
                        ? "¿Cómo estará tu relación sentimental?"
                        : "How will your relationship be?"}
                    </span>
                  </label>
                  <input
                    id="new-pred-rel"
                    type="text"
                    value={predictionRelationship}
                    onChange={(e) => setPredictionRelationship(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="new-pred-achieve"
                    className="font-semibold text-foreground-muted flex items-center gap-1.5"
                  >
                    <span className="opacity-60">05.</span>
                    <span>
                      {isEs
                        ? "¿Cuál será tu mayor logro?"
                        : "What will be your greatest achievement?"}
                    </span>
                  </label>
                  <input
                    id="new-pred-achieve"
                    type="text"
                    value={predictionAchievement}
                    onChange={(e) => setPredictionAchievement(e.target.value)}
                    placeholder={
                      isEs
                        ? "Escribe tu predicción..."
                        : "Write your prediction..."
                    }
                    className="w-full paper-sheet rounded-xs px-3 py-2 text-xs border border-crease text-foreground font-letter placeholder:text-foreground-muted/40 focus:border-wax focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Annex II: Emotional Baseline */}
            <div className="archival-folder rounded-xs p-6 space-y-5 border border-[#D5CEBD]">
              <div className="border-b border-[#D5CEBD] pb-3">
                <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
                  {isEs ? "ANEXO II" : "ANNEX II"}
                </span>
                <h2 className="font-serif-editorial text-xl font-semibold text-foreground mt-0.5">
                  {isEs ? "Estado emocional hoy" : "Emotional Baseline Today"}
                </h2>
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
                      {happiness} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={happiness}
                    onChange={(e) => setHappiness(Number(e.target.value))}
                    className="w-full accent-[#8E2818] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
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
                    className="w-full accent-[#8E2818] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
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
                    className="w-full accent-[#8E2818] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Summary Paper Sheet */}
            <div className="paper-sheet rounded-xs p-5 space-y-3 text-xs font-letter border border-crease">
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest block">
                {isEs ? "Resumen" : "Summary"}
              </span>

              <div className="space-y-2 border-t border-crease pt-2 text-foreground">
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">
                    {isEs ? "Se abrirá el:" : "Opens on:"}
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {deliverDateString}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">
                    {isEs ? "Dentro de:" : "In:"}
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {daysDifference} {isEs ? "días" : "days"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">
                    {isEs ? "Privacidad:" : "Privacy:"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {isEs ? "Solo tú podrás verla" : "Only you can see it"}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUnderMinChars}
                className={cn(
                  "bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] rounded-xs py-3.5 px-6 text-xs font-semibold tracking-widest uppercase border-none cursor-pointer w-full min-h-[46px] shadow-xs font-letter inline-flex items-center justify-center gap-2 transition-colors",
                  (isSubmitting || isUnderMinChars) &&
                    "opacity-60 cursor-not-allowed",
                )}
              >
                <Mail size={16} />
                <span>
                  {isSubmitting
                    ? isEs
                      ? "Sellando carta..."
                      : "Sealing letter..."
                    : isEs
                      ? "Guardar carta"
                      : "Save Letter"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
