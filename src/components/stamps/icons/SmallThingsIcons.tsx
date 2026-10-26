"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function MorningCoffeeStamp({ className }: StampIconProps) {
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
        d="M6 10L14 4"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.6"
      />
      <path
        d="M10 14L18 8"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.6"
      />
      <ellipse
        cx="23"
        cy="40"
        rx="17"
        ry="3.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M14 22V32C14 36 17 38 23 38C29 38 32 36 32 32V22H14Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <ellipse cx="23" cy="22" rx="9" ry="2.5" />
      <path d="M32 24C35.5 24 37 26 37 28.5C37 31 35 33 32 33.5" />
      <path d="M20 17C19 14 21 12 20 9" strokeWidth="1.2" />
      <path d="M24 16C23 13 25 11 24 8" strokeWidth="1.2" />
      <path d="M28 17C27 14 29 12 28 9" strokeWidth="1.2" />
      <ellipse
        cx="36"
        cy="38"
        rx="2"
        ry="1.2"
        transform="rotate(-25 36 38)"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <ellipse
        cx="10"
        cy="39"
        rx="1.8"
        ry="1"
        transform="rotate(30 10 39)"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path d="M4 42H44" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

export function TodaySongStamp({ className }: StampIconProps) {
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
        x="9"
        y="18"
        width="30"
        height="20"
        rx="2"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <rect x="13" y="22" width="22" height="10" rx="1" />
      <circle cx="19" cy="27" r="3.2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="29" cy="27" r="3.2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="19" cy="27" r="1.2" fill="currentColor" />
      <circle cx="29" cy="27" r="1.2" fill="currentColor" />
      <path d="M19 30H29" strokeWidth="1" />
      <path d="M15 35H33" strokeWidth="0.9" strokeDasharray="1.5 1.5" />
      <path
        d="M12 20C12 11 36 11 36 20"
        strokeWidth="1.4"
        strokeDasharray="34"
      />
      <rect
        x="8"
        y="19"
        width="4"
        height="7"
        rx="2"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <rect
        x="36"
        y="19"
        width="4"
        height="7"
        rx="2"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path d="M24 10V6M22 6H26" strokeWidth="1" />
      <path d="M6 32C4 32 4 36 6 36" strokeWidth="1" />
      <path d="M42 32C44 32 44 36 42 36" strokeWidth="1" />
    </svg>
  );
}

export function HomeCookedMealStamp({ className }: StampIconProps) {
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
      <ellipse
        cx="24"
        cy="38"
        rx="19"
        ry="5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M11 26C11 34 16 37 24 37C32 37 37 34 37 26H11Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <ellipse cx="24" cy="26" rx="13" ry="4" />
      <ellipse
        cx="24"
        cy="26"
        rx="10"
        ry="2.5"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path d="M20 20C19 17 21 15 20 12" strokeWidth="1.2" />
      <path d="M24 19C23 16 25 14 24 11" strokeWidth="1.2" />
      <path d="M28 20C27 17 29 15 28 12" strokeWidth="1.2" />
      <path d="M37 28L42 22C43 21 44 22 43 23L38 31" strokeWidth="1.3" />
      <path
        d="M7 29C6 31 8 36 12 36C14 36 14 33 13 31C11 27 8 28 7 29Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M9 30L11 34" strokeWidth="1" />
      <path d="M5 43H43" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

export function TodaysStepsStamp({ className }: StampIconProps) {
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
        x="5"
        y="38"
        width="38"
        height="5"
        rx="1"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path d="M8 40H40" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <g transform="translate(10, 16)">
        <path
          d="M3 18C3 13 7 11 9 11L12 15L16 16C19 17 20 19 20 22H1C1 20 2 19 3 18Z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <rect x="1" y="21" width="19" height="2.5" rx="1" />
        <path d="M7 14L10 17" strokeWidth="1.1" />
        <path d="M9 12L12 15" strokeWidth="1.1" />
        <circle cx="17" cy="19" r="1.5" fill="currentColor" fillOpacity="0.3" />
      </g>
      <g transform="translate(23, 14)">
        <path
          d="M3 18C3 13 7 11 9 11L12 15L16 16C19 17 20 19 20 22H1C1 20 2 19 3 18Z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <rect x="1" y="21" width="19" height="2.5" rx="1" />
        <path d="M7 14L10 17" strokeWidth="1.1" />
        <path d="M9 12L12 15" strokeWidth="1.1" />
        <circle cx="17" cy="19" r="1.5" fill="currentColor" fillOpacity="0.3" />
      </g>
      <path d="M24 6V11" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <path d="M22 8L24 6L26 8" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function FiveMoreMinutesStamp({ className }: StampIconProps) {
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
      <circle cx="24" cy="22" r="12" fill="currentColor" fillOpacity="0.15" />
      <circle cx="24" cy="22" r="10" />
      <path d="M24 16V22L28 24" strokeWidth="1.6" />
      <circle cx="24" cy="22" r="1.2" fill="currentColor" />
      <path d="M15 11C13 13 13 16 14 17" strokeWidth="1.8" />
      <path d="M33 11C35 13 35 16 34 17" strokeWidth="1.8" />
      <path d="M24 9V7" strokeWidth="1.5" />
      <path d="M21 7H27" strokeWidth="1.5" />
      <path d="M17 32L15 35" strokeWidth="1.8" />
      <path d="M31 32L33 35" strokeWidth="1.8" />
      <g transform="translate(10, 36)">
        <path
          d="M2 5C2 2 6 2 9 4C12 5 14 5 14 7H0C0 6 1 5 2 5Z"
          fill="currentColor"
          fillOpacity="0.22"
        />
        <path d="M0 7H14" strokeWidth="1.3" />
      </g>
      <g transform="translate(26, 36)">
        <path
          d="M2 5C2 2 6 2 9 4C12 5 14 5 14 7H0C0 6 1 5 2 5Z"
          fill="currentColor"
          fillOpacity="0.22"
        />
        <path d="M0 7H14" strokeWidth="1.3" />
      </g>
      <path d="M8 20C6 19 6 23 8 22" strokeWidth="1" opacity="0.6" />
      <path d="M40 20C42 19 42 23 40 22" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function TodaysListStamp({ className }: StampIconProps) {
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
        d="M12 7H34C35.1 7 36 7.9 36 9V39C36 40.1 35.1 41 34 41H12C10.9 41 10 40.1 10 39V9C10 7.9 10.9 7 12 7Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M10 12H36" strokeWidth="0.8" opacity="0.5" />
      <rect x="14" y="16" width="3.5" height="3.5" rx="0.5" />
      <path d="M14.5 17.5L16 19L19.5 15" strokeWidth="1.2" />
      <path d="M20 18H31" strokeWidth="1.2" />
      <rect x="14" y="23" width="3.5" height="3.5" rx="0.5" />
      <path d="M14.5 24.5L16 26L19.5 22" strokeWidth="1.2" />
      <path d="M20 25H29" strokeWidth="1.2" />
      <rect x="14" y="30" width="3.5" height="3.5" rx="0.5" />
      <path d="M20 32H32" strokeWidth="1.2" strokeDasharray="1.5 2" />
      <g transform="translate(30, 24) rotate(42)">
        <rect
          x="0"
          y="0"
          width="3"
          height="15"
          fill="currentColor"
          fillOpacity="0.25"
          strokeWidth="1"
        />
        <polygon points="0,15 1.5,19 3,15" fill="currentColor" />
        <line x1="0" y1="3" x2="3" y2="3" strokeWidth="1" />
      </g>
    </svg>
  );
}
