"use client";

import React from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

interface SocialAuthButtonsProps {
  purpose?: "login" | "link";
}

export function GoogleMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.63H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.37l4-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l4 3.09C6.23 6.87 8.88 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function FacebookMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07Z"
      />
    </svg>
  );
}

export function SocialAuthButtons({
  purpose = "login",
}: SocialAuthButtonsProps) {
  const { t } = useTimeEcho();
  const suffix = purpose === "link" ? "?purpose=link" : "";

  return (
    <div className="space-y-2.5">
      <a
        href={`/api/auth/oauth/google${suffix}`}
        className="w-full paper-sheet hover:bg-manila/50 text-foreground border border-crease rounded-xs py-2.5 px-4 text-xs font-semibold tracking-wider uppercase font-letter min-h-[44px] transition-colors inline-flex items-center justify-center gap-2.5"
      >
        <GoogleMark />
        <span>{t("login.continueWithGoogle")}</span>
      </a>
      <a
        href={`/api/auth/oauth/facebook${suffix}`}
        className="w-full paper-sheet hover:bg-manila/50 text-foreground border border-crease rounded-xs py-2.5 px-4 text-xs font-semibold tracking-wider uppercase font-letter min-h-[44px] transition-colors inline-flex items-center justify-center gap-2.5"
      >
        <FacebookMark />
        <span>{t("login.continueWithFacebook")}</span>
      </a>
    </div>
  );
}
