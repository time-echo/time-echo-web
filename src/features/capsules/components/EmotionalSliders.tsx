"use client";

import React from "react";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export interface EmotionalSlidersProps {
  /**
   * Current emotional ratings (1 to 10).
   */
  values: {
    happinessLevel: number;
    anxietyLevel: number;
    motivationLevel: number;
  };
  /**
   * Callback fired when any slider level changes.
   */
  onChange?: (
    field: "happinessLevel" | "anxietyLevel" | "motivationLevel",
    value: number,
  ) => void;
  /**
   * If true, interactions are disabled.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Title displayed on the container.
   * @default 'Snapshot Emocional de Partida (1 – 10)'
   */
  title?: string;
  className?: string;
}

/**
 * 🎚️ EmotionalSliders Component
 *
 * Epistolary dials for recording baseline feelings (Happiness, Anxiety, Motivation)
 * on a tactile 1–10 scale.
 */
export function EmotionalSliders({
  values,
  onChange,
  readOnly = false,
  title = "Snapshot Emocional de Partida (1 – 10)",
  className,
}: EmotionalSlidersProps) {
  const handleChange = (
    field: "happinessLevel" | "anxietyLevel" | "motivationLevel",
    val: number,
  ) => {
    if (readOnly || !onChange) return;
    onChange(field, val);
  };

  return (
    <div
      className={cn(
        "p-5 sm:p-6 rounded border border-crease bg-parchment shadow-sm space-y-6",
        className,
      )}
    >
      {/* Docket Header */}
      <div className="flex items-center justify-between border-b border-crease pb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-wax" />
          <h3 className="font-letter font-bold text-xs uppercase tracking-wider text-ink">
            {title}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
          {readOnly ? "REGISTRO CERRADO" : "CALIBRACIÓN ACTUAL"}
        </span>
      </div>

      <div className="space-y-6">
        {/* Happiness Level */}
        <Slider
          label="Nivel de Felicidad"
          value={values.happinessLevel}
          onChange={(v) => handleChange("happinessLevel", v)}
          min={1}
          max={10}
          lowLabel="Sombrío / Difícil (1)"
          highLabel="Radiante / Pleno (10)"
          accentColor="wax"
          disabled={readOnly}
        />

        {/* Anxiety Level */}
        <Slider
          label="Nivel de Ansiedad / Incertidumbre"
          value={values.anxietyLevel}
          onChange={(v) => handleChange("anxietyLevel", v)}
          min={1}
          max={10}
          lowLabel="En Calma / Seguro (1)"
          highLabel="Abrumado / Incierto (10)"
          accentColor="ink"
          disabled={readOnly}
        />

        {/* Motivation Level */}
        <Slider
          label="Nivel de Motivación / Impulso"
          value={values.motivationLevel}
          onChange={(v) => handleChange("motivationLevel", v)}
          min={1}
          max={10}
          lowLabel="Desganado (1)"
          highLabel="Imparable / Con Foco (10)"
          accentColor="wax"
          disabled={readOnly}
        />
      </div>

      <div className="pt-2 border-t border-crease/50 text-[10px] font-letter text-foreground-muted/80 leading-relaxed select-none">
        * Este snapshot quedará sellado en la cápsula. Cuando la abras en el
        futuro, podrás comparar cómo evolucionaron tus sentimientos mediante el
        Expediente de Realidad.
      </div>
    </div>
  );
}
