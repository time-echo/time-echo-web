"use client";

import React from "react";
import Link from "next/link";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { PaperSheet } from "@/components/ui/PaperSheet";
import { PostmarkStamp } from "@/components/ui/PostmarkStamp";
import {
  FileText,
  AlertOctagon,
  ArrowLeft,
  Mail,
  Shield,
  Clock,
} from "lucide-react";

export default function TermsPage() {
  const { t } = useTimeEcho();

  const prohibitedItems = [
    t("terms.sections.prohibited.item_spam"),
    t("terms.sections.prohibited.item_harassment"),
    t("terms.sections.prohibited.item_threats"),
    t("terms.sections.prohibited.item_fraud"),
    t("terms.sections.prohibited.item_impersonation"),
    t("terms.sections.prohibited.item_illegal"),
    t("terms.sections.prohibited.item_malware"),
    t("terms.sections.prohibited.item_abuse"),
    t("terms.sections.prohibited.item_unauthorized"),
    t("terms.sections.prohibited.item_infringement"),
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
          <span>{t("terms.returnHome")}</span>
        </Link>

        <PostmarkStamp
          city={t("terms.postmarkCity")}
          docketId="TE-TERMS"
          date="2026"
          subtext={t("terms.postmarkSubtext")}
          variant="boxed"
          size="sm"
          inkColor="ink"
        />
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-manila border border-manila-border text-foreground-muted text-xs font-letter">
          <FileText size={13} className="text-wax" />
          <span>{t("terms.last_updated")}</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-5xl text-foreground font-semibold tracking-tight leading-tight">
          {t("terms.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted font-letter leading-relaxed">
          {t("terms.subtitle")}
        </p>
      </div>

      {/* Main Archival Terms Document */}
      <PaperSheet
        elevation="raised"
        docketFolio="FOLIO № PROTOCOL-TERMS"
        dateStamp={t("terms.last_updated")}
        className="p-6 sm:p-10 space-y-8"
      >
        {/* 1. Acceptance */}
        <section className="space-y-3">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.acceptance.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.acceptance.description")}
          </p>
        </section>

        {/* 2. About */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.about.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.about.description")}
          </p>
        </section>

        {/* 3. Accounts */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.accounts.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.accounts.description")}
          </p>
        </section>

        {/* 4. Creating and Scheduling Capsules */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.creating.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.creating.description")}
          </p>
        </section>

        {/* 5. Delivery */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <div className="flex items-center gap-2 text-wax">
            <Clock size={18} />
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("terms.sections.delivery.title")}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.delivery.description")}
          </p>
          <div className="bg-manila border border-manila-border p-4 rounded-xs text-xs font-letter text-foreground-muted/90 italic leading-relaxed">
            {t("terms.sections.delivery.disclaimer")}
          </div>
        </section>

        {/* 6. User Conduct & Responsibilities */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.responsibilities.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.responsibilities.description")}
          </p>
        </section>

        {/* 7. Content Ownership */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <div className="flex items-center gap-2 text-wax">
            <Shield size={18} />
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("terms.sections.content.title")}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.content.description")}
          </p>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted/90 leading-relaxed italic">
            {t("terms.sections.content.license")}
          </p>
        </section>

        {/* 8. Prohibited Activities */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <div className="flex items-center gap-2 text-wax">
            <AlertOctagon size={18} />
            <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
              {t("terms.sections.prohibited.title")}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.prohibited.description")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {prohibitedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs font-letter text-foreground-muted bg-manila/50 border border-crease/60 p-2.5 rounded-xs"
              >
                <span className="text-wax font-bold select-none">•</span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Recipient Consent */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.recipient.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.recipient.description")}
          </p>
        </section>

        {/* 10. Platform Intellectual Property */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.intellectual.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.intellectual.description")}
          </p>
        </section>

        {/* 11. Service Availability */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.availability.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.availability.description")}
          </p>
        </section>

        {/* 12. Account Termination */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.termination.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.termination.description")}
          </p>
        </section>

        {/* 13. Limitation of Liability */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.liability.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.liability.description")}
          </p>
        </section>

        {/* 14. Changes to Terms */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.changes.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.changes.description")}
          </p>
        </section>

        {/* 15. Contact */}
        <section className="space-y-3 border-t border-crease/60 pt-6">
          <h2 className="font-serif-editorial text-2xl text-foreground font-semibold">
            {t("terms.sections.contact.title")}
          </h2>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted leading-relaxed">
            {t("terms.sections.contact.description")}
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
