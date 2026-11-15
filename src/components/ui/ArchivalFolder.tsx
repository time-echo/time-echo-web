"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface ArchivalFolderProps extends React.HTMLAttributes<HTMLDivElement> {
  tabLabel?: string;
  tabPosition?: "left" | "center" | "right";
  classification?: string;
  badgeSlot?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

const TAB_POSITION_CLASSES = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function ArchivalFolder({
  children,
  tabLabel,
  tabPosition = "left",
  classification,
  badgeSlot,
  className,
  ref,
  ...props
}: ArchivalFolderProps) {
  const { t } = useTimeEcho();
  const resolvedTabLabel = tabLabel ?? t("common.folder.defaultTab");
  const resolvedClassification =
    classification ?? t("common.folder.defaultClassification");

  return (
    <div ref={ref} className={cn("relative w-full", className)} {...props}>
      <div
        className={cn(
          "flex items-end px-3 select-none",
          TAB_POSITION_CLASSES[tabPosition],
        )}
      >
        <div
          className={cn(
            "h-8 px-4 sm:px-6 rounded-t-md border-t border-l border-r border-crease bg-manila",
            "flex items-center gap-2 font-letter text-xs text-foreground-muted tracking-wider uppercase",
            "shadow-[0_-2px_4px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.6)]",
          )}
        >
          <Folder size={13} className="text-ink/70" />
          <span className="font-semibold text-ink truncate max-w-[240px] sm:max-w-[340px]">
            {resolvedTabLabel}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "archival-folder relative rounded-b-md border border-crease bg-manila overflow-hidden",
          tabPosition === "left"
            ? "rounded-tr-md"
            : tabPosition === "right"
              ? "rounded-tl-md"
              : "rounded-t-md",
          "shadow-[0_2px_10px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.4)]",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/70 pointer-events-none" />

        <div className="p-4 sm:p-6 border-b border-crease/60 flex flex-wrap items-center justify-between gap-3 font-letter text-xs text-foreground-muted select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink/60" />
            <span className="font-mono text-[11px] tracking-wider uppercase text-ink">
              {resolvedClassification}
            </span>
          </div>
          {badgeSlot && <div className="flex items-center">{badgeSlot}</div>}
        </div>

        <div className="p-5 sm:p-8 font-ui text-foreground">{children}</div>

        <div className="px-6 py-2.5 bg-crease/25 border-t border-crease/60 flex items-center justify-between font-letter text-[10px] text-foreground-muted select-none">
          <span>{t("common.folder.footerLeft")}</span>
          <span className="font-mono">{t("common.folder.footerRight")}</span>
        </div>
      </div>
    </div>
  );
}
