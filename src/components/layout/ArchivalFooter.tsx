"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export function ArchivalFooter() {
  const { t } = useTimeEcho();

  return (
    <footer className="p-8 bg-manila/50 border-t border-crease text-foreground-muted font-sans">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-xs font-sans-ui">
        <div className="flex items-center gap-2">
          <span>&copy; 2026 TimeEcho. {t("footer.sentWithHope")}</span>
        </div>
        <nav className="flex gap-4 items-center font-sans-ui">
          <Link
            href="/about"
            className="hover:text-wax transition-colors py-1.5"
          >
            {t("footer.about")}
          </Link>
          <Link
            href="/privacy"
            className="hover:text-wax transition-colors py-1.5"
          >
            {t("footer.privacy")}
          </Link>
          <Link
            href="/terms"
            className="hover:text-wax transition-colors py-1.5"
          >
            {t("footer.terms")}
          </Link>
          <span className="font-serif-editorial italic text-foreground-muted/60 hidden sm:inline">
            {t("footer.tagline")}
          </span>
        </nav>
      </div>
    </footer>
  );
}
