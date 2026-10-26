"use client";

import React, { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

export type StampSize = "sm" | "md" | "lg" | "xl" | "custom";

export interface StampPerforationFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: StampSize;
  width?: number;
  height?: number;
  holeRadius?: number;
  holeSpacing?: number;
  paperColor?: string;
  borderColor?: string;
  innerBorderColor?: string;
  hasDoubleBorder?: boolean;
  hasPaperTexture?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

const SIZE_CONFIGS: Record<
  Exclude<StampSize, "custom">,
  {
    className: string;
    width: number;
    height: number;
  }
> = {
  sm: {
    className: "w-12 h-[60px]",
    width: 48,
    height: 60,
  },
  md: {
    className: "w-[72px] h-[90px]",
    width: 72,
    height: 90,
  },
  lg: {
    className: "w-24 h-[120px]",
    width: 96,
    height: 120,
  },
  xl: {
    className: "w-[120px] h-[150px]",
    width: 120,
    height: 150,
  },
};

function generatePerforationPath(
  width: number,
  height: number,
  radius = 2.8,
  corner = 6.5,
  spacing = 12,
): string {
  let path = "M 0 0";

  const availableX = width - 2 * corner;
  const countX = Math.max(1, Math.round(availableX / spacing));
  const stepX = availableX / countX;

  path += ` L ${corner} 0`;
  for (let i = 0; i < countX; i++) {
    const centerX = corner + (i + 0.5) * stepX;
    const startX = centerX - radius;
    const endX = centerX + radius;
    path += ` L ${startX.toFixed(2)} 0`;
    path += ` A ${radius} ${radius} 0 0 1 ${endX.toFixed(2)} 0`;
  }
  path += ` L ${width} 0`;

  const availableY = height - 2 * corner;
  const countY = Math.max(1, Math.round(availableY / spacing));
  const stepY = availableY / countY;

  path += ` L ${width} ${corner}`;
  for (let i = 0; i < countY; i++) {
    const centerY = corner + (i + 0.5) * stepY;
    const startY = centerY - radius;
    const endY = centerY + radius;
    path += ` L ${width} ${startY.toFixed(2)}`;
    path += ` A ${radius} ${radius} 0 0 1 ${width} ${endY.toFixed(2)}`;
  }
  path += ` L ${width} ${height}`;

  path += ` L ${width - corner} ${height}`;
  for (let i = countX - 1; i >= 0; i--) {
    const centerX = corner + (i + 0.5) * stepX;
    const startX = centerX + radius;
    const endX = centerX - radius;
    path += ` L ${startX.toFixed(2)} ${height}`;
    path += ` A ${radius} ${radius} 0 0 1 ${endX.toFixed(2)} ${height}`;
  }
  path += ` L 0 ${height}`;

  path += ` L 0 ${height - corner}`;
  for (let i = countY - 1; i >= 0; i--) {
    const centerY = corner + (i + 0.5) * stepY;
    const startY = centerY + radius;
    const endY = centerY - radius;
    path += ` L 0 ${startY.toFixed(2)}`;
    path += ` A ${radius} ${radius} 0 0 1 0 ${endY.toFixed(2)}`;
  }
  path += " Z";

  return path;
}

const DEFAULT_VIEW_WIDTH = 120;
const DEFAULT_VIEW_HEIGHT = 150;
const DEFAULT_PERFORATION_PATH = generatePerforationPath(
  DEFAULT_VIEW_WIDTH,
  DEFAULT_VIEW_HEIGHT,
);

export const StampPerforationFrame = React.forwardRef<
  HTMLDivElement,
  StampPerforationFrameProps
>(
  (
    {
      size = "md",
      width,
      height,
      holeRadius,
      holeSpacing,
      paperColor,
      borderColor,
      innerBorderColor,
      hasDoubleBorder = true,
      hasPaperTexture = true,
      interactive = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const clipId = useId();
    const textureId = useId();

    const isCustomDimensions =
      size === "custom" &&
      typeof width === "number" &&
      typeof height === "number";

    const viewBoxWidth = isCustomDimensions ? width : DEFAULT_VIEW_WIDTH;
    const viewBoxHeight = isCustomDimensions ? height : DEFAULT_VIEW_HEIGHT;

    const pathData = useMemo(() => {
      if (
        isCustomDimensions ||
        holeRadius !== undefined ||
        holeSpacing !== undefined
      ) {
        return generatePerforationPath(
          viewBoxWidth,
          viewBoxHeight,
          holeRadius,
          6.5,
          holeSpacing,
        );
      }
      return DEFAULT_PERFORATION_PATH;
    }, [
      isCustomDimensions,
      viewBoxWidth,
      viewBoxHeight,
      holeRadius,
      holeSpacing,
    ]);

    const sizeClass = size !== "custom" ? SIZE_CONFIGS[size].className : "";

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-block select-none transition-all duration-200",
          interactive &&
            "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
          sizeClass,
          className,
        )}
        style={{
          width: size === "custom" ? width : undefined,
          height: size === "custom" ? height : undefined,
          ...style,
        }}
        {...props}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full block overflow-visible drop-shadow-[0_1px_3px_rgba(28,31,38,0.12)] drop-shadow-[0_3px_6px_rgba(28,31,38,0.06)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={pathData} />
            </clipPath>
            {hasPaperTexture && (
              <filter id={textureId} x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.04"
                  numOctaves="3"
                  result="noise"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.04 0"
                  result="coloredNoise"
                />
                <feComposite
                  operator="in"
                  in2="SourceGraphic"
                  result="texture"
                />
                <feBlend mode="multiply" in="SourceGraphic" in2="texture" />
              </filter>
            )}
          </defs>

          <path
            d={pathData}
            fill={paperColor || "var(--parchment)"}
            stroke={borderColor || "var(--crease)"}
            strokeWidth="1"
            filter={hasPaperTexture ? `url(#${textureId})` : undefined}
            className="transition-colors duration-150"
          />

          {hasDoubleBorder && (
            <>
              <rect
                x="8"
                y="8"
                width={viewBoxWidth - 16}
                height={viewBoxHeight - 16}
                fill="none"
                stroke={innerBorderColor || "var(--ink)"}
                strokeWidth="1.2"
                className="opacity-50"
              />
              <rect
                x="11"
                y="11"
                width={viewBoxWidth - 22}
                height={viewBoxHeight - 22}
                fill="none"
                stroke={innerBorderColor || "var(--ink)"}
                strokeWidth="0.6"
                className="opacity-30"
              />
            </>
          )}
        </svg>

        <div className="absolute inset-0 p-[10%] flex flex-col items-center justify-between overflow-hidden pointer-events-auto">
          {children}
        </div>
      </div>
    );
  },
);

StampPerforationFrame.displayName = "StampPerforationFrame";
