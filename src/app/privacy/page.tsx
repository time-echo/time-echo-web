"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PaperSheet } from "@/components/ui/PaperSheet";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Mail,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

export default function PrivacyPage() {
  const { t } = useTimeEcho();

  const collectItems = [
    t("privacy.sections.collect.item_email"),
    t("privacy.sections.collect.item_letters"),
    t("privacy.sections.collect.item_predictions"),
    t("privacy.sections.collect.item_emotional"),
    t("privacy.sections.collect.item_preferences"),
    t("privacy.sections.collect.item_technical"),
  ];

  const useItems = [
    t("privacy.sections.how_use.item_accounts"),
    t("privacy.sections.how_use.item_store"),
    t("privacy.sections.how_use.item_deliver"),
    t("privacy.sections.how_use.item_communicate"),
    t("privacy.sections.how_use.item_improve"),
    t("privacy.sections.how_use.item_security"),
  ];

  const thirdPartyItems = [
    t("privacy.sections.third_parties.item_email"),
    t("privacy.sections.third_parties.item_hosting"),
  ];

  const rightsItems = [
    t("privacy.sections.rights.item_access"),
    t("privacy.sections.rights.item_delete"),
    t("privacy.sections.rights.item_questions"),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-ui animate-fade-in text-foreground space-y-10">
      {/* Navigation & Header Folio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-crease pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-letter uppercase tracking-wider text-foreground-muted hover:text-wax transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{t("privacy.returnHome")}</span>
        </Link>

        <PostmarkStamp
          city={t("privacy.postmarkCity")}
          docketId="TE-PRIVACY"
          date="2026"
          subtext={t("privacy.postmarkSubtext")}
          variant="boxed"
          size="sm"
          inkColor="ink"
        />
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-manila border border-manila-border text-foreground-muted text-xs font-letter">
          <ShieldCheck size={13} className="text-wax" />
          <span>{t("privacy.last_updated")}</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-5xl text-foreground font-semibold tracking-tight leading-tight">
          {t("privacy.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted font-letter leading-relaxed">
          {t("privacy.subtitle")}
        </p>
      </div>

      {/* Main Archival Document */}
      <PaperSheet
        elevation="raised"
        docketFolio="FOLIO № PROTOCOL-PRIVACY"
        dateStamp={t("privacy.last_updated")}
        className="p-6 sm:p-10 space-y-8"
      >
        {/* Intro */}
        <section className="space-y-3">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.intro.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.intro.description")}
          </p>
        </section>

        {/* What We Collect */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.collect.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.collect.description")}
          </p>
          <ul className="space-y-2 pt-2">
            {collectItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed"
              >
                <CheckCircle2 size={15} className="text-wax shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How We Use Information */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.how_use.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.how_use.description")}
          </p>
          <ul className="space-y-2 pt-2">
            {useItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed"
              >
                <FileCheck2 size={15} className="text-ink shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* End-to-End Privacy & Encryption */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <div className="flex items-center gap-2 text-wax">
            <Lock size={18} />
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("privacy.sections.encryption.title")}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.encryption.description")}
          </p>
        </section>

        {/* Data Retention & Instant Deletion */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.retention.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.retention.description")}
          </p>
        </section>

        {/* Trusted Partners */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.third_parties.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.third_parties.description")}
          </p>
          <ul className="space-y-2 pt-2">
            {thirdPartyItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-wax shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Data Rights */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.rights.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.rights.description")}
          </p>
          <ul className="space-y-2 pt-2">
            {rightsItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed"
              >
                <CheckCircle2 size={15} className="text-wax shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Changes */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.changes.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.changes.description")}
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("privacy.sections.contact.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("privacy.sections.contact.description")}
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
        </section>
      </PaperSheet>
    </div>
  );
}
