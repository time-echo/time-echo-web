"use client";

import React from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { cn } from "@/lib/utils";

export interface ArchivalLoaderProps {
  /**
   * Layout presentation variant:
   * - `full`: Full-viewport centered loader (for root/auth/route loading)
   * - `page`: Centered loader within a page view (default)
   * - `inline`: Compact loader for embedding inside existing cards
   * @default "page"
   */
  variant?: "full" | "page" | "inline";
  /**
   * Optional custom title text.
   */
  title?: string;
  /**
   * Optional custom subtitle text.
   */
  subtitle?: string;
  /**
   * Optional additional class names.
   */
  className?: string;
}

/**
 * Simple loading indicator: a spinning wax-colored ring with a short message.
 * Used across all TimeEcho views.
 */
export function ArchivalLoader({
  variant = "page",
  title,
  subtitle,
  className,
}: ArchivalLoaderProps) {
  const { t } = useTimeEcho();

  const resolvedTitle = title ?? t("common.loader.title");
  const resolvedSubtitle = subtitle ?? t("common.loader.subtitle");

  const content = (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center text-center gap-4 select-none"
    >
      <div className="w-12 h-12 rounded-full bg-crease/50 dark:bg-crease/30 animate-pulse border border-crease/60 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-crease/70 dark:bg-crease/40 animate-pulse" />
      </div>
      {title ? (
        <div className="space-y-1 max-w-xs">
          <p className="font-serif-editorial text-lg text-foreground">
            {resolvedTitle}
          </p>
          {resolvedSubtitle && (
            <p className="font-letter text-xs text-foreground-muted leading-relaxed">
              {resolvedSubtitle}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-w-xs flex flex-col items-center">
          <div className="w-32 h-4 rounded-xs bg-crease/50 dark:bg-crease/30 animate-pulse" />
          <div className="w-48 h-3 rounded-xs bg-crease/40 dark:bg-crease/20 animate-pulse" />
        </div>
      )}
    </div>
  );

  if (variant === "inline") {
    return <div className={cn("w-full py-2", className)}>{content}</div>;
  }

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center p-4 font-ui text-foreground animate-fade-in",
        variant === "full" ? "min-h-screen bg-parchment" : "py-20",
        className,
      )}
    >
      {content}
    </div>
  );
}
