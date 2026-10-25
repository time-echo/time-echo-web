"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Globe, Mail, LogIn } from "lucide-react";

export function ArchivalHeader() {
  const pathname = usePathname();
  const { locale, toggleLocale, capsules, t } = useTimeEcho();
  const hasLetters = capsules.length > 0;

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", "/#how-it-works");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-crease/60 font-sans-ui select-none">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center text-xl sm:text-2xl font-serif-editorial italic text-foreground tracking-tight font-semibold shrink-0"
        >
          <span>TimeEcho</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm font-medium font-sans-ui shrink-0">
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1.5 border border-crease hover:border-wax/60 rounded-xs px-3 py-2 text-xs font-letter transition-colors cursor-pointer bg-parchment/60 hover:bg-manila/40 shrink-0 min-h-[44px]"
            aria-label={t("header.switchLanguage")}
          >
            <Globe size={14} className="text-foreground-muted shrink-0" />
            <span
              className={
                locale === "es"
                  ? "text-wax font-bold"
                  : "text-foreground-muted/60 font-medium"
              }
            >
              ES
            </span>
            <span className="text-crease font-mono text-xs">/</span>
            <span
              className={
                locale !== "es"
                  ? "text-wax font-bold"
                  : "text-foreground-muted/60 font-medium"
              }
            >
              EN
            </span>
          </button>

          <div className="hidden sm:block h-5 w-px bg-crease" />

          <Link
            href="/#how-it-works"
            onClick={handleHowItWorksClick}
            className="hidden sm:block text-foreground-muted hover:text-wax transition-colors whitespace-nowrap"
          >
            {t("header.howItWorks")}
          </Link>

          {hasLetters ? (
            <Link
              href="/dashboard"
              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase border-none cursor-pointer font-letter shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <Mail size={14} />
              <span>{t("header.myLetters")}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase border-none cursor-pointer font-letter shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <LogIn size={14} />
              <span>{t("header.signIn")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
