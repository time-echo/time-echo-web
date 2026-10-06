"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PaperSheet } from "@/components/ui/PaperSheet";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import {
  PenLine,
  Lock,
  Clock,
  Mail,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function AboutPage() {
  const { locale, t } = useTimeEcho();
  const isEs = locale === "es";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-ui animate-fade-in text-foreground space-y-10">
      {/* Navigation & Header Folio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-crease pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-letter uppercase tracking-wider text-foreground-muted hover:text-wax transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{isEs ? "Volver al inicio" : "Return to Home"}</span>
        </Link>

        <PostmarkStamp
          city={isEs ? "CÁPSULA // CENTRAL" : "TIME VAULT // ARCHIVE"}
          docketId="TE-ABOUT"
          date="2026"
          subtext={isEs ? "MEMORIA VIVA" : "LIVING MEMORY"}
          variant="boxed"
          size="sm"
          inkColor="ink"
        />
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-manila border border-manila-border text-foreground-muted text-xs font-letter">
          <Sparkles size={13} className="text-wax" />
          <span>{isEs ? "Manifiesto Epistolar" : "Epistolary Manifesto"}</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-5xl text-foreground font-semibold tracking-tight leading-tight">
          {t("about.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted font-letter leading-relaxed">
          {t("about.subtitle")}
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {/* Why Write to Your Future Self */}
        <PaperSheet
          elevation="raised"
          docketFolio="FOLIO № 01 // ORIGEN"
          dateStamp={isEs ? "PROPÓSITO" : "PURPOSE"}
          className="p-6 sm:p-8"
        >
          <div className="space-y-3">
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("about.sections.what_is.title")}
            </h2>
            <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
              {t("about.sections.what_is.description")}
            </p>
          </div>
        </PaperSheet>

        {/* How It Works */}
        <div className="space-y-4">
          <div className="border-b border-crease pb-2">
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("about.sections.how_works.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-letter">
            {/* Step 1 */}
            <div className="paper-sheet rounded-xs border border-crease p-6 space-y-3 bg-parchment">
              <div className="flex items-center justify-between">
                <span className="postmark-stamp text-[10px] py-0.5 px-2 inline-flex items-center gap-1.5">
                  <PenLine size={13} />
                  <span>№ 01</span>
                </span>
                <span className="text-[10px] text-foreground-muted uppercase tracking-widest">
                  {isEs ? "Composición" : "Composition"}
                </span>
              </div>
              <h3 className="font-serif-editorial font-semibold text-base text-foreground">
                {t("about.sections.how_works.step_write_title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed font-letter">
                {t("about.sections.how_works.step_write_desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="paper-sheet rounded-xs border border-crease p-6 space-y-3 bg-parchment">
              <div className="flex items-center justify-between">
                <span className="postmark-stamp text-[10px] py-0.5 px-2 inline-flex items-center gap-1.5">
                  <Lock size={13} />
                  <span>№ 02</span>
                </span>
                <span className="text-[10px] text-foreground-muted uppercase tracking-widest">
                  {isEs ? "Custodia" : "Custody"}
                </span>
              </div>
              <h3 className="font-serif-editorial font-semibold text-base text-foreground">
                {t("about.sections.how_works.step_seal_title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed font-letter">
                {t("about.sections.how_works.step_seal_desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="paper-sheet rounded-xs border border-crease p-6 space-y-3 bg-parchment">
              <div className="flex items-center justify-between">
                <span className="postmark-stamp text-[10px] py-0.5 px-2 inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>№ 03</span>
                </span>
                <span className="text-[10px] text-foreground-muted uppercase tracking-widest">
                  {isEs ? "Tránsito" : "Transit"}
                </span>
              </div>
              <h3 className="font-serif-editorial font-semibold text-base text-foreground">
                {t("about.sections.how_works.step_wait_title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed font-letter">
                {t("about.sections.how_works.step_wait_desc")}
              </p>
            </div>

            {/* Step 4 */}
            <div className="paper-sheet rounded-xs border border-crease p-6 space-y-3 bg-parchment">
              <div className="flex items-center justify-between">
                <span className="postmark-stamp text-[10px] py-0.5 px-2 inline-flex items-center gap-1.5">
                  <Mail size={13} />
                  <span>№ 04</span>
                </span>
                <span className="text-[10px] text-foreground-muted uppercase tracking-widest">
                  {isEs ? "Apertura" : "Unsealing"}
                </span>
              </div>
              <h3 className="font-serif-editorial font-semibold text-base text-foreground">
                {t("about.sections.how_works.step_receive_title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed font-letter">
                {t("about.sections.how_works.step_receive_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Built for Honest Self-Conversation */}
        <PaperSheet
          elevation="raised"
          docketFolio="FOLIO № 02 // INTIMIDAD"
          dateStamp={isEs ? "REFLEXIÓN" : "REFLECTION"}
          className="p-6 sm:p-8"
        >
          <div className="space-y-3">
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("about.sections.why_exists.title")}
            </h2>
            <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
              {t("about.sections.why_exists.description")}
            </p>
          </div>
        </PaperSheet>

        {/* Our Privacy Philosophy */}
        <PaperSheet
          elevation="raised"
          docketFolio="FOLIO № 03 // CIFRADO"
          dateStamp={isEs ? "GARANTÍA" : "SECURITY"}
          className="p-6 sm:p-8"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-wax">
              <ShieldCheck size={20} />
              <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
                {t("about.sections.philosophy.title")}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
              {t("about.sections.philosophy.description")}
            </p>
          </div>
        </PaperSheet>

        {/* Contact & Creators */}
        <PaperSheet
          elevation="raised"
          docketFolio="FOLIO № 04 // CONTACTO"
          dateStamp={isEs ? "CORRESPONDENCIA" : "CORRESPONDENCE"}
          className="p-6 sm:p-8"
        >
          <div className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("about.sections.contact.title")}
            </h2>
            <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
              {t("about.sections.contact.description")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 font-letter text-xs">
              <a
                href="mailto:nmena.garzon@gmail.com"
                className="inline-flex items-center gap-2 text-wax hover:underline transition-colors"
              >
                <Mail size={16} />
                <span>nmena.garzon@gmail.com</span>
              </a>
              <span className="hidden sm:inline text-foreground-muted/40">•</span>
              <a
                href="mailto:juanmamena2005@gmail.com"
                className="inline-flex items-center gap-2 text-wax hover:underline transition-colors"
              >
                <Mail size={16} />
                <span>juanmamena2005@gmail.com</span>
              </a>
            </div>
          </div>
        </PaperSheet>

        {/* Bottom Call to Action */}
        <div className="text-center pt-6 pb-2">
          <Link
            href="/letters/new"
            className="inline-flex items-center gap-2 bg-[#8E2818] hover:bg-[#6A1E12] text-[#FAF9F5] px-6 py-3 rounded-xs font-letter text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors"
          >
            <Send size={15} />
            <span>{isEs ? "Escribir una carta al futuro" : "Write a letter to the future"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
