"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WaxSealProps {
  /**
   * Whether the wax seal is already broken.
   */
  isBroken?: boolean;
  /**
   * If true, the letter is still locked in-transit and cannot be broken.
   */
  isLocked?: boolean;
  /**
   * Callback fired when the seal is clicked to break.
   */
  onBreak?: () => void;
  /**
   * Size variation of the wax seal.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Monogram initials embossed in the center of the seal.
   * @default 'TE'
   */
  monogram?: string;
  /**
   * Whether to display an interactive hint badge beneath the seal.
   */
  showPrompt?: boolean;
  /**
   * Custom text for the interactive prompt.
   */
  promptText?: string;
  /**
   * Disabled state preventing interactions.
   */
  disabled?: boolean;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

const SIZE_CONFIGS = {
  sm: {
    container: "w-14 h-14",
    text: "text-xs",
    monogram: "text-sm font-bold",
    subtext: "text-[9px]",
    iconSize: 16,
  },
  md: {
    container: "w-20 h-20",
    text: "text-sm",
    monogram: "text-xl font-bold tracking-wider",
    subtext: "text-[10px]",
    iconSize: 20,
  },
  lg: {
    container: "w-28 h-28",
    text: "text-base",
    monogram: "text-3xl font-extrabold tracking-widest",
    subtext: "text-xs",
    iconSize: 26,
  },
};

/**
 * 🕯️ WaxSeal Component
 *
 * 3D tactile Carmine Wax Seal with radial bevel, depth shadows,
 * stamped monogram insignia, and interactive fracture split physics.
 */
