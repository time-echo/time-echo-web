"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function LittleHomeStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="10,21 24,9 38,21"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <rect
        x="29"
        y="8"
        width="4"
        height="7"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M31 6C31 4 33 4 33 2" strokeWidth="1" strokeDasharray="1.5 2" />
      <rect
        x="13"
        y="21"
        width="22"
        height="18"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <rect
        x="21"
        y="27"
        width="6"
        height="12"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <circle cx="25.5" cy="33" r="0.6" fill="currentColor" />
      <rect x="15" y="24" width="4" height="5" />
      <line x1="17" y1="24" x2="17" y2="29" strokeWidth="0.8" />
      <line x1="15" y1="26.5" x2="19" y2="26.5" strokeWidth="0.8" />
      <rect x="29" y="24" width="4" height="5" />
      <line x1="31" y1="24" x2="31" y2="29" strokeWidth="0.8" />
      <line x1="29" y1="26.5" x2="33" y2="26.5" strokeWidth="0.8" />
      <path
        d="M7 23C7 19 12 18 12 21C12 24 7 24 7 23Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <line x1="9.5" y1="23" x2="9.5" y2="39" strokeWidth="1.2" />
      <path
        d="M36 29C38 29 44 27 44 27"
        strokeWidth="0.9"
        strokeDasharray="1.5 1.5"
      />
      <path d="M38 28.5L39 33" strokeWidth="1" />
      <path d="M41 28L42 32" strokeWidth="1" />
      <path d="M4 39H44" strokeWidth="1.4" />
      <circle cx="17" cy="37" r="1.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="31" cy="37" r="1.5" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

export function NeighborhoodCornerStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6"
        y="8"
        width="36"
        height="10"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M6 18L10 12M12 18L16 12M18 18L22 12M24 18L28 12M30 18L34 12M36 18L40 12"
        strokeWidth="1"
      />
      <path
        d="M6 18C8 19.5 10 19.5 12 18C14 19.5 16 19.5 18 18C20 19.5 22 19.5 24 18C26 19.5 28 19.5 30 18C32 19.5 34 19.5 36 18C38 19.5 40 19.5 42 18"
        strokeWidth="1"
      />
      <rect
        x="10"
        y="20"
        width="12"
        height="12"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <line x1="16" y1="20" x2="16" y2="32" strokeWidth="0.8" />
      <line x1="10" y1="26" x2="22" y2="26" strokeWidth="0.8" />
      <g transform="translate(18, 25)">
        <circle cx="6" cy="11" r="5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="20" cy="11" r="5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="6" cy="11" r="1.2" fill="currentColor" />
        <circle cx="20" cy="11" r="1.2" fill="currentColor" />
        <path d="M6 11L11 6L16 11H6Z" strokeWidth="1.2" />
        <path d="M11 6L11 3M9 3H13" strokeWidth="1.2" />
        <path d="M16 11L18 4" strokeWidth="1.2" />
        <path d="M17 4H20" strokeWidth="1.3" />
        <rect
          x="19"
          y="3"
          width="4"
          height="3"
          rx="0.5"
          strokeWidth="0.9"
          fill="currentColor"
          fillOpacity="0.3"
        />
      </g>
      <path d="M4 42H44" strokeWidth="1.4" />
    </svg>
  );
}

export function WayHomeStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 16L30 14L32 18L10 20Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <line x1="12" y1="20" x2="12" y2="38" strokeWidth="1.4" />
      <line x1="28" y1="18" x2="28" y2="38" strokeWidth="1.4" />
      <rect
        x="14"
        y="28"
        width="12"
        height="2"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <line x1="16" y1="30" x2="16" y2="38" strokeWidth="1.1" />
      <line x1="24" y1="30" x2="24" y2="38" strokeWidth="1.1" />
      <rect x="15" y="21" width="6" height="5" rx="0.5" strokeWidth="0.9" />
      <line x1="36" y1="8" x2="36" y2="38" strokeWidth="1.4" />
      <path d="M36 10C36 8 39 7 40 9C41 10 40 12 36 12" strokeWidth="1.3" />
      <circle cx="39" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M37 13L42 22"
        strokeWidth="0.8"
        strokeDasharray="1.5 2"
        opacity="0.4"
      />
      <path d="M4 38H44" strokeWidth="1.4" />
      <path d="M4 42H44" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

export function FavoriteSpotStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10H40V16C40 18 8 18 8 16V10Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 10V16M16 10V16M20 10V16M24 10V16M28 10V16M32 10V16M36 10V16"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <rect
        x="10"
        y="18"
        width="16"
        height="14"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <line x1="10" y1="24" x2="26" y2="24" strokeWidth="0.8" />
      <line x1="18" y1="18" x2="18" y2="32" strokeWidth="0.8" />
      <path d="M12 28L15 26L16 28" strokeWidth="1" />
      <path d="M20 28C21 26 23 26 24 28" strokeWidth="1" />
      <rect
        x="29"
        y="18"
        width="10"
        height="20"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="37" cy="28" r="0.8" fill="currentColor" />
      <rect x="31" y="21" width="6" height="6" strokeWidth="0.9" />
      <g transform="translate(6, 32)">
        <ellipse
          cx="6"
          cy="4"
          rx="4"
          ry="1.2"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <line x1="6" y1="4" x2="6" y2="8" strokeWidth="1" />
        <line x1="4" y1="8" x2="8" y2="8" strokeWidth="1" />
      </g>
      <path d="M4 39H44" strokeWidth="1.4" />
      <path d="M15 14H21" strokeWidth="1" />
    </svg>
  );
}
