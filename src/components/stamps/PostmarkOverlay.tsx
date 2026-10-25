"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export type PostmarkVariant = "waves" | "circular" | "combo";

export interface PostmarkOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PostmarkVariant;
  inkColor?: "ink" | "wax" | "muted" | string;
  rotation?: number;
  date?: string;
  postmarkText?: string;
  linesCount?: number;
  className?: string;
}

const INK_COLOR_CLASSES: Record<"ink" | "wax" | "muted", string> = {
  ink: "text-ink",
  wax: "text-wax",
  muted: "text-foreground-muted",
};

function generateWaveDPath(
  startX: number,
  y: number,
  length: number,
  waveLength = 28,
  amplitude = 3.2,
): string {
  let path = `M ${startX} ${y}`;
  const segments = Math.ceil(length / waveLength);

  for (let i = 0; i < segments; i++) {
    const x0 = startX + i * waveLength;
    const cp1x = x0 + waveLength / 3;
    const cp1y = y - amplitude;
    const cp2x = x0 + (2 * waveLength) / 3;
    const cp2y = y + amplitude;
    const endX = x0 + waveLength;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${y}`;
  }

  return path;
}

export const PostmarkOverlay = React.forwardRef<
  HTMLDivElement,
  PostmarkOverlayProps
>(
  (
    {
      variant = "waves",
      inkColor = "ink",
      rotation = -3,
      date = "2026",
      postmarkText = "TIME ECHO POST",
      linesCount = 4,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isNamedColor =
      inkColor === "ink" || inkColor === "wax" || inkColor === "muted";
    const colorClass = isNamedColor ? INK_COLOR_CLASSES[inkColor] : "";
    const customColor = !isNamedColor ? inkColor : undefined;

    const wavePaths = useMemo(() => {
      const paths: string[] = [];
      const lineSpacing = 7;
      const startY = 12;

      for (let i = 0; i < linesCount; i++) {
        const currentY = startY + i * lineSpacing;
        const startX = variant === "combo" ? 44 : 0;
        const length = variant === "combo" ? 80 : 120;
        paths.push(generateWaveDPath(startX, currentY, length, 26, 3));
      }

      return paths;
    }, [linesCount, variant]);

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 pointer-events-none select-none z-10 transition-transform duration-200 opacity-80 mix-blend-multiply dark:mix-blend-screen",
          colorClass,
          className,
        )}
        style={{
          transform: `rotate(${rotation}deg)`,
          color: customColor,
          ...style,
        }}
        {...props}
      >
        <svg
          viewBox="0 0 120 60"
          className="w-full h-full block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {(variant === "circular" || variant === "combo") && (
            <g transform="translate(24, 28)">
              <circle
                r="22"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="3 1.5"
              />
              <circle r="19" stroke="currentColor" strokeWidth="0.6" />

              <text
                textAnchor="middle"
                y="-7"
                fill="currentColor"
                className="font-letter text-[5px] font-bold tracking-widest uppercase"
              >
                {postmarkText}
              </text>

              <line
                x1="-14"
                y1="-2"
                x2="14"
                y2="-2"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <text
                textAnchor="middle"
                y="5"
                fill="currentColor"
                className="font-letter text-[6px] font-bold tracking-wider"
              >
                {date}
              </text>
              <line
                x1="-14"
                y1="8"
                x2="14"
                y2="8"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </g>
          )}

          {(variant === "waves" || variant === "combo") && (
            <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              {wavePaths.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>
          )}
        </svg>
      </div>
    );
  },
);

PostmarkOverlay.displayName = "PostmarkOverlay";
