import React from "react";
import { cn } from "@/lib/utils";

export interface PaperSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Surface background material variant.
   * @default 'parchment'
   */
  variant?: "parchment" | "lined" | "manila";
  /**
   * Box shadow elevation depth.
   * @default 'raised'
   */
  elevation?: "flat" | "raised" | "floating";
  /**
   * Optional postal docket folio label placed at top-left.
   * e.g., "FOLIO № TE-00421"
   */
  docketFolio?: string;
  /**
   * Optional date string placed at top-right.
   */
  dateStamp?: string;
  /**
   * Whether to include a red/crease left margin guide line (like epistolary notebook stationery).
   * @default false
   */
  showMarginGuide?: boolean;
  /**
   * Custom top docket header slot.
   */
  headerSlot?: React.ReactNode;
  /**
   * Custom bottom docket footer slot.
   */
  footerSlot?: React.ReactNode;
}

const ELEVATION_CLASSES = {
  flat: "shadow-none border-crease",
  raised:
    "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_16px_rgba(0,0,0,0.03)] border-crease",
  floating:
    "shadow-[0_4px_6px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.03)] border-crease/80",
};

const VARIANT_CLASSES = {
  parchment: "bg-parchment text-foreground",
  lined: "bg-parchment lined-paper-canvas text-foreground",
  manila: "bg-manila text-foreground",
};

/**
 * 📜 PaperSheet Component
 *
 * Physical archival parchment surface with hairline borders,
 * ruled notebook lines, epistolary margin guides, and subtle paper depth.
 */
export const PaperSheet = React.forwardRef<HTMLDivElement, PaperSheetProps>(
  (
    {
      children,
      variant = "parchment",
      elevation = "raised",
      docketFolio,
      dateStamp,
      showMarginGuide = false,
      headerSlot,
      footerSlot,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <article
        ref={ref}
        className={cn(
          "paper-sheet relative rounded-sm border transition-shadow duration-300",
          VARIANT_CLASSES[variant],
          ELEVATION_CLASSES[elevation],
          className,
        )}
        {...props}
      >
        {/* Subtle Paper Grain / Edge Cut Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/60 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/40 pointer-events-none" />

        {/* Left Margin Rule (Classic Epistolary Red/Crease Ruled Line) */}
        {showMarginGuide && (
          <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-[1px] bg-wax/25 pointer-events-none" />
        )}

        {/* Archival Folio Header Bar */}
        {(docketFolio || dateStamp || headerSlot) && (
          <header className="px-6 sm:px-8 pt-6 pb-4 border-b border-crease/70 flex flex-wrap items-center justify-between gap-3 font-letter text-xs text-foreground-muted select-none">
            {headerSlot || (
              <>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-wax/70" />
                  <span className="font-semibold tracking-wider text-ink uppercase">
                    {docketFolio || "FOLIO № ARCHIVAL-VAULT"}
                  </span>
                </div>
                {dateStamp && (
                  <span className="tracking-widest uppercase text-[11px] opacity-80">
                    {dateStamp}
                  </span>
                )}
              </>
            )}
          </header>
        )}

        {/* Paper Sheet Content Body */}
        <div
          className={cn("p-6 sm:p-8", showMarginGuide ? "pl-16 sm:pl-20" : "")}
        >
          {children}
        </div>

        {/* Optional Archival Footer Bar */}
        {footerSlot && (
          <footer className="px-6 sm:px-8 py-3.5 border-t border-crease/70 bg-crease/20 font-letter text-[11px] text-foreground-muted">
            {footerSlot}
          </footer>
        )}
      </article>
    );
  },
);

PaperSheet.displayName = "PaperSheet";
