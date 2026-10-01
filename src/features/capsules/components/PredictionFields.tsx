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

export interface PredictionItemInput {
  category: PredictionCategory;
  prediction: string;
}

export interface PredictionFieldsProps {
  /**
   * List of current prediction items.
   */
  predictions: PredictionItemInput[];
  /**
   * Callback on predictions list changes.
   */
  onChange?: (predictions: PredictionItemInput[]) => void;
  /**
   * Maximum allowed predictions.
   * @default 6
   */
  maxPredictions?: number;
  /**
   * Read-only mode.
   * @default false
   */
  readOnly?: boolean;
  className?: string;
}

const CATEGORY_DEFINITIONS: Record<
  string,
  { label: string; placeholder: string; icon: React.ElementType }
> = {
  city: {
    label: "Ciudad / Residencia",
    placeholder: "¿En qué ciudad o rincón del mundo estarás viviendo?",
    icon: MapPin,
  },
  career: {
    label: "Carrera / Proyecto",
    placeholder: "¿Qué hito profesional o proyecto habrás lanzado?",
    icon: Briefcase,
  },
  achievement: {
    label: "Logro Personal",
    placeholder: "¿Qué desafío habrás superado con constancia?",
    icon: Trophy,
  },
  salary: {
    label: "Finanzas / Economía",
    placeholder: "¿Cuál será tu meta de ingresos o ahorro?",
    icon: DollarSign,
  },
  relationship: {
    label: "Vínculos / Afectos",
    placeholder: "¿A quiénes cuidarás y mantendrás cerca?",
    icon: Heart,
  },
  happiness: {
    label: "Paz Mental",
    placeholder: "¿Qué hábito te traerá serenidad cotidiana?",
    icon: Sparkles,
  },
};

/**
 * 🧭 PredictionFields Component
 *
 * Epistolary milestone predictions (City, Career, Achievement, Salary, Relationship)
 * evaluated retrospectively upon capsule reveal.
 */
export function PredictionFields({
  predictions,
  onChange,
  maxPredictions = 6,
  readOnly = false,
  className,
}: PredictionFieldsProps) {
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
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-crease pb-3">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-ink" />
          <h3 className="font-letter font-bold text-xs uppercase tracking-wider text-ink">
            Predicciones del Destino (Hitos y Metas)
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
          {predictions.length} / {maxPredictions} PREVISTAS
        </span>
      </div>

      {/* Prediction List */}
      <div className="space-y-3.5">
        {predictions.length === 0 ? (
          <div className="py-6 px-4 text-center border border-dashed border-crease rounded bg-manila/30 font-letter text-xs text-foreground-muted">
            No has agregado predicciones aún. Selecciona una categoría abajo
            para apostar con tu futuro.
          </div>
        ) : (
          predictions.map((item, index) => {
            const def =
              CATEGORY_DEFINITIONS[item.category] || CATEGORY_DEFINITIONS.city;
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

                    {/* Category Selector */}
                    {readOnly ? (
                      <span className="font-letter text-xs font-semibold text-ink uppercase">
                        {def.label}
                      </span>
                    ) : (
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleUpdate(index, {
                            category: e.target.value as PredictionCategory,
                          })
                        }
                        aria-label="Categoría de predicción"
                        className="font-letter text-xs font-semibold text-ink bg-transparent focus:outline-none border-b border-dashed border-crease cursor-pointer"
                      >
                        {Object.entries(CATEGORY_DEFINITIONS).map(
                          ([catKey, catDef]) => (
                            <option key={catKey} value={catKey}>
                              {catDef.label}
                            </option>
                          ),
                        )}
                      </select>
                    )}
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1 text-foreground-muted hover:text-wax transition-colors"
                      title="Eliminar predicción"
                      aria-label="Eliminar predicción"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Prediction Input */}
                <input
                  type="text"
                  value={item.prediction}
                  onChange={(e) =>
                    handleUpdate(index, { prediction: e.target.value })
                  }
                  placeholder={def.placeholder}
                  readOnly={readOnly}
                  aria-label={`Predicción sobre ${def.label}`}
                  className={cn(
                    "w-full px-3 py-2 rounded border border-crease bg-parchment",
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

      {/* Add Prediction Category Pills */}
      {!readOnly && predictions.length < maxPredictions && (
        <div className="pt-2 border-t border-crease/60 space-y-2">
          <span className="font-letter text-[10px] text-foreground-muted uppercase tracking-wider block">
            Agregar hito por categoría:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(CATEGORY_DEFINITIONS).map(([key, def]) => {
              const Icon = def.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleAddPrediction(key as PredictionCategory)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-crease bg-parchment hover:bg-manila text-ink font-letter text-[11px] tracking-wider transition-colors cursor-pointer"
                >
                  <Plus size={11} className="text-wax" />
                  <Icon size={12} />
                  <span>{def.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
