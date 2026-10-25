"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function SproutSeedlingStamp({ className }: StampIconProps) {
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
      <path d="M11 39C14 36 20 35 24 35C28 35 34 36 37 39" strokeWidth="1.5" />
      <path d="M24 35V20" />
      <path
        d="M24 20C24 13 15 12 15 19C15 22 19 23 24 20Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M24 17C24 10 33 9 33 16C33 19 29 20 24 17Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <circle cx="29" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function GinkgoLeafStamp({ className }: StampIconProps) {
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
        d="M24 38C24 32 23 27 24 24C17 21 12 16 14 11C18 7 22 10 24 14C26 10 30 7 34 11C36 16 31 21 24 24"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M24 38C24 33 22 28 24 24" />
      <path d="M24 24L17 14" strokeWidth="1" strokeDasharray="1 2" />
      <path d="M24 24L31 14" strokeWidth="1" strokeDasharray="1 2" />
      <path d="M24 24L24 15" strokeWidth="1" strokeDasharray="1 2" />
      <circle cx="10" cy="28" r="1" fill="currentColor" />
      <circle cx="38" cy="26" r="1" fill="currentColor" />
    </svg>
  );
}

export function MountainPeakStamp({ className }: StampIconProps) {
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
      <circle
        cx="34"
        cy="14"
        r="5"
        fill="currentColor"
        fillOpacity="0.15"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path d="M21 14L8 37H34L21 14Z" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M21 14L16 23L20 26L21 22L24 25L26 21L21 14Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path d="M31 21L24 37H42L31 21Z" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M31 21L28 27L31 29L34 26L31 21Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <line x1="6" y1="37" x2="42" y2="37" />
    </svg>
  );
}

export function AntiqueKeyStamp({ className }: StampIconProps) {
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
      <circle cx="17" cy="17" r="7" fill="currentColor" fillOpacity="0.15" />
      <circle cx="17" cy="17" r="3" />
      <path d="M22 22L36 36" strokeWidth="2" />
      <path d="M33 33L36 30" strokeWidth="1.5" />
      <path d="M36 36L40 32" strokeWidth="1.5" />
      <path d="M38 38L39 37" strokeWidth="1.5" />
      <path
        d="M12 24C11 27 12 30 15 31"
        strokeWidth="1"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}

export function CompassRoseStamp({ className }: StampIconProps) {
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
      <circle cx="24" cy="24" r="16" strokeDasharray="2 2" strokeWidth="1" />
      <circle cx="24" cy="24" r="14" strokeWidth="0.8" />
      <path d="M24 7L27 21L24 24L21 21Z" fill="currentColor" />
      <path
        d="M24 41L21 27L24 24L27 27Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M41 24L27 27L24 24L27 21Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M7 24L21 21L24 24L21 27Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
      <text
        x="24"
        y="6"
        textAnchor="middle"
        fill="currentColor"
        className="text-[4px] font-letter font-bold"
      >
        N
      </text>
    </svg>
  );
}
