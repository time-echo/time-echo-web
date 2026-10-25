"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StampPerforationFrame, type StampSize } from "./StampPerforationFrame";
import { PostmarkOverlay } from "./PostmarkOverlay";
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
      rotation,
      hasPostmark = false,
      interactive = false,
      selected = false,
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
    const stamp: StampDefinition =
      getStampById(id) || getStampById(DEFAULT_STAMP_ID)!;

    const IconComponent = stamp.component;
    const textConfig =
      size !== "custom" ? TEXT_SIZE_MAP[size] : TEXT_SIZE_MAP.md;

    return (
      <div
        ref={ref}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={cn(
          "relative inline-block transition-transform duration-200 outline-hidden",
          interactive &&
            "cursor-pointer hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-wax focus-visible:ring-offset-2",
          selected && "ring-2 ring-wax ring-offset-2 rounded-xs shadow-md",
          className,
        )}
        style={{
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          ...style,
        }}
        {...props}
      >
        <StampPerforationFrame
          size={size}
          paperColor={paperColor}
          borderColor={selected ? "var(--wax)" : borderColor || "var(--crease)"}
          innerBorderColor={selected ? "var(--wax)" : stamp.primaryColor}
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
              {stamp.denomination}
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
      </div>
    );
  },
);

Stamp.displayName = "Stamp";
