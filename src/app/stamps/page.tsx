"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  PenTool,
  Sparkles,
  X,
  Bookmark,
  Check,
} from "lucide-react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  STAMPS_CATALOG,
  STAMP_CATEGORIES,
  StampCategory,
  StampDefinition,
} from "@/components/stamps/stamps.data";
import { Stamp } from "@/components/stamps/Stamp";
import { cn } from "@/lib/utils";

export default function StampsCollectionPage() {
  const router = useRouter();
  const { t } = useTimeEcho();

  const [activeCategory, setActiveCategory] = useState<StampCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingStamp, setInspectingStamp] =
    useState<StampDefinition | null>(null);

  const totalStampsCount = STAMPS_CATALOG.length;

  const filteredStamps = useMemo(() => {
    return STAMPS_CATALOG.filter((stamp) => {
      const matchesCategory =
        activeCategory === "all" || stamp.category === activeCategory;

      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return matchesCategory;
      }

      const localizedName = t(`stamps.items.${stamp.id}.name`);
      const localizedDesc = t(`stamps.items.${stamp.id}.description`);
      const localizedDenom = t(`stamps.items.${stamp.id}.denomination`);

      const matchesSearch =
        stamp.name.toLowerCase().includes(query) ||
        localizedName.toLowerCase().includes(query) ||
        stamp.denomination.toLowerCase().includes(query) ||
        localizedDenom.toLowerCase().includes(query) ||
        stamp.description.toLowerCase().includes(query) ||
        localizedDesc.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);

  const handleSelectStampForLetter = (stampId: string) => {
    router.push(`/letters/new?stamp=${stampId}`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-crease">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-letter text-[10px] uppercase tracking-widest text-ink font-bold px-2 py-0.5 rounded-xs bg-manila border border-crease">
              {t("collection.badge")}
            </span>
            <span className="text-foreground-muted text-xs">•</span>
            <span className="font-letter text-xs text-foreground-muted font-medium">
              {t("collection.stats.unlockedRatio", {
                unlocked: totalStampsCount,
                total: totalStampsCount,
              })}
            </span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            {t("collection.title")}
          </h1>
          <p className="text-xs sm:text-sm font-letter text-foreground-muted tracking-wider max-w-2xl">
            {t("collection.subtitle")}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="border border-crease text-foreground hover:bg-manila/50 rounded-xs px-4 text-xs font-medium uppercase tracking-wider font-letter inline-flex items-center gap-1.5 min-h-[40px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-wax"
          >
            <ArrowLeft size={14} />
            <span>{t("collection.backToVault")}</span>
          </Link>
          <Link
            href="/letters/new"
            className="bg-wax hover:bg-wax-hover text-on-wax rounded-xs px-4 text-xs font-semibold uppercase tracking-wider font-letter inline-flex items-center gap-2 min-h-[40px] shadow-xs cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-wax"
          >
            <PenTool size={14} />
            <span>{t("nav.compose")}</span>
          </Link>
        </div>
      </div>

      <div className="paper-sheet border border-crease p-6 rounded-xs shadow-xs bg-parchment space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xs bg-manila/50 border border-crease flex flex-col justify-between">
            <span className="font-letter text-[10px] uppercase tracking-wider text-foreground-muted">
              {t("collection.stats.collectedCount")}
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif-editorial text-3xl font-bold text-wax">
                {totalStampsCount}
              </span>
              <span className="font-letter text-xs text-foreground-muted">
                / {totalStampsCount}
              </span>
            </div>
            <div className="w-full bg-crease/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-wax h-full rounded-full w-full" />
            </div>
          </div>

          <div className="p-4 rounded-xs bg-manila/50 border border-crease flex flex-col justify-between">
            <span className="font-letter text-[10px] uppercase tracking-wider text-foreground-muted">
              {t("collection.stats.totalCount")}
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif-editorial text-3xl font-bold text-foreground">
                {totalStampsCount}
              </span>
              <span className="font-letter text-xs text-foreground-muted">
                {t("collection.badge")}
              </span>
            </div>
            <span className="font-letter text-[10px] text-foreground-muted mt-3">
              4 {t("collection.dossier.categoryLabel").toLowerCase()}
            </span>
          </div>

          <div className="p-4 rounded-xs bg-manila/40 border border-crease flex flex-col justify-between">
            <div className="space-y-1">
              <span className="font-letter text-[10px] uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>{t("stamps.postmark")}</span>
              </span>
              <p className="font-letter text-[11px] text-foreground-muted leading-relaxed mt-1">
                {t("collection.dossier.unlockedDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-xs text-xs font-letter transition-all whitespace-nowrap cursor-pointer border min-h-[36px]",
                activeCategory === "all"
                  ? "bg-ink text-parchment border-ink font-semibold shadow-xs"
                  : "bg-manila/50 text-foreground-muted border-crease hover:text-foreground hover:bg-manila",
              )}
            >
              {t("collection.tabs.all")} ({totalStampsCount})
            </button>
            {STAMP_CATEGORIES.map((cat) => {
              const count = STAMPS_CATALOG.filter(
                (s) => s.category === cat.id,
              ).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xs text-xs font-letter transition-all whitespace-nowrap cursor-pointer border min-h-[36px]",
                    activeCategory === cat.id
                      ? "bg-ink text-parchment border-ink font-semibold shadow-xs"
                      : "bg-manila/50 text-foreground-muted border-crease hover:text-foreground hover:bg-manila",
                  )}
                >
                  {t(`stamps.categories.${cat.id}`)} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("stamps.searchPlaceholder")}
              className="w-full pl-8 pr-8 py-1.5 text-xs font-letter bg-parchment border border-crease rounded-xs text-foreground placeholder:text-foreground-muted/60 outline-none focus:outline-none focus-visible:outline-none focus:border-crease focus:ring-0 focus-visible:ring-0 min-h-[36px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground p-0.5 cursor-pointer"
                aria-label={t("stamps.close")}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {filteredStamps.length === 0 ? (
          <div className="paper-sheet border border-dashed border-crease p-12 text-center rounded-xs space-y-3">
            <Bookmark
              size={32}
              className="mx-auto text-foreground-muted/40 stroke-1"
            />
            <h3 className="font-serif-editorial text-lg font-semibold text-foreground">
              {t("collection.emptySearchTitle")}
            </h3>
            <p className="font-letter text-xs text-foreground-muted max-w-md mx-auto">
              {t("collection.emptySearchDesc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {filteredStamps.map((stamp) => (
              <div
                key={stamp.id}
                onClick={() => setInspectingStamp(stamp)}
                className="paper-sheet group relative flex flex-col items-center p-4 rounded-xs border border-crease bg-parchment hover:border-wax hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setInspectingStamp(stamp);
                  }
                }}
                aria-label={t(`stamps.items.${stamp.id}.name`)}
              >
                <div className="relative my-2">
                  <Stamp
                    id={stamp.id}
                    size="lg"
                    interactive={false}
                    hasPostmark
                    postmarkVariant="waves"
                  />

                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-wax text-on-wax flex items-center justify-center shadow-xs">
                    <Check size={11} strokeWidth={3} />
                  </div>
                </div>

                <div className="w-full mt-2 space-y-1">
                  <span className="block font-serif-editorial text-xs font-semibold text-foreground line-clamp-1 group-hover:text-wax transition-colors">
                    {t(`stamps.items.${stamp.id}.name`)}
                  </span>
                  <span className="block font-letter text-[9px] uppercase tracking-wider text-foreground-muted truncate">
                    {t(`stamps.items.${stamp.id}.denomination`)}
                  </span>
                </div>

                <div className="mt-3 pt-2 w-full border-t border-crease/60 flex items-center justify-between text-[8px] font-letter text-foreground-muted">
                  <span className="uppercase tracking-widest truncate">
                    {t(`stamps.categories.${stamp.category}`)}
                  </span>
                  <span className="font-semibold uppercase tracking-wider text-wax">
                    {t("collection.card.unlockedBadge")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {inspectingStamp && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-ui"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-stamp-name"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setInspectingStamp(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-parchment border border-crease rounded-xs shadow-2xl p-6 sm:p-8 space-y-6 scrollbar-thin"
            >
              <div className="flex items-center justify-between pb-4 border-b border-crease">
                <div className="flex items-center gap-2">
                  <span className="font-letter text-[10px] uppercase tracking-widest text-ink font-bold px-2 py-0.5 rounded-xs bg-manila border border-crease">
                    {t("collection.dossier.badge")}
                  </span>
                  <span className="text-foreground-muted text-xs">•</span>
                  <span className="font-letter text-xs text-foreground-muted">
                    {t(`stamps.categories.${inspectingStamp.category}`)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingStamp(null)}
                  className="text-foreground-muted hover:text-foreground p-1 rounded-xs transition-colors cursor-pointer"
                  aria-label={t("collection.dossier.close")}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="relative shrink-0 p-4 rounded-xs bg-manila/50 border border-crease shadow-inner flex items-center justify-center">
                  <Stamp
                    id={inspectingStamp.id}
                    size="xl"
                    interactive={false}
                    hasPostmark
                    postmarkVariant="circular"
                  />
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
                  <div className="space-y-1">
                    <h2
                      id="dossier-stamp-name"
                      className="font-serif-editorial text-2xl font-bold text-foreground"
                    >
                      {t(`stamps.items.${inspectingStamp.id}.name`)}
                    </h2>
                    <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                      <span className="font-letter text-[11px] font-semibold text-wax px-2 py-0.5 rounded-xs bg-wax/10 border border-wax/20">
                        {t(`stamps.items.${inspectingStamp.id}.denomination`)}
                      </span>
                      <span className="font-letter text-[10px] text-foreground-muted px-2 py-0.5 rounded-xs bg-manila border border-crease">
                        {t(`stamps.categories.${inspectingStamp.category}`)}
                      </span>
                    </div>
                  </div>

                  <p className="font-letter text-xs text-foreground-muted leading-relaxed">
                    {t(`stamps.items.${inspectingStamp.id}.description`)}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs font-letter text-[11px] font-semibold uppercase tracking-wider bg-wax/15 text-wax border border-wax/30">
                      <CheckCircle2 size={12} />
                      <span>{t("collection.status.unlocked")}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xs bg-manila/60 border border-crease space-y-1.5">
                <span className="block font-letter text-[10px] uppercase tracking-wider text-ink font-semibold">
                  {t("collection.dossier.storyLabel")}
                </span>
                <p className="font-serif-editorial italic text-sm text-foreground leading-relaxed">
                  &ldquo;
                  {t(`stamps.items.${inspectingStamp.id}.storyPrompt`)}
                  &rdquo;
                </p>
                <p className="font-letter text-[11px] text-foreground-muted pt-2 border-t border-crease/60">
                  {t("collection.dossier.unlockedDesc")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectingStamp(null)}
                  className="px-4 py-2.5 rounded-xs border border-crease hover:bg-crease/40 font-letter text-xs text-foreground transition-colors cursor-pointer min-h-[40px]"
                >
                  {t("collection.dossier.close")}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectStampForLetter(inspectingStamp.id)}
                  className="px-5 py-2.5 rounded-xs bg-wax hover:bg-wax-hover text-on-wax font-letter text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs min-h-[40px] flex items-center gap-2"
                >
                  <PenTool size={14} />
                  <span>{t("collection.dossier.writeWithStamp")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
