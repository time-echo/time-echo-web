"use client";

import React from "react";
import { PredictionCategory } from "@/types/timeecho";
import {
  Compass,
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  Trophy,
  DollarSign,
  Heart,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface PredictionItemInput {
  category: PredictionCategory;
  prediction: string;
}

export interface PredictionFieldsProps {
  predictions: PredictionItemInput[];
  onChange?: (predictions: PredictionItemInput[]) => void;
  maxPredictions?: number;
  readOnly?: boolean;
  className?: string;
}

const CATEGORY_MAP: Record<
  string,
  {
    icon: React.ElementType;
    es: { label: string; placeholder: string };
    en: { label: string; placeholder: string };
  }
> = {
  city: {
    icon: MapPin,
    es: {
      label: "Ciudad / Residencia",
      placeholder: "¿En qué ciudad o rincón del mundo estarás viviendo?",
    },
    en: {
      label: "City & Residence",
      placeholder: "In which city or corner of the world will you reside?",
    },
  },
  career: {
    icon: Briefcase,
    es: {
      label: "Carrera / Proyecto",
      placeholder: "¿Qué hito profesional o proyecto habrás lanzado?",
    },
    en: {
      label: "Career & Work",
      placeholder: "What professional milestone or craft will you pursue?",
    },
  },
  achievement: {
    icon: Trophy,
    es: {
      label: "Logro Personal",
      placeholder: "¿Qué desafío habrás superado con constancia?",
    },
    en: {
      label: "Personal Achievement",
      placeholder: "What personal summit will you have reached?",
    },
  },
  salary: {
    icon: DollarSign,
    es: {
      label: "Finanzas / Economía",
      placeholder: "¿Cuál será tu meta de ingresos o ahorro?",
    },
    en: {
      label: "Wealth & Finance",
      placeholder: "What is your target income, savings, or independence?",
    },
  },
  relationship: {
    icon: Heart,
    es: {
      label: "Vínculos / Afectos",
      placeholder: "¿A quiénes cuidarás y mantendrás cerca?",
    },
    en: {
      label: "Relationships & Love",
      placeholder: "Who will you cherish and hold close to your heart?",
    },
  },
  happiness: {
    icon: Sparkles,
    es: {
      label: "Paz Mental",
      placeholder: "¿Qué hábito te traerá serenidad cotidiana?",
    },
    en: {
      label: "Mental Peace",
      placeholder: "What daily ritual will bring you enduring serenity?",
    },
  },
};

export function PredictionFields({
  predictions,
  onChange,
  maxPredictions = 6,
  readOnly = false,
  className,
}: PredictionFieldsProps) {
  const { locale } = useTimeEcho();
  const isEs = locale === "es";

  const handleAddPrediction = (category: PredictionCategory = "city") => {
    if (readOnly || !onChange || predictions.length >= maxPredictions) return;
    onChange([...predictions, { category, prediction: "" }]);
  };

  const handleUpdate = (index: number, patch: Partial<PredictionItemInput>) => {
    if (readOnly || !onChange) return;
    const next = [...predictions];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const handleRemove = (index: number) => {
    if (readOnly || !onChange) return;
    onChange(predictions.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "p-5 sm:p-6 rounded border border-crease bg-parchment shadow-sm space-y-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-crease pb-3">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-ink" />
          <h3 className="font-letter font-bold text-xs uppercase tracking-wider text-ink">
            {isEs
              ? "Predicciones del Destino (Hitos y Metas)"
              : "Forecasts of Destiny (Milestones & Goals)"}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
          {predictions.length} / {maxPredictions} {isEs ? "PREVISTAS" : "LOGGED"}
        </span>
      </div>

      <div className="space-y-3.5">
        {predictions.length === 0 ? (
          <div className="py-6 px-4 text-center border border-dashed border-crease rounded bg-manila/30 font-letter text-xs text-foreground-muted">
            {isEs
              ? "No has agregado predicciones aún. Selecciona una categoría abajo para apostar con tu futuro."
              : "No predictions recorded yet. Choose a category below to wager with your future self."}
          </div>
        ) : (
          predictions.map((item, index) => {
            const def = CATEGORY_MAP[item.category] || CATEGORY_MAP.city;
            const meta = isEs ? def.es : def.en;
            const Icon = def.icon;

            return (
              <div
                key={index}
                className="p-3.5 rounded border border-crease bg-manila/40 space-y-2.5 transition-colors focus-within:border-ink/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-parchment border border-crease text-ink">
                      <Icon size={13} />
                    </span>

                    {readOnly ? (
                      <span className="font-letter text-xs font-semibold text-ink uppercase">
                        {meta.label}
                      </span>
                    ) : (
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleUpdate(index, {
                            category: e.target.value as PredictionCategory,
                          })
                        }
                        aria-label={
                          isEs
                            ? "Categoría de predicción"
                            : "Prediction category"
                        }
                        className="font-letter text-xs font-semibold text-ink bg-transparent focus:outline-none border-b border-dashed border-crease cursor-pointer py-1"
                      >
                        {Object.entries(CATEGORY_MAP).map(([catKey, catDef]) => (
                          <option key={catKey} value={catKey}>
                            {isEs ? catDef.es.label : catDef.en.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-foreground-muted hover:text-wax transition-colors rounded cursor-pointer"
                      title={isEs ? "Eliminar predicción" : "Delete prediction"}
                      aria-label={
                        isEs ? "Eliminar predicción" : "Delete prediction"
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={item.prediction}
                  onChange={(e) =>
                    handleUpdate(index, { prediction: e.target.value })
                  }
                  placeholder={meta.placeholder}
                  readOnly={readOnly}
                  aria-label={`${isEs ? "Predicción sobre" : "Prediction for"} ${meta.label}`}
                  className={cn(
                    "w-full px-3.5 py-2.5 rounded border border-crease bg-parchment",
                    "font-letter text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/40",
                    "focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink",
                    readOnly && "border-none bg-transparent px-0 font-medium",
                  )}
                />
              </div>
            );
          })
        )}
      </div>

      {!readOnly && predictions.length < maxPredictions && (
        <div className="pt-2 border-t border-crease/60 space-y-2.5">
          <span className="font-letter text-[10px] text-foreground-muted uppercase tracking-wider block font-semibold">
            {isEs
              ? "Agregar hito por categoría:"
              : "Add milestone by category:"}
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_MAP).map(([key, def]) => {
              const Icon = def.icon;
              const meta = isEs ? def.es : def.en;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleAddPrediction(key as PredictionCategory)}
                  className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded border border-crease bg-parchment hover:bg-manila text-ink font-letter text-xs tracking-wider transition-colors cursor-pointer"
                >
                  <Plus size={13} className="text-wax" />
                  <Icon size={14} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
