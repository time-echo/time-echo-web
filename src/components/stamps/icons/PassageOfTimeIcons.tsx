"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function SomethingGrowingStamp({ className }: StampIconProps) {
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
        x="15"
        y="27"
        width="18"
        height="3"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path d="M17 30L19 40H29L31 30" fill="currentColor" fillOpacity="0.18" />
      <ellipse
        cx="24"
        cy="30"
        rx="7"
        ry="1.5"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <path d="M24 30V18" strokeWidth="1.6" />
      <path
        d="M24 23C27 21 31 22 32 25C29 26 26 25 24 23Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M24 18C21 15 16 16 15 19C18 20 22 19 24 18Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M24 18C25 13 28 10 30 11C30 14 27 17 24 18Z"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <circle cx="10" cy="12" r="1.5" strokeDasharray="1.5 2" opacity="0.5" />
      <path
        d="M10 8V6M10 16V18M6 12H4M14 12H16"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M6 42H42"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.4"
      />
    </svg>
  );
}

export function FirstKeyStamp({ className }: StampIconProps) {
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
      <g transform="translate(8, 8)">
        <circle cx="10" cy="10" r="7" fill="currentColor" fillOpacity="0.18" />
        <circle cx="10" cy="10" r="3.5" fill="currentColor" fillOpacity="0.2" />
        <path d="M15 15L31 31" strokeWidth="2.2" />
        <path d="M25 25L28 22" strokeWidth="1.8" />
        <path d="M28 28L31 25" strokeWidth="1.8" />
        <path d="M30 30L33 27" strokeWidth="1.8" />
        <path d="M6 6C3 4 2 8 1 12" strokeWidth="1.2" strokeDasharray="2 2" />
        <path
          d="M7 14C5 17 8 20 10 22"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
      </g>
      <path
        d="M4 41C16 39 32 43 44 41"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <path
        d="M6 44C20 42 28 46 42 44"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />
    </svg>
  );
}

export function OneMoreYearStamp({ className }: StampIconProps) {
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
        rx="16"
        ry="3.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <ellipse cx="24" cy="38" rx="14" ry="2" />
      <path
        d="M13 28V36C13 38 18 39 24 39C30 39 35 38 35 36V28H13Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <ellipse
        cx="24"
        cy="28"
        rx="11"
        ry="3.5"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M13 28C14 29.5 16 29.5 17 28C18 29.5 20 29.5 21 28C22 29.5 24 29.5 25 28C26 29.5 28 29.5 29 28C30 29.5 32 29.5 33 28C34 29.5 35 29 35 28"
        strokeWidth="1.2"
      />
      <rect
        x="23"
        y="16"
        width="2"
        height="9"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <path
        d="M24 15C22 13 23 10 24 8C25 10 26 13 24 15Z"
        fill="currentColor"
        strokeWidth="1"
      />
      <circle cx="16" cy="15" r="0.8" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="14" r="0.8" fill="currentColor" opacity="0.5" />
      <circle cx="29" cy="9" r="0.6" fill="currentColor" opacity="0.5" />
      <circle cx="19" cy="10" r="0.6" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function LittleCompanionStamp({ className }: StampIconProps) {
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
        d="M12 28V36C12 39 16 40 22 40C28 40 32 39 32 36V28H12Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <ellipse cx="22" cy="28" rx="10" ry="2.5" />
      <path
        d="M32 30C34.5 30 35.5 31.5 35.5 33.5C35.5 35.5 34.5 37 32 37"
        strokeWidth="1.2"
      />
      <g transform="translate(14, 12)">
        <path
          d="M8 14C8 10 11 8 13 11C15 14 13 16 8 16Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path
          d="M8 14C8 10 5 8 3 11C1 14 3 16 8 16Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path
          d="M8 13C6 8 10 6 12 7C14 10 10 13 8 13Z"
          fill="currentColor"
          fillOpacity="0.35"
        />
        <path
          d="M8 13C10 8 6 6 4 7C2 10 6 13 8 13Z"
          fill="currentColor"
          fillOpacity="0.35"
        />
        <ellipse
          cx="8"
          cy="8"
          rx="2.5"
          ry="4"
          fill="currentColor"
          fillOpacity="0.4"
        />
      </g>
      <g transform="translate(24, 34)">
        <circle cx="5" cy="5" r="3" strokeWidth="1" />
        <circle cx="13" cy="5" r="3" strokeWidth="1" />
        <line x1="8" y1="5" x2="10" y2="5" strokeWidth="1" />
        <path d="M2 5L0 3" strokeWidth="0.8" />
        <path d="M16 5L18 3" strokeWidth="0.8" />
      </g>
      <path d="M6 42H42" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}
