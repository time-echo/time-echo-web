import React from "react";
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";

export interface ArchivalFolderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Title or docket number displayed on the top physical tab.
   * e.g., "EXPEDIENTE № TE-00421"
   */
  tabLabel?: string;
  /**
   * Alignment of the physical tab protrusion.
   * @default 'left'
   */
  tabPosition?: "left" | "center" | "right";
  /**
   * Confidentiality or classification stamp.
   * e.g., "CONFIDENCIAL // CIFRADO EN REPOSO"
   */
  classification?: string;
  /**
   * Slot for badge, postmark stamp, or action buttons at top-right.
   */
  badgeSlot?: React.ReactNode;
}

const TAB_POSITION_CLASSES = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

/**
 * 📁 ArchivalFolder Component
 *
 * Physical Manila dossier folder with authentic cut tab, classification docket,
 * hairline borders, and inner crease depth.
 */
export const ArchivalFolder = React.forwardRef<
  HTMLDivElement,
  ArchivalFolderProps
>(
  (
    {
      children,
      tabLabel = "EXPEDIENTE POSTAL",
      tabPosition = "left",
      classification = "ARCHIVAL VAULT // PRIVADO",
      badgeSlot,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        {/* Physical Manila Folder Top Tab Bar */}
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
              {tabLabel}
            </span>
          </div>
        </div>

        {/* Folder Main Container */}
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
          {/* Inner Folder Crease Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/70 pointer-events-none" />

          {/* Dossier Header Strip */}
          <div className="px-6 sm:px-8 py-3.5 border-b border-crease/80 bg-crease/25 flex flex-wrap items-center justify-between gap-3 font-letter text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-wax" />
              <span className="text-[11px] tracking-widest text-foreground-muted uppercase">
                {classification}
              </span>
            </div>

            {badgeSlot && <div className="flex items-center">{badgeSlot}</div>}
          </div>

          {/* Dossier Contents Slot */}
          <div className="p-6 sm:p-8">{children}</div>

          {/* Bottom Crease Subtle Stitch Rule */}
          <div className="px-6 py-2 border-t border-crease/50 bg-manila/80 font-letter text-[11px] text-foreground-muted tracking-widest uppercase flex items-center justify-between select-none">
            <span>REGISTRO DE BÓVEDA // TIME-ECHO</span>
            <span>TIMBRADO Y ARCHIVADO</span>
          </div>
        </div>
      </div>
    );
  },
);

ArchivalFolder.displayName = "ArchivalFolder";
