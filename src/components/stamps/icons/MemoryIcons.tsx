"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StampIconProps {
  className?: string;
}

export function VintageQuillStamp({ className }: StampIconProps) {
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
        d="M38 7C38 7 37 18 29 25L23 31L20 33L21 30L27 24C34 16 38 7 38 7Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M20 33L19 37L22 35" />
      <path d="M29 25C31 22 33 17 34 14" strokeWidth="1" />
      <path d="M26 28C28 26 30 22 31 19" strokeWidth="1" />
      <path
        d="M12 37H17L19 41H10L12 37Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <rect x="11" y="35" width="7" height="2" rx="0.5" />
      <path
        d="M24 39C29 39 31 41 36 39"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
    </svg>
  );
}

export function WaxSealHeartStamp({ className }: StampIconProps) {
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
        d="M24 8C27 7 31 9 33 11C36 12 38 15 39 18C41 21 41 25 39 28C40 31 38 35 35 37C32 39 28 39 25 41C22 41 18 40 16 38C13 37 10 34 9 31C8 28 8 24 9 21C9 18 11 14 14 12C16 9 20 8 24 8Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <circle cx="24" cy="24" r="11" strokeDasharray="1.5 2" strokeWidth="1" />
      <path
        d="M24 30L19.5 25.5C17.5 23.5 17.5 20.5 19.5 18.5C21.5 16.5 24.5 17 24 19.5C23.5 17 26.5 16.5 28.5 18.5C30.5 20.5 30.5 23.5 28.5 25.5L24 30Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PolaroidFrameStamp({ className }: StampIconProps) {
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
        x="11"
        y="9"
        width="26"
        height="31"
        rx="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <rect
        x="15"
        y="13"
        width="18"
        height="17"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M15 26L21 20L27 26L33 21V30H15V26Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="28" cy="17" r="1.5" fill="currentColor" />
      <line x1="16" y1="35" x2="26" y2="35" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function VinylRecordStamp({ className }: StampIconProps) {
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
      <circle cx="24" cy="24" r="16" fill="currentColor" fillOpacity="0.12" />
      <circle cx="24" cy="24" r="12" strokeDasharray="2 3" strokeWidth="1" />
      <circle cx="24" cy="24" r="9" strokeDasharray="1 2.5" strokeWidth="0.8" />
      <circle cx="24" cy="24" r="6" fill="currentColor" fillOpacity="0.3" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" />
      <path
        d="M37 13C40 16 41 20 41 24"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path
        d="M40 10C43 14 44 19 44 24"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

export function SteamingMugStamp({ className }: StampIconProps) {
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
        d="M13 20H31V30C31 34 27 37 22 37C17 37 13 34 13 30V20Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M31 23H34C36 23 37 24.5 37 26.5C37 28.5 36 30 34 30H31" />
      <path d="M10 40H34" />
      <path d="M18 10C17 12 19 14 18 16" strokeWidth="1.2" />
      <path d="M22 8C21 11 23 13 22 16" strokeWidth="1.2" />
      <path d="M26 10C25 12 27 14 26 16" strokeWidth="1.2" />
    </svg>
  );
}
