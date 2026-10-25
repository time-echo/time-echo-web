"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function AirmailBiplaneStamp({ className }: StampIconProps) {
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
      <path d="M10 18H38" />
      <path d="M12 26H36" />
      <line x1="16" y1="18" x2="16" y2="26" />
      <line x1="32" y1="18" x2="32" y2="26" />
      <path d="M8 22H37C39 22 41 21 41 20C41 19 39 18 37 18" />
      <path d="M37 15V25" />
      <path d="M8 18V24L5 25V17L8 18Z" fill="currentColor" fillOpacity="0.2" />
      <circle cx="21" cy="30" r="2" />
      <circle cx="29" cy="30" r="2" />
      <path d="M18 26L21 30" />
      <path d="M32 26L29 30" />
      <path
        d="M6 37C9 35 14 36 17 38C21 36 27 37 31 39C35 37 40 37 43 39"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function PaperPlaneStamp({ className }: StampIconProps) {
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
      <path d="M39 9L9 23L22 28L39 9Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M39 9L27 39L22 28L39 9Z" />
      <path d="M22 28L25 34L27 30" />
      <path
        d="M10 37C7 34 8 29 12 29C15 29 16 32 14 35C12 37 15 40 18 39"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function CarrierPigeonStamp({ className }: StampIconProps) {
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
        d="M12 25C15 22 19 22 23 24L31 16C33 14 36 15 37 17C37 19 35 22 31 25L32 30C32 33 29 35 26 34L17 36L19 30L12 25Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M23 24C23 18 27 12 33 11C31 16 30 20 28 23" />
      <path d="M37 17L42 16" />
      <rect
        x="36"
        y="19"
        width="7"
        height="5"
        rx="0.5"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path d="M36 19L39.5 22L43 19" strokeWidth="0.8" />
      <circle cx="34" cy="16" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function LighthouseStamp({ className }: StampIconProps) {
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
        d="M20 15L17 38H31L28 15H20Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <line x1="19" y1="23" x2="29" y2="23" />
      <line x1="18" y1="31" x2="30" y2="31" />
      <rect x="20" y="10" width="8" height="5" />
      <path d="M19 10H29" />
      <path d="M24 6L20 10H28L24 6Z" fill="currentColor" />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="13"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
      <line
        x1="40"
        y1="12"
        x2="32"
        y2="13"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
      <path d="M11 41C15 39 19 41 24 40C29 39 33 41 37 40" />
      <path d="M8 43C13 42 18 43 23 42C28 41 34 43 40 42" strokeWidth="1" />
    </svg>
  );
}

export function HotAirBalloonStamp({ className }: StampIconProps) {
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
        d="M24 6C16 6 13 13 13 20C13 27 19 32 21 34H27C29 32 35 27 35 20C35 13 32 6 24 6Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M24 6C20 9 19 14 19 20C19 26 21 31 23 34" />
      <path d="M24 6C28 9 29 14 29 20C29 26 27 31 25 34" />
      <line x1="21" y1="34" x2="21" y2="38" />
      <line x1="27" y1="34" x2="27" y2="38" />
      <rect
        x="20"
        y="38"
        width="8"
        height="5"
        rx="1"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <line x1="20" y1="40" x2="28" y2="40" strokeWidth="0.8" />
      <path d="M7 17C9 16 11 17 12 18" strokeWidth="1" />
      <path d="M37 13C39 12 41 13 42 14" strokeWidth="1" />
    </svg>
  );
}