export function WaxSeal({
  isBroken = false,
  isLocked = false,
  onBreak,
  size = "md",
  monogram = "TE",
  showPrompt = false,
  promptText,
  disabled = false,
  className,
}: WaxSealProps) {
  const [internalBroken, setInternalBroken] = useState(isBroken);
  const [isFracturing, setIsFracturing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const config = SIZE_CONFIGS[size];
  const effectivelyBroken = isBroken || internalBroken;
  const canInteract = !effectivelyBroken && !isLocked && !disabled;

  const handleBreak = () => {
    if (!canInteract) return;

    setIsFracturing(true);

    // Give time for fracture animation before finalizing broken state
    setTimeout(() => {
      setInternalBroken(true);
      setIsFracturing(false);
      onBreak?.();
    }, 650);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && canInteract) {
      e.preventDefault();
      handleBreak();
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center select-none",
        className,
      )}
    >
      {/* If broken and finished fracture, show broken stamp marker or null */}
      {effectivelyBroken && !isFracturing ? (
        <div
          className={cn(
            config.container,
            "rounded-full border-2 border-dashed border-wax/40 opacity-40 flex items-center justify-center font-mono text-xs text-wax rotate-[-12deg]",
          )}
          title="Sello quebrado"
        >
          <span className="text-[10px] tracking-wider uppercase font-bold text-center leading-none">
            {monogram}
            <br />
            ROTO
          </span>
        </div>
      ) : (
        <div className="relative">
          <AnimatePresence mode="wait">
            {isFracturing ? (
              /* ==========================================================
                 Fracture Split Physics (Framer Motion Split Halves)
                 ========================================================== */
              <div
                key="fracturing"
                className={cn(
                  "relative flex items-center justify-center",
                  config.container,
                )}
              >
                {/* Left Seal Half */}
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    x: -28,
                    y: 10,
                    rotate: -18,
                    opacity: 0,
                    transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  }}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, 52% 0, 48% 30%, 54% 50%, 46% 75%, 52% 100%, 0 100%)",
                  }}
                >
                  <SealBody
                    config={config}
                    monogram={monogram}
                    isLocked={isLocked}
                  />
                </motion.div>

                {/* Right Seal Half */}
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    x: 28,
                    y: 14,
                    rotate: 22,
                    opacity: 0,
                    transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  }}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(52% 0, 100% 0, 100% 100%, 52% 100%, 46% 75%, 54% 50%, 48% 30%)",
                  }}
                >
                  <SealBody
                    config={config}
                    monogram={monogram}
                    isLocked={isLocked}
                  />
                </motion.div>

                {/* Wax Fragments / Splinters */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{
                    scale: 1.4,
                    opacity: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b23320] -translate-x-3 -translate-y-4" />
                  <div className="w-2 h-2 rounded-full bg-[#52150d] translate-x-4 -translate-y-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-wax translate-x-2 translate-y-5" />
                  <div className="w-2 h-1 rounded bg-[#b23320] -translate-x-4 translate-y-3" />
                </motion.div>
              </div>
            ) : (
              /* ==========================================================
                 Intact 3D Carmine Wax Seal
                 ========================================================== */
              <motion.div
                key="intact"
                role="button"
                tabIndex={canInteract ? 0 : -1}
                aria-label={
                  isLocked
                    ? "Sello de lacre protegido en tránsito"
                    : "Romper sello de lacre carmesí"
                }
                whileHover={
                  canInteract
                    ? { scale: 1.05 }
                    : isLocked
                      ? { rotate: [0, -3, 3, -2, 2, 0] }
                      : {}
                }
                whileTap={canInteract ? { scale: 0.94 } : {}}
                onClick={handleBreak}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                  config.container,
                  "relative rounded-full transition-shadow duration-300",
                  canInteract
                    ? "cursor-pointer"
                    : isLocked
                      ? "cursor-not-allowed"
                      : "cursor-default",
                )}
              >
                <SealBody
                  config={config}
                  monogram={monogram}
                  isLocked={isLocked}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Interactive Helper Hint */}
      {showPrompt && canInteract && !effectivelyBroken && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 flex items-center gap-1.5 text-xs font-mono tracking-wider text-wax bg-manila/80 px-2.5 py-1 rounded border border-crease shadow-sm"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-wax animate-pulse" />
          <span>
            {promptText || (isHovered ? "¡Clic para quebrar!" : "Romper sello")}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Renders the physical 3D embossed Carmine Wax material with organic rim,
 * beveled rings, and monogram emblem.
 */
function SealBody({
  config,
  monogram,
  isLocked,
}: {
  config: (typeof SIZE_CONFIGS)["md"];
  monogram: string;
  isLocked: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full h-full rounded-full flex items-center justify-center relative p-1.5",
        "shadow-[0_6px_16px_rgba(82,21,13,0.48),inset_0_2px_4px_rgba(255,255,255,0.36),inset_0_-4px_8px_rgba(30,8,5,0.6)]",
      )}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #cf3d25 0%, #a42c19 35%, #8e2818 65%, #4a130b 100%)",
        border: "2px solid rgba(178, 51, 32, 0.7)",
      }}
    >
      {/* Organic scalloped wax drip outer ring */}
      <div className="absolute inset-0.5 rounded-full border border-white/20 pointer-events-none" />

      {/* Inner Debossed Ring */}
      <div
        className="w-full h-full rounded-full flex flex-col items-center justify-center relative border border-[#52150d]/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.25)]"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, #9c2b1a 0%, #832415 60%, #5d170e 100%)",
        }}
      >
        {/* Subtle Fine Beading Dots */}
        <div className="absolute inset-1 rounded-full border border-dashed border-white/15 pointer-events-none" />

        {isLocked ? (
          <div className="flex flex-col items-center justify-center text-parchment/90">
            <Lock
              size={config.iconSize}
              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            />
            <span
              className={cn(
                config.subtext,
                "font-mono mt-0.5 uppercase tracking-widest opacity-80",
              )}
            >
              Bóveda
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <span
              className={cn(
                config.monogram,
                "font-serif-editorial text-parchment drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] select-none leading-none",
              )}
            >
              {monogram}
            </span>
            <span
              className={cn(
                config.subtext,
                "font-mono uppercase tracking-[0.2em] text-parchment/70 leading-none mt-1 scale-90 select-none",
              )}
            >
              VAULT
            </span>
          </div>
        )}

        {/* Specular Light Reflection Sheen */}
        <div className="absolute top-1 left-2 w-3.5 h-2 rounded-full bg-white/30 blur-[0.8px] -rotate-45 pointer-events-none" />
      </div>
    </div>
  );
}
