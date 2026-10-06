"use client";

import React from "react";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface EmotionalSlidersProps {
  values: {
    happinessLevel: number;
    anxietyLevel: number;
    motivationLevel: number;
  };
  onChange?: (
    field: "happinessLevel" | "anxietyLevel" | "motivationLevel",
    value: number,
  ) => void;
  readOnly?: boolean;
  title?: string;
  className?: string;
}

export function EmotionalSliders({
  values,
  onChange,
  readOnly = false,
  title,
  className,
}: EmotionalSlidersProps) {
  const { locale } = useTimeEcho();
  const isEs = locale === "es";

  const defaultTitle = isEs
    ? "Snapshot Emocional de Partida (1 – 10)"
    : "Baseline Emotional Snapshot (1 – 10)";

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
      <div className="flex items-center justify-between border-b border-crease pb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-wax" />
          <h3 className="font-letter font-bold text-xs uppercase tracking-wider text-ink">
            {title || defaultTitle}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
          {readOnly
            ? isEs
              ? "REGISTRO CERRADO"
              : "LOCKED RECORD"
            : isEs
              ? "CALIBRACIÓN ACTUAL"
              : "CURRENT CALIBRATION"}
        </span>
      </div>

      <div className="space-y-6">
        <Slider
          label={isEs ? "Nivel de Felicidad" : "Happiness Level"}
          value={values.happinessLevel}
          onChange={(v) => handleChange("happinessLevel", v)}
          min={1}
          max={10}
          lowLabel={isEs ? "Sombrío / Difícil (1)" : "Somber / Heavy (1)"}
          highLabel={isEs ? "Radiante / Pleno (10)" : "Radiant / Full (10)"}
          accentColor="wax"
          disabled={readOnly}
        />

        <Slider
          label={
            isEs
              ? "Nivel de Ansiedad / Incertidumbre"
              : "Anxiety & Uncertainty Level"
          }
          value={values.anxietyLevel}
          onChange={(v) => handleChange("anxietyLevel", v)}
          min={1}
          max={10}
          lowLabel={isEs ? "En Calma / Seguro (1)" : "Serene / Grounded (1)"}
          highLabel={isEs ? "Abrumado / Incierto (10)" : "Overwhelmed (10)"}
          accentColor="ink"
          disabled={readOnly}
        />

        <Slider
          label={
            isEs
              ? "Nivel de Motivación / Impulso"
              : "Motivation & Drive Level"
          }
          value={values.motivationLevel}
          onChange={(v) => handleChange("motivationLevel", v)}
          min={1}
          max={10}
          lowLabel={isEs ? "Desganado (1)" : "Lethargic (1)"}
          highLabel={isEs ? "Imparable / Con Foco (10)" : "Unstoppable (10)"}
          accentColor="wax"
          disabled={readOnly}
        />
      </div>

      <div className="pt-2 border-t border-crease/50 text-[10px] font-letter text-foreground-muted/80 leading-relaxed select-none">
        {isEs
          ? "* Este snapshot quedará sellado en la cápsula. Cuando la abras en el futuro, podrás comparar cómo evolucionaron tus sentimientos mediante el Expediente de Realidad."
          : "* This snapshot will be preserved in the sealed capsule. When unsealed in the future, you can contrast your psychological shift through the Reality Ledger."}
      </div>
    </div>
  );
}
