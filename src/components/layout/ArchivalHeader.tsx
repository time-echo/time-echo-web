"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Globe, Mail, LogIn } from "lucide-react";

export function ArchivalHeader() {
  const { locale, toggleLocale, capsules } = useTimeEcho();
  const isEs = locale === "es";
  const hasLetters = capsules.length > 0;

  return (
    <header className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-crease/60 font-sans-ui select-none">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center text-xl sm:text-2xl font-serif-editorial italic text-foreground tracking-tight font-semibold shrink-0"
        >
          <span>TimeEcho</span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-6 md:gap-8 text-xs sm:text-sm font-medium font-sans-ui shrink-0">
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1 sm:gap-1.5 text-foreground-muted hover:text-wax transition-colors cursor-pointer bg-transparent border-none p-1 sm:p-0 hover:scale-[1.02] active:scale-[0.98] font-sans-ui shrink-0"
            aria-label={
              isEs ? "Switch language to English" : "Cambiar idioma a español"
            }
          >
            <Globe size={16} />
            <span className="text-xs sm:text-sm">{isEs ? "ES" : "EN"}</span>
          </button>

          <div className="hidden sm:block h-5 w-px bg-crease" />

          <Link
            href="/#how-it-works"
            className="hidden sm:block text-foreground-muted hover:text-wax transition-colors whitespace-nowrap"
          >
            {isEs ? "Cómo funciona" : "How It Works"}
          </Link>

          {hasLetters ? (
            <Link
              href="/dashboard"
              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase border-none cursor-pointer font-letter shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <Mail size={14} />
              <span>{isEs ? "Mis Cartas" : "Vault"}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase border-none cursor-pointer font-letter shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <LogIn size={14} />
              <span>{isEs ? "Iniciar Sesión" : "Sign In"}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
