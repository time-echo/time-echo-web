"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function CherryBlossomStamp({ className }: StampIconProps) {
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
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      <path
        d="M24 21.5C23 15 17 12 19 8C22 10 24 13 24 17C24 13 26 10 29 8C31 12 25 15 24 21.5Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M26.5 24C33 23 36 17 40 19C38 22 35 24 31 24C35 24 38 26 40 29C36 31 33 25 26.5 24Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M24 26.5C25 33 31 36 29 40C26 38 24 35 24 31C24 35 22 38 19 40C17 36 23 33 24 26.5Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M21.5 24C15 25 12 31 8 29C10 26 13 24 17 24C13 24 10 22 8 19C12 17 15 23 21.5 24Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 12C14 10 16 11 15 13C14 15 12 14 12 12Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M34 36C36 34 38 35 37 37C36 39 34 38 34 36Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  );
}

export function CrystalSnowflakeStamp({ className }: StampIconProps) {
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
      <line x1="24" y1="8" x2="24" y2="40" strokeWidth="1.5" />
      <line x1="10" y1="16" x2="38" y2="32" strokeWidth="1.5" />
      <line x1="10" y1="32" x2="38" y2="16" strokeWidth="1.5" />
      <path d="M21 12L24 15L27 12" />
      <path d="M21 36L24 33L27 36" />
      <path d="M13 21L17 20L17 16" />
      <path d="M35 27L31 28L31 32" />
      <path d="M13 27L17 28L17 32" />
      <path d="M35 21L31 20L31 16" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function SummerSunburstStamp({ className }: StampIconProps) {
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
      <circle cx="24" cy="24" r="9" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="9" />
      <path d="M24 6V11" />
      <path d="M24 37V42" />
      <path d="M6 24H11" />
      <path d="M37 24H42" />
      <path d="M11 11L15 15" />
      <path d="M33 33L37 37" />
      <path d="M11 37L15 33" />
      <path d="M33 15L37 11" />
      <path d="M24 22V24" strokeWidth="1.2" />
      <circle cx="21" cy="22" r="1" fill="currentColor" />
      <circle cx="27" cy="22" r="1" fill="currentColor" />
      <path d="M21 26C22.5 27.5 25.5 27.5 27 26" strokeWidth="1.2" />
    </svg>
  );
}
