"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function RainyAfternoonStamp({ className }: StampIconProps) {
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
        x="10"
        y="8"
        width="28"
        height="28"
        rx="1"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <line x1="24" y1="8" x2="24" y2="36" strokeWidth="1.6" />
      <line x1="10" y1="22" x2="38" y2="22" strokeWidth="1.6" />
      <line
        x1="14"
        y1="12"
        x2="16"
        y2="17"
        strokeWidth="1"
        strokeDasharray="1.5 2"
        opacity="0.6"
      />
      <line
        x1="28"
        y1="11"
        x2="31"
        y2="18"
        strokeWidth="1"
        strokeDasharray="1.5 2"
        opacity="0.6"
      />
      <line
        x1="16"
        y1="25"
        x2="19"
        y2="32"
        strokeWidth="1"
        strokeDasharray="1.5 2"
        opacity="0.6"
      />
      <line
        x1="30"
        y1="26"
        x2="33"
        y2="33"
        strokeWidth="1"
        strokeDasharray="1.5 2"
        opacity="0.6"
      />
      <rect
        x="7"
        y="36"
        width="34"
        height="4"
        rx="1"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <rect
        x="29"
        y="30"
        width="4"
        height="6"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M31 30C30 28 32 26 31 24C30 26 32 28 31 30Z"
        fill="currentColor"
      />
      <path d="M7 8C10 14 10 20 8 26" strokeWidth="1.2" />
      <circle cx="13" cy="27" r="0.8" fill="currentColor" opacity="0.7" />
      <circle cx="26" cy="15" r="0.8" fill="currentColor" opacity="0.7" />
      <circle cx="34" cy="29" r="0.8" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function PersonalJournalStamp({ className }: StampIconProps) {
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
        d="M8 12C14 10 20 12 24 14C28 12 34 10 40 12V36C34 34 28 36 24 38C20 36 14 34 8 36V12Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <line x1="24" y1="14" x2="24" y2="38" strokeWidth="1.6" />
      <path d="M12 17C16 16 19 17 21 18" strokeWidth="0.9" opacity="0.6" />
      <path d="M12 22C16 21 19 22 21 23" strokeWidth="0.9" opacity="0.6" />
      <path d="M12 27C16 26 19 27 21 28" strokeWidth="0.9" opacity="0.6" />
      <path d="M12 32C16 31 19 32 21 33" strokeWidth="0.9" opacity="0.6" />
      <path d="M27 18C29 17 32 16 36 17" strokeWidth="0.9" opacity="0.6" />
      <path d="M27 23C29 22 32 21 36 22" strokeWidth="0.9" opacity="0.6" />
      <g transform="translate(30, 24)">
        <path d="M3 11C2 8 4 5 5 2" strokeWidth="1" />
        <circle cx="5" cy="2" r="1.5" fill="currentColor" />
        <ellipse
          cx="3"
          cy="1"
          rx="1.5"
          ry="0.8"
          transform="rotate(-30 3 1)"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <ellipse
          cx="7"
          cy="1"
          rx="1.5"
          ry="0.8"
          transform="rotate(30 7 1)"
          fill="currentColor"
          fillOpacity="0.4"
        />
      </g>
      <g transform="translate(18, 6) rotate(35)">
        <rect
          x="0"
          y="0"
          width="2.5"
          height="24"
          fill="currentColor"
          fillOpacity="0.3"
          strokeWidth="1"
        />
        <polygon points="0,24 1.25,28 2.5,24" fill="currentColor" />
      </g>
    </svg>
  );
}

export function OrdinaryDayStamp({ className }: StampIconProps) {
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
        x="8"
        y="18"
        width="32"
        height="22"
        rx="3"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <line x1="8" y1="24" x2="40" y2="24" strokeWidth="1" />
      <circle cx="24" cy="30" r="7" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="30" r="4.5" />
      <circle cx="24" cy="30" r="1.5" fill="currentColor" />
      <rect
        x="13"
        y="14"
        width="6"
        height="4"
        rx="1"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="33" cy="21" r="1.5" fill="currentColor" />
      <rect x="12" y="21" width="3" height="1.5" rx="0.5" fill="currentColor" />
      <g transform="translate(18, 4)">
        <rect
          x="0"
          y="0"
          width="12"
          height="14"
          rx="1"
          fill="currentColor"
          fillOpacity="0.25"
          strokeWidth="1"
        />
        <rect
          x="1.5"
          y="1.5"
          width="9"
          height="8"
          fill="currentColor"
          fillOpacity="0.4"
          strokeWidth="0.6"
        />
        <path d="M3 8L6 5L9 8" strokeWidth="0.8" />
        <circle cx="8" cy="4" r="0.8" fill="currentColor" />
      </g>
    </svg>
  );
}

export function WorkInProgressStamp({ className }: StampIconProps) {
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
      <ellipse cx="12" cy="35" rx="3" ry="1.5" />
      <path d="M12 35L14 24L10 16" strokeWidth="1.4" />
      <path
        d="M8 16L15 13L16 18L10 19Z"
        fill="currentColor"
        fillOpacity="0.3"
        strokeWidth="1.2"
      />
      <path
        d="M14 18L18 28"
        strokeWidth="0.8"
        strokeDasharray="1.5 2"
        opacity="0.4"
      />
      <path
        d="M20 23L33 23L36 34L17 34Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <rect
        x="16"
        y="34"
        width="22"
        height="2"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <line x1="22" y1="28" x2="31" y2="28" strokeWidth="0.8" opacity="0.5" />
      <g transform="translate(35, 27) rotate(-15)">
        <rect
          x="0"
          y="0"
          width="8"
          height="10"
          rx="0.5"
          fill="currentColor"
          fillOpacity="0.2"
          strokeWidth="1"
        />
        <line x1="0" y1="2" x2="2" y2="2" strokeWidth="0.8" />
        <line x1="0" y1="5" x2="2" y2="5" strokeWidth="0.8" />
        <line x1="0" y1="8" x2="2" y2="8" strokeWidth="0.8" />
      </g>
      <path d="M4 36H44" strokeWidth="1.4" />
    </svg>
  );
}
