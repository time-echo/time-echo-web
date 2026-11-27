"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface InspirationPromptLabelProps {
  promptText: string;
  onRemove: () => void;
  className?: string;
}

export function InspirationPromptLabel({
  promptText,
  onRemove,
  className,
}: InspirationPromptLabelProps) {
  const { t } = useTimeEcho();

  return (
    <div
      role="note"
      aria-label={t("inspireMe.activePromptLabel")}
      className={cn(
        "rounded-xs border border-crease border-l-2 border-l-wax bg-manila/40 px-3.5 py-2.5 flex items-start justify-between gap-3 animate-fade-in",
        className,
      )}
    >
      <div className="space-y-0.5 min-w-0">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-letter uppercase tracking-wider font-semibold text-foreground-muted">
          <Sparkles size={11} className="text-wax shrink-0" />
          <span>{t("inspireMe.activePromptLabel")}</span>
        </span>
        <p className="font-serif-editorial italic text-sm text-foreground leading-relaxed">
          {promptText}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t("inspireMe.removePrompt")}
        title={t("inspireMe.removePrompt")}
        className="p-1 rounded-xs text-foreground-muted hover:text-wax hover:bg-crease/40 transition-colors cursor-pointer shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
