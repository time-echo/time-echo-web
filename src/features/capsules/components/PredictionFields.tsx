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

const CATEGORY_ICONS: Record<PredictionCategory, React.ElementType> = {
  city: MapPin,
  career: Briefcase,
  achievement: Trophy,
  salary: DollarSign,
  relationship: Heart,
  happiness: Sparkles,
};

const CATEGORIES: PredictionCategory[] = [
  "city",
  "career",
  "achievement",
  "salary",
  "relationship",
  "happiness",
];

export function PredictionFields({
  predictions,
  onChange,
  maxPredictions = 6,
  readOnly = false,
  className,
}: PredictionFieldsProps) {
  const { t } = useTimeEcho();

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
            {t("composer.predictionsSectionTitle")}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
          {predictions.length} / {maxPredictions} {t("composer.loggedCount")}
        </span>
      </div>

      <div className="space-y-3.5">
        {predictions.length === 0 ? (
          <div className="py-6 px-4 text-center border border-dashed border-crease rounded bg-manila/30 font-letter text-xs text-foreground-muted">
            {t("composer.noPredictionsLogged")}
          </div>
        ) : (
          predictions.map((item, index) => {
            const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.city;
            const categoryLabel = t(`composer.categories.${item.category}.label`);
            const categoryPlaceholder = t(
              `composer.categories.${item.category}.placeholder`,
            );

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
                        {categoryLabel}
                      </span>
                    ) : (
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleUpdate(index, {
                            category: e.target.value as PredictionCategory,
                          })
                        }
                        aria-label={t("composer.categoryAria")}
                        className="font-letter text-xs font-semibold text-ink bg-transparent focus:outline-none border-b border-dashed border-crease cursor-pointer py-1"
                      >
                        {CATEGORIES.map((catKey) => (
                          <option key={catKey} value={catKey}>
                            {t(`composer.categories.${catKey}.label`)}
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
                      title={t("composer.deletePrediction")}
                      aria-label={t("composer.deletePrediction")}
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
                  placeholder={categoryPlaceholder}
                  readOnly={readOnly}
                  aria-label={`${t("composer.predictionFor")} ${categoryLabel}`}
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
            {t("composer.addMilestoneByCategory")}
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((key) => {
              const Icon = CATEGORY_ICONS[key];
              const label = t(`composer.categories.${key}.label`);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleAddPrediction(key)}
                  className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded border border-crease bg-parchment hover:bg-manila text-ink font-letter text-xs tracking-wider transition-colors cursor-pointer"
                >
                  <Plus size={13} className="text-wax" />
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
