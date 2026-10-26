"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { ArchivalHeader } from "./ArchivalHeader";
import { ArchivalFooter } from "./ArchivalFooter";
import {
  Globe,
  PenTool,
  Mail,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, toggleLocale, t } = useTimeEcho();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTimeline = searchParams.get("timeline") === "true";
  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/check_email" ||
    pathname === "/about" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    pathname.startsWith("/letters/success");

  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment text-foreground font-ui">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-xs focus:bg-wax focus:px-4 focus:py-2.5 focus:font-letter focus:text-xs focus:font-semibold focus:uppercase focus:tracking-wider focus:text-on-wax"
        >
          {t("common.skipToContent")}
        </a>
        <ArchivalHeader />
        <main
          id="main-content"
          className="flex-grow max-w-6xl mx-auto px-4 md:px-6 py-10 w-full font-ui"
        >
          {children}
        </main>
        <ArchivalFooter />
      </div>
    );
  }

  const isWriteActive = pathname === "/letters/new";
  const isVaultActive = pathname === "/dashboard" && !isTimeline;
  const isTimelineActive = pathname === "/dashboard" && isTimeline;
  const isAnalyticsActive = pathname === "/analytics";
  const isSettingsActive = pathname === "/settings";

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-parchment text-foreground font-ui">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-xs focus:bg-wax focus:px-4 focus:py-2.5 focus:font-letter focus:text-xs focus:font-semibold focus:uppercase focus:tracking-wider focus:text-on-wax"
      >
        {t("common.skipToContent")}
      </a>
      <aside className="hidden md:flex w-72 h-screen sticky top-0 bg-manila/50 border-r border-crease p-8 flex-col justify-between shrink-0 font-ui select-none">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-2xl font-serif-editorial italic text-foreground tracking-tight font-semibold"
            >
              <span>TimeEcho</span>
            </Link>

            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-1.5 border border-crease hover:border-wax/60 rounded-xs px-2.5 py-1 text-xs font-letter transition-colors cursor-pointer bg-transparent hover:bg-manila/50 shrink-0 min-h-[36px] focus-visible:outline-2 focus-visible:outline-wax"
              aria-label={t("header.switchLanguage")}
            >
              <Globe size={13} className="text-foreground-muted shrink-0" />
              <span
                className={
                  locale === "es"
                    ? "text-wax font-bold"
                    : "text-foreground-muted/60 font-medium"
                }
              >
                ES
              </span>
              <span className="text-crease font-mono text-[10px]">/</span>
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
          </div>

          <nav className="space-y-2 font-ui">
            <Link
              href="/letters/new"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax",
                isWriteActive
                  ? "bg-wax text-on-wax"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <PenTool size={18} />
              <span>{t("nav.compose")}</span>
            </Link>

            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax",
                isVaultActive
                  ? "bg-wax text-on-wax"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <Mail size={18} />
              <span>{t("nav.letters")}</span>
            </Link>

            <Link
              href="/dashboard?timeline=true"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax",
                isTimelineActive
                  ? "bg-wax text-on-wax"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <Clock size={18} />
              <span>{t("nav.timeline")}</span>
            </Link>

            <Link
              href="/analytics"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax",
                isAnalyticsActive
                  ? "bg-wax text-on-wax"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <BarChart3 size={18} />
              <span>{t("nav.analytics")}</span>
            </Link>

            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px] focus-visible:outline-2 focus-visible:outline-wax",
                isSettingsActive
                  ? "bg-wax text-on-wax"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <Settings size={18} />
              <span>{t("nav.settings")}</span>
            </Link>
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between border-t border-crease pt-4 font-ui">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-foreground-muted font-medium truncate pr-2">
                user@timeecho.me
              </p>
            </div>
            <Link
              href="/login"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-wax/10 text-wax transition-colors focus-visible:outline-2 focus-visible:outline-wax"
              title={t("header.signOut")}
              aria-label={t("header.signOut")}
            >
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      <header className="md:hidden sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-crease px-4 py-3 flex items-center justify-between font-ui select-none">
        <Link
          href="/"
          className="flex items-center text-xl font-serif-editorial italic text-foreground tracking-tight font-semibold shrink-0"
        >
          <span>TimeEcho</span>
        </Link>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1.5 border border-crease hover:border-wax/60 rounded-xs px-2 py-1 text-xs font-letter transition-colors cursor-pointer bg-transparent hover:bg-manila/50 shrink-0 min-h-[36px] focus-visible:outline-2 focus-visible:outline-wax"
            aria-label={t("header.switchLanguage")}
          >
            <Globe size={13} className="text-foreground-muted shrink-0" />
            <span
              className={
                locale === "es"
                  ? "text-wax font-bold"
                  : "text-foreground-muted/60 font-medium"
              }
            >
              ES
            </span>
            <span className="text-crease font-mono text-[10px]">/</span>
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

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded text-foreground-muted hover:text-foreground cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-wax"
            aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-crease bg-manila p-4 space-y-2 font-ui animate-fade-in select-none">
          <Link
            href="/letters/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 px-2 min-h-[44px] text-sm text-foreground hover:text-wax focus-visible:outline-2 focus-visible:outline-wax"
          >
            <PenTool size={16} />
            <span>{t("nav.compose")}</span>
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 px-2 min-h-[44px] text-sm text-foreground hover:text-wax focus-visible:outline-2 focus-visible:outline-wax"
          >
            <Mail size={16} />
            <span>{t("nav.letters")}</span>
          </Link>
          <Link
            href="/dashboard?timeline=true"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 px-2 min-h-[44px] text-sm text-foreground hover:text-wax focus-visible:outline-2 focus-visible:outline-wax"
          >
            <Clock size={16} />
            <span>{t("nav.timeline")}</span>
          </Link>
          <Link
            href="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 px-2 min-h-[44px] text-sm text-foreground hover:text-wax focus-visible:outline-2 focus-visible:outline-wax"
          >
            <BarChart3 size={16} />
            <span>{t("nav.analytics")}</span>
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 px-2 min-h-[44px] text-sm text-foreground hover:text-wax focus-visible:outline-2 focus-visible:outline-wax"
          >
            <Settings size={16} />
            <span>{t("nav.settings")}</span>
          </Link>
          <div className="border-t border-crease pt-2 flex items-center justify-between text-xs text-foreground-muted">
            <span>user@timeecho.me</span>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-wax flex items-center gap-1 min-h-[44px] px-2 py-1 focus-visible:outline-2 focus-visible:outline-wax"
            >
              <LogOut size={14} />
              <span>{t("header.signOut")}</span>
            </Link>
          </div>
        </div>
      )}

      <main
        id="main-content"
        className="flex-grow min-h-screen bg-parchment p-4 sm:p-8 md:p-12 overflow-x-hidden font-ui"
      >
        {children}
      </main>
    </div>
  );
}
