"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StampPerforationFrame, type StampSize } from "./StampPerforationFrame";
import { PostmarkOverlay } from "./PostmarkOverlay";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  getStampById,
  DEFAULT_STAMP_ID,
  type StampDefinition,
} from "./stamps.data";

export interface StampProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  size?: StampSize;
  rotation?: number;
  hasPostmark?: boolean;
  interactive?: boolean;
  selected?: boolean;
  animateAffix?: boolean;
  hasPaperTexture?: boolean;
  paperColor?: string;
  borderColor?: string;
  className?: string;
  postmarkVariant?: "waves" | "circular" | "combo";
  postmarkDate?: string;
}

const TEXT_SIZE_MAP: Record<
  Exclude<StampSize, "custom">,
  {
    header: string;
    denomination: string;
    iconSize: string;
  }
> = {
  sm: {
    header: "text-[5px] tracking-wider",
    denomination: "text-[5px]",
    iconSize: "w-7 h-7",
  },
  md: {
    header: "text-[7px] tracking-widest",
    denomination: "text-[7px]",
    iconSize: "w-11 h-11",
  },
  lg: {
    header: "text-[9px] tracking-widest",
    denomination: "text-[9px]",
    iconSize: "w-14 h-14",
  },
  xl: {
    header: "text-[11px] tracking-widest",
    denomination: "text-[11px]",
    iconSize: "w-18 h-18",
  },
};

export const Stamp = React.forwardRef<HTMLDivElement, StampProps>(
  (
    {
      id,
      size = "md",
      rotation = 0,
      hasPostmark = false,
      interactive = false,
      animateAffix = false,
      hasPaperTexture = true,
      paperColor,
      borderColor,
      postmarkVariant = "combo",
      postmarkDate,
      className,
      style,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { t } = useTimeEcho();
    const shouldReduceMotion = useReducedMotion();
    const stamp: StampDefinition =
      getStampById(id) || getStampById(DEFAULT_STAMP_ID)!;

    const IconComponent = stamp.component;
    const textConfig =
      size !== "custom" ? TEXT_SIZE_MAP[size] : TEXT_SIZE_MAP.md;

    const localizedDenomination = t(`stamps.items.${stamp.id}.denomination`);
    const denominationText =
      localizedDenomination &&
      !localizedDenomination.startsWith("stamps.items.")
        ? localizedDenomination
        : stamp.denomination;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <motion.div
        ref={ref}
        onClick={handleClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={handleKeyDown}
        initial={
          animateAffix && !shouldReduceMotion
            ? { scale: 1.18, opacity: 0.6, y: -4 }
            : false
        }
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={
          interactive && !shouldReduceMotion
            ? {
                y: -3,
                scale: 1.04,
                rotate: rotation + (rotation >= 0 ? 0.8 : -0.8),
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }
            : undefined
        }
        whileTap={
          interactive && !shouldReduceMotion
            ? {
                scale: 0.96,
                y: 1,
                transition: { duration: 0.1 },
              }
            : undefined
        }
        className={cn(
          "relative inline-block transition-shadow duration-200 outline-hidden select-none",
          interactive &&
            "cursor-pointer focus-visible:ring-2 focus-visible:ring-wax focus-visible:ring-offset-2",
          className,
        )}
        style={{
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          ...style,
        }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <StampPerforationFrame
          size={size}
          paperColor={paperColor}
          borderColor={borderColor || "var(--crease)"}
          innerBorderColor={stamp.primaryColor}
          hasPaperTexture={hasPaperTexture}
          interactive={false}
        >
          <div className="w-full flex justify-between items-center px-1 font-letter uppercase font-semibold text-foreground-muted select-none">
            <span className={cn("leading-none", textConfig.header)}>
              TIME ECHO
            </span>
            <span
              className={cn("leading-none font-bold", textConfig.denomination)}
              style={{ color: stamp.primaryColor }}
            >
              POST
            </span>
          </div>

          <div
            className={cn(
              "flex items-center justify-center p-0.5 my-auto",
              textConfig.iconSize,
            )}
            style={{ color: stamp.primaryColor }}
          >
            <IconComponent className="w-full h-full drop-shadow-xs" />
          </div>

          <div className="w-full text-center px-0.5 border-t border-current/20 pt-0.5 select-none">
            <span
              className={cn(
                "block font-letter font-bold uppercase truncate leading-none",
                textConfig.denomination,
              )}
              style={{ color: stamp.accentColor }}
            >
              {denominationText}
            </span>
          </div>
        </StampPerforationFrame>

        {hasPostmark && (
          <PostmarkOverlay
            variant={postmarkVariant}
            date={postmarkDate}
            rotation={rotation ? rotation * -0.4 : -2.5}
          />
        )}
      </motion.div>
    );
  },
);

Stamp.displayName = "Stamp";
