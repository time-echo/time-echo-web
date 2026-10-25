"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ArchivalAccordionProps {
  /**
   * Top docket identifier, e.g., "ANEXO 01 // FACTUAL" or "ANEXO 02 // ESTADO EMOCIONAL".
   */
  folio?: string;
  /**
   * Primary title in editorial serif.
   */
  title: string;
  /**
   * Subtitle explaining the annex purpose.
   */
  subtitle?: string;
  /**
   * Optional status badge (e.g., "3 de 5 completadas").
   */
  badge?: React.ReactNode;
  /**
   * Whether the accordion starts expanded in uncontrolled mode.
   * @default true
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state.
   */
  isOpen?: boolean;
  /**
   * Callback fired on open/close toggle.
   */
  onToggle?: (open: boolean) => void;
  /**
   * Content inside the accordion body.
   */
  children: React.ReactNode;
  /**
   * Optional container class name.
   */
  className?: string;
}

export function ArchivalAccordion({
  folio,
  title,
  subtitle,
  badge,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle,
  children,
  className,
}: ArchivalAccordionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

  const accordionId = React.useId();
  const headerId = `${accordionId}-header`;
  const panelId = `${accordionId}-panel`;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (!isControlled) {
      setUncontrolledOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <div
      className={cn(
        "archival-folder rounded-xs border border-manila-border overflow-hidden select-none transition-shadow",
        isOpen ? "shadow-xs" : "hover:border-crease",
        className
      )}
    >
      {/* Accordion Trigger Header */}
      <button
        id={headerId}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer bg-transparent hover:bg-manila/40 transition-colors focus-visible:outline-2 focus-visible:outline-wax"
      >
        <div className="space-y-1 min-w-0 flex-1">
          {folio && (
            <span className="text-[10px] font-letter uppercase tracking-widest text-foreground-muted block">
              {folio}
            </span>
          )}
          <h2 className="font-serif-editorial text-xl font-semibold text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-letter text-foreground-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pt-1">
          {badge && <div>{badge}</div>}
          <div
            className={cn(
              "w-7 h-7 rounded-xs border border-crease flex items-center justify-center text-foreground-muted bg-parchment/60 transition-transform duration-200",
              isOpen && "rotate-180 text-foreground"
            )}
          >
            <ChevronDown size={15} />
          </div>
        </div>
      </button>

      {/* Accordion Expandable Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-manila-border/70 p-5 sm:p-6 pt-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
