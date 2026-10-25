"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function HourglassStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 9H34" />
      <path d="M14 39H34" />
      <path d="M17 9V14C17 18 21 21 24 24C27 21 31 18 31 14V9" />
      <path d="M17 39V34C17 30 21 27 24 24C27 27 31 30 31 34V39" />
      <path d="M24 24V32" strokeDasharray="1.5 1.5" />
      <path
        d="M20 37C21.5 35.5 26.5 35.5 28 37H20Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <circle cx="37" cy="14" r="1" fill="currentColor" />
      <circle cx="11" cy="33" r="1" fill="currentColor" />
    </svg>
  );
}

export function PocketWatchStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 7C20 4.5 28 4.5 28 7" />
      <rect
        x="22"
        y="7"
        width="4"
        height="4"
        rx="1"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="24" cy="27" r="14" />
      <circle cx="24" cy="27" r="11" strokeDasharray="1 3" strokeWidth="1" />
      <line x1="24" y1="17" x2="24" y2="19" />
      <line x1="24" y1="35" x2="24" y2="37" />
      <line x1="14" y1="27" x2="16" y2="27" />
      <line x1="32" y1="27" x2="34" y2="27" />
      <path d="M24 27L20 22" />
      <path d="M24 27L29 20" />
      <circle cx="24" cy="27" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CrescentDreamsStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29 11C20.5 12.5 18 21 21 28C24 35 32 36 35 34C24 33 22 20 29 11Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M12 37C12 34 14.5 32 17.5 33C19.5 30 24 30 26.5 32.5C29 31 33 32 34 35C36 35 38 36.5 38 38.5C38 40.5 36 41 34 41H14C12 41 12 39 12 37Z" />
      <path
        d="M14 16L15.5 19L18.5 20.5L15.5 22L14 25L12.5 22L9.5 20.5L12.5 19Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="34" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function SolarAlignmentStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="10" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="6" fill="currentColor" />
      <path d="M24 7V11" />
      <path d="M24 37V41" />
      <path d="M7 24H11" />
      <path d="M37 24H41" />
      <path d="M12 12L15 15" />
      <path d="M33 33L36 36" />
      <path d="M12 36L15 33" />
      <path d="M33 15L36 12" />
      <circle cx="24" cy="24" r="14" strokeDasharray="2 3" strokeWidth="1" />
    </svg>
  );
}

export function ConstellationStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="17" strokeWidth="1" strokeDasharray="1 3" />
      <line
        x1="24"
        y1="5"
        x2="24"
        y2="43"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      <line
        x1="5"
        y1="24"
        x2="43"
        y2="24"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      <path
        d="M12 31L18 27L24 29L30 22L36 15L33 11"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
      <circle cx="12" cy="31" r="1.5" fill="currentColor" />
      <circle cx="18" cy="27" r="1.5" fill="currentColor" />
      <circle cx="24" cy="29" r="1.5" fill="currentColor" />
      <circle cx="30" cy="22" r="1.5" fill="currentColor" />
      <path
        d="M36 10L37.5 13.5L41 15L37.5 16.5L36 20L34.5 16.5L31 15L34.5 13.5Z"
        fill="currentColor"
      />
      <circle cx="16" cy="14" r="1" fill="currentColor" />
      <circle cx="33" cy="35" r="1" fill="currentColor" />
    </svg>
  );
}

export function TimeCapsuleStamp({ className }: StampIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="17"
        y="10"
        width="14"
        height="28"
        rx="7"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <line x1="17" y1="17" x2="31" y2="17" />
      <line x1="17" y1="31" x2="31" y2="31" />
      <rect
        x="20"
        y="21"
        width="8"
        height="6"
        rx="1.5"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <line x1="22" y1="24" x2="26" y2="24" strokeWidth="1" />
      <circle cx="24" cy="13.5" r="1" fill="currentColor" />
      <circle cx="24" cy="34.5" r="1" fill="currentColor" />
      <path d="M11 20C11 16 13 14 15 13" strokeWidth="1" />
      <path d="M37 28C37 32 35 34 33 35" strokeWidth="1" />
    </svg>
  );
}
