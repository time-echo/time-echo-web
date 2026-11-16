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
  ref?: React.Ref<HTMLDivElement>;
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

  const topWidth = width - 2 * corner;
  const numTopHoles = Math.max(1, Math.round(topWidth / spacing));
  const topStep = topWidth / numTopHoles;

  path = `M ${corner} 0`;
  for (let i = 0; i < numTopHoles; i++) {
    const holeCenter = corner + (i + 0.5) * topStep;
    path += ` L ${holeCenter - radius} 0`;
    path += ` A ${radius} ${radius} 0 0 0 ${holeCenter + radius} 0`;
  }
  path += ` L ${width} 0`;

  const rightHeight = height - 2 * corner;
  const numRightHoles = Math.max(1, Math.round(rightHeight / spacing));
  const rightStep = rightHeight / numRightHoles;

  for (let i = 0; i < numRightHoles; i++) {
    const holeCenter = corner + (i + 0.5) * rightStep;
    path += ` L ${width} ${holeCenter - radius}`;
    path += ` A ${radius} ${radius} 0 0 0 ${width} ${holeCenter + radius}`;
  }
  path += ` L ${width} ${height}`;

  const bottomWidth = width - 2 * corner;
  const numBottomHoles = Math.max(1, Math.round(bottomWidth / spacing));
  const bottomStep = bottomWidth / numBottomHoles;

  for (let i = 0; i < numBottomHoles; i++) {
    const holeCenter = width - corner - (i + 0.5) * bottomStep;
    path += ` L ${holeCenter + radius} ${height}`;
    path += ` A ${radius} ${radius} 0 0 0 ${holeCenter - radius} ${height}`;
  }
  path += ` L 0 ${height}`;

  const leftHeight = height - 2 * corner;
  const numLeftHoles = Math.max(1, Math.round(leftHeight / spacing));
  const leftStep = leftHeight / numLeftHoles;

  for (let i = 0; i < numLeftHoles; i++) {
    const holeCenter = height - corner - (i + 0.5) * leftStep;
    path += ` L 0 ${holeCenter + radius}`;
    path += ` A ${radius} ${radius} 0 0 0 0 ${holeCenter - radius}`;
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

export function StampPerforationFrame({
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
  ref,
  ...props
}: StampPerforationFrameProps) {
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
    holeRadius,
    holeSpacing,
    viewBoxWidth,
    viewBoxHeight,
  ]);

  const sizeClass = size !== "custom" ? SIZE_CONFIGS[size].className : "";

  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-block select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]",
        interactive &&
          "cursor-pointer hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-200",
        sizeClass,
        className,
      )}
      style={
        isCustomDimensions
          ? { width: `${width}px`, height: `${height}px`, ...style }
          : style
      }
      {...props}
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full block pointer-events-none"
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
                values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.05 0"
              />
              <feBlend mode="multiply" in="SourceGraphic" />
            </filter>
          )}
        </defs>

        <path
          d={pathData}
          fill={paperColor || "var(--parchment)"}
          filter={hasPaperTexture ? `url(#${textureId})` : undefined}
          stroke={borderColor || "var(--manila-border)"}
          strokeWidth="0.8"
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
}
