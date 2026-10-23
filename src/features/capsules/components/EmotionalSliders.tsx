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
  const { t } = useTimeEcho();

  const defaultTitle = t("composer.emotionalSectionTitle");

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
            ? t("composer.emotions.lockedRecord")
            : t("composer.emotions.currentCalibration")}
        </span>
      </div>

      <div className="space-y-6">
        <Slider
          label={t("composer.emotions.happinessLabel")}
          value={values.happinessLevel}
          onChange={(v) => handleChange("happinessLevel", v)}
          min={1}
          max={10}
          lowLabel={t("composer.emotions.happinessLow")}
          highLabel={t("composer.emotions.happinessHigh")}
          accentColor="wax"
          disabled={readOnly}
        />

        <Slider
          label={t("composer.emotions.anxietyLabel")}
          value={values.anxietyLevel}
          onChange={(v) => handleChange("anxietyLevel", v)}
          min={1}
          max={10}
          lowLabel={t("composer.emotions.anxietyLow")}
          highLabel={t("composer.emotions.anxietyHigh")}
          accentColor="ink"
          disabled={readOnly}
        />

        <Slider
          label={t("composer.emotions.motivationLabel")}
          value={values.motivationLevel}
          onChange={(v) => handleChange("motivationLevel", v)}
          min={1}
          max={10}
          lowLabel={t("composer.emotions.motivationLow")}
          highLabel={t("composer.emotions.motivationHigh")}
          accentColor="wax"
          disabled={readOnly}
        />
      </div>

      <div className="pt-2 border-t border-crease/50 text-[10px] font-letter text-foreground-muted/80 leading-relaxed select-none">
        {t("composer.emotions.snapshotNotice")}
      </div>
    </div>
  );
}
