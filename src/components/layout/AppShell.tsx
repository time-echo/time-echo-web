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
  const { locale, toggleLocale } = useTimeEcho();
  const isEs = locale === "es";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTimeline = searchParams.get("timeline") === "true";
  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/letters/success");

  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment text-foreground font-ui">
        <ArchivalHeader />
        <main className="flex-grow max-w-6xl mx-auto px-4 md:px-6 py-10 w-full font-ui">
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
      {/* Desktop Sticky Sidebar */}
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
              className="flex items-center gap-1.5 text-foreground-muted hover:text-wax transition-colors cursor-pointer bg-transparent border-none p-0 font-ui text-xs font-medium"
              aria-label={
                isEs ? "Switch language to English" : "Cambiar idioma a español"
              }
            >
              <Globe size={16} />
              <span>{isEs ? "ES" : "EN"}</span>
            </button>
          </div>

          <nav className="space-y-2 font-ui">
            <Link
              href="/letters/new"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                isWriteActive
                  ? "bg-[#8E2818] text-[#FAF9F5]"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <PenTool size={18} />
              <span>{isEs ? "Escribir una Carta" : "Write a Letter"}</span>
            </Link>

            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                isVaultActive
                  ? "bg-[#8E2818] text-[#FAF9F5]"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <Mail size={18} />
              <span>{isEs ? "Mis Cartas" : "My Letters"}</span>
            </Link>

            <Link
              href="/dashboard?timeline=true"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                isTimelineActive
                  ? "bg-[#8E2818] text-[#FAF9F5]"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <Clock size={18} />
              <span>{isEs ? "Línea de Tiempo" : "Timeline"}</span>
            </Link>

            <Link
              href="/analytics"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                isAnalyticsActive
                  ? "bg-[#8E2818] text-[#FAF9F5]"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <BarChart3 size={18} />
              <span>{isEs ? "Estadísticas" : "Analytics"}</span>
            </Link>

            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                isSettingsActive
                  ? "bg-[#8E2818] text-[#FAF9F5]"
                  : "text-foreground-muted hover:bg-manila hover:text-wax",
              )}
            >
              <Settings size={18} />
              <span>{isEs ? "Ajustes" : "Settings"}</span>
            </Link>
          </nav>
        </div>

        <div className="space-y-6">
          <div className="border border-crease bg-manila/60 p-4 rounded-xl space-y-2 select-none">
            <p className="text-xs font-serif-editorial italic text-foreground-muted leading-relaxed font-normal">
              {isEs
                ? "«La mejor manera de predecir el futuro es crearlo.»"
                : "“The best way to predict the future is to create it.”"}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-crease pt-4 font-ui">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-foreground-muted font-medium truncate pr-2">
                user@timeecho.me
              </p>
            </div>
            <Link
              href="/login"
              className="p-1.5 rounded-full hover:bg-red-800/10 text-wax transition-colors"
              title={isEs ? "Cerrar Sesión" : "Sign Out"}
              aria-label={isEs ? "Cerrar Sesión" : "Sign Out"}
            >
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
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
            className="flex items-center gap-1 text-foreground-muted hover:text-wax transition-colors cursor-pointer bg-transparent border-none p-1 font-ui text-xs font-medium"
          >
            <Globe size={16} />
            <span>{isEs ? "ES" : "EN"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded text-foreground-muted hover:text-foreground cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-crease bg-manila p-4 space-y-2 font-ui animate-fade-in select-none">
          <Link
            href="/letters/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-wax"
          >
            <PenTool size={16} />
            <span>{isEs ? "Escribir una Carta" : "Write a Letter"}</span>
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-wax"
          >
            <Mail size={16} />
            <span>{isEs ? "Mis Cartas" : "My Letters"}</span>
          </Link>
          <Link
            href="/dashboard?timeline=true"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-wax"
          >
            <Clock size={16} />
            <span>{isEs ? "Línea de Tiempo" : "Timeline"}</span>
          </Link>
          <Link
            href="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-wax"
          >
            <BarChart3 size={16} />
            <span>{isEs ? "Estadísticas" : "Analytics"}</span>
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-foreground hover:text-wax"
          >
            <Settings size={16} />
            <span>{isEs ? "Ajustes" : "Settings"}</span>
          </Link>
          <div className="border-t border-crease pt-2 flex items-center justify-between text-xs text-foreground-muted">
            <span>user@timeecho.me</span>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-wax flex items-center gap-1"
            >
              <LogOut size={14} />
              <span>{isEs ? "Cerrar Sesión" : "Sign Out"}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow min-h-screen bg-parchment p-4 sm:p-8 md:p-12 overflow-x-hidden font-ui">
        {children}
      </main>
    </div>
  );
}
