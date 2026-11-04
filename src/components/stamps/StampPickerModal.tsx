"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Stamp } from "./Stamp";
import { useStampCatalog } from "./useStampCatalog";

export interface StampPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStampId?: string;
  onSelectStamp: (stampId: string | undefined) => void;
  allowRemove?: boolean;
  className?: string;
}

interface StampPickerContentProps {
  onClose: () => void;
  selectedStampId?: string;
  onSelectStamp: (stampId: string | undefined) => void;
  allowRemove?: boolean;
}

function StampPickerContent({
  onClose,
  selectedStampId,
  onSelectStamp,
  allowRemove = true,
}: StampPickerContentProps) {
  const { t } = useTimeEcho();
  const { stamps, categories, isLoading } = useStampCatalog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const selectedStampRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filteredStamps = useMemo(() => {
    let list = stamps;
    if (selectedCategory !== "all") {
      list = list.filter(
        (s) => (s.category_slug || s.categorySlug) === selectedCategory,
      );
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter((stamp) => {
      const localizedName = t(`stamps.items.${stamp.slug}.name`);
      const localizedDenom = t(`stamps.items.${stamp.slug}.denomination`);

      return (
        stamp.name.toLowerCase().includes(query) ||
        localizedName.toLowerCase().includes(query) ||
        (stamp.slug && stamp.slug.toLowerCase().includes(query)) ||
        localizedDenom.toLowerCase().includes(query)
      );
    });
  }, [stamps, selectedCategory, searchQuery, t]);

  useEffect(() => {
    if (selectedStampRef.current) {
      selectedStampRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedStampId]);

  const handleSelect = (stampSlug: string) => {
    if (selectedStampId === stampSlug && allowRemove) {
      onSelectStamp(undefined);
    } else {
      onSelectStamp(stampSlug);
    }
    onClose();
  };

  const handleRemove = () => {
    onSelectStamp(undefined);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0.5 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg h-full flex flex-col bg-parchment border-l border-crease shadow-2xl overflow-hidden font-ui"
      >
        <div className="p-3.5 sm:p-4 border-b border-crease bg-manila/40 shrink-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("stamps.searchPlaceholder")}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-xs font-letter bg-parchment border border-crease rounded-xs text-foreground placeholder:text-foreground-muted outline-none focus:outline-none focus-visible:outline-none focus:border-crease focus:ring-0 focus-visible:ring-0"
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

            {allowRemove && selectedStampId && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-2 text-xs font-letter border border-crease rounded-xs text-foreground-muted hover:text-wax hover:border-wax transition-colors cursor-pointer shrink-0 whitespace-nowrap min-h-[36px]"
                title={t("stamps.removeStamp")}
              >
                {t("stamps.removeStamp")}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={t("stamps.close")}
              className="p-2 rounded-xs text-foreground-muted hover:text-foreground hover:bg-crease/40 transition-colors cursor-pointer shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center border border-crease bg-parchment"
            >
              <X size={16} />
            </button>
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-letter rounded-xs transition-colors whitespace-nowrap cursor-pointer",
                  selectedCategory === "all"
                    ? "bg-wax text-on-wax font-semibold"
                    : "bg-parchment text-foreground-muted hover:text-foreground border border-crease",
                )}
              >
                {t("stamps.categories.all")}
              </button>
              {categories.map((cat) => {
                const localizedCat = t(`stamps.categories.${cat.slug}`);
                const label =
                  localizedCat && !localizedCat.startsWith("stamps.categories.")
                    ? localizedCat
                    : cat.name;

                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      "px-2.5 py-1 text-[11px] font-letter rounded-xs transition-colors whitespace-nowrap cursor-pointer",
                      selectedCategory === cat.slug
                        ? "bg-wax text-on-wax font-semibold"
                        : "bg-parchment text-foreground-muted hover:text-foreground border border-crease",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-parchment/60 scrollbar-thin">
          {isLoading && stamps.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-letter text-xs text-foreground-muted">
                {t("common.loading")}
              </p>
            </div>
          ) : filteredStamps.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif-editorial text-base text-foreground-muted">
                {t("stamps.noStampsFound")}
              </p>
              {searchQuery && (
                <p className="font-letter text-xs text-foreground-muted">
                  &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-items-center">
              {filteredStamps.map((stamp) => {
                const isSelected = selectedStampId === stamp.slug;
                const localizedName = t(`stamps.items.${stamp.slug}.name`);
                const stampTitle =
                  localizedName && !localizedName.startsWith("stamps.items.")
                    ? localizedName
                    : stamp.name;

                const localizedDenom = t(
                  `stamps.items.${stamp.slug}.denomination`,
                );
                const denominationText =
                  localizedDenom && !localizedDenom.startsWith("stamps.items.")
                    ? localizedDenom
                    : "TIME ECHO";

                return (
                  <div
                    key={stamp.slug}
                    ref={isSelected ? selectedStampRef : undefined}
                    onClick={() => handleSelect(stamp.slug)}
                    className={cn(
                      "group relative flex flex-col items-center p-3 rounded-xs border transition-all cursor-pointer w-full max-w-[145px]",
                      isSelected
                        ? "bg-manila border-wax shadow-xs"
                        : "bg-parchment border-crease hover:border-ink/50 hover:bg-manila/40 hover:-translate-y-0.5",
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(stamp.slug);
                      }
                    }}
                  >
                    <div className="relative my-1">
                      <Stamp
                        slug={stamp.slug}
                        svgContent={stamp.svg_content || stamp.svgContent}
                        name={stamp.name}
                        categorySlug={stamp.category_slug || stamp.categorySlug}
                        size="md"
                        interactive={false}
                        selected={false}
                      />

                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-wax text-on-wax flex items-center justify-center shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-center w-full space-y-0.5">
                      <span
                        className="block font-serif-editorial text-xs font-semibold text-foreground truncate"
                        title={stampTitle}
                      >
                        {stampTitle}
                      </span>
                      <span className="block font-letter text-[9px] text-foreground-muted truncate">
                        {denominationText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

const emptySubscribe = () => () => {};

export function StampPickerModal({
  isOpen,
  onClose,
  selectedStampId,
  onSelectStamp,
  allowRemove = true,
  className,
}: StampPickerModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed inset-0 z-50 flex justify-end select-none overflow-hidden",
            className,
          )}
        >
          <StampPickerContent
            onClose={onClose}
            selectedStampId={selectedStampId}
            onSelectStamp={onSelectStamp}
            allowRemove={allowRemove}
          />
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
