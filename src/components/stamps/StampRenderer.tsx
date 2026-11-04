"use client";

import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

/**
 * Strict whitelist configuration for dynamic SVG sanitization
 * based on System Design v2.0 (Figure 3).
 */
export const SVG_PURIFY_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: false },
  ALLOWED_TAGS: [
    "svg",
    "g",
    "path",
    "rect",
    "circle",
    "ellipse",
    "line",
    "polyline",
    "polygon",
    "defs",
    "mask",
    "clipPath",
    "linearGradient",
    "radialGradient",
    "stop",
  ],
  ALLOWED_ATTR: [
    "viewBox",
    "width",
    "height",
    "fill",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-dasharray",
    "stroke-dashoffset",
    "opacity",
    "fill-opacity",
    "stroke-opacity",
    "transform",
    "d",
    "x",
    "y",
    "r",
    "rx",
    "ry",
    "cx",
    "cy",
    "x1",
    "y1",
    "x2",
    "y2",
    "points",
    "id",
    "gradientUnits",
    "gradientTransform",
    "offset",
    "stop-color",
    "stop-opacity",
    "mask",
    "clip-path",
    "fill-rule",
    "clip-rule",
    "xmlns",
  ],
  FORBID_TAGS: [
    "script",
    "foreignObject",
    "iframe",
    "audio",
    "video",
    "style",
    "object",
    "embed",
    "link",
  ],
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "onblur",
  ],
  ALLOW_DATA_ATTR: false,
};

/**
 * Cleanly sanitize an SVG string using DOMPurify.
 * Safe for SSR environments where window is undefined.
 */
export function sanitizeSvg(svgContent: string): string {
  if (!svgContent) return "";
  if (
    typeof window === "undefined" ||
    typeof DOMPurify.sanitize !== "function"
  ) {
    return "";
  }
  return DOMPurify.sanitize(svgContent, SVG_PURIFY_CONFIG);
}

export interface StampRendererProps extends React.HTMLAttributes<HTMLSpanElement> {
  svgContent: string;
  ariaLabel?: string;
}

export const StampRenderer = React.forwardRef<
  HTMLSpanElement,
  StampRendererProps
>(({ svgContent, ariaLabel, className, ...props }, ref) => {
  const sanitized = useMemo(() => sanitizeSvg(svgContent), [svgContent]);

  return (
    <span
      ref={ref}
      suppressHydrationWarning
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel ? true : undefined}
      className={cn(
        "inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...props}
    />
  );
});

StampRenderer.displayName = "StampRenderer";
