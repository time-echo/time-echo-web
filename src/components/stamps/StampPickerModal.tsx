"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Stamp } from "./Stamp";
import {
  STAMPS_CATALOG,
  STAMP_CATEGORIES,
  getStampById,
  type StampCategory,
} from "./stamps.data";

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
  const [activeCategory, setActiveCategory] = useState<StampCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(
    selectedStampId,
  );

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
    return STAMPS_CATALOG.filter((stamp) => {
      const matchesCategory =
        activeCategory === "all" || stamp.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

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

  useEffect(() => {
    if (selectedStampRef.current) {
      selectedStampRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [tempSelectedId]);

  const currentPreviewStamp = useMemo(() => {
    if (!tempSelectedId) return undefined;
    return getStampById(tempSelectedId);
  }, [tempSelectedId]);

  const handleApply = () => {
    onSelectStamp(tempSelectedId);
    onClose();
  };

  const handleRemove = () => {
    setTempSelectedId(undefined);
    onSelectStamp(undefined);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0.5 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 w-full max-w-md sm:max-w-lg h-full flex flex-col bg-parchment border-l border-crease shadow-2xl overflow-hidden font-ui"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-crease bg-manila/50 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-letter text-[10px] uppercase tracking-widest text-ink font-bold">
                {t("stamps.badge")}
              </span>
              <span className="text-foreground-muted text-xs">•</span>
              <h2
                id="stamp-picker-title"
                className="font-serif-editorial text-xl font-bold text-foreground"
              >
                {t("stamps.title")}
              </h2>
            </div>
            <p className="font-letter text-xs text-foreground-muted">
              {t("stamps.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("stamps.close")}
            className="p-1.5 rounded-xs text-foreground-muted hover:text-foreground hover:bg-crease/40 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-crease space-y-3 bg-parchment shrink-0">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("stamps.searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2 text-xs font-letter bg-parchment border border-crease rounded-xs text-foreground focus-visible:outline-wax placeholder:text-foreground-muted"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-2.5 py-1 text-xs font-letter rounded-xs transition-colors whitespace-nowrap cursor-pointer border",
                activeCategory === "all"
                  ? "bg-ink text-parchment border-ink font-semibold"
                  : "bg-manila/60 text-foreground-muted border-crease hover:text-foreground hover:bg-manila",
              )}
            >
              {t("stamps.categories.all")}
            </button>
            {STAMP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-2.5 py-1 text-xs font-letter rounded-xs transition-colors whitespace-nowrap cursor-pointer border",
                  activeCategory === cat.id
                    ? "bg-ink text-parchment border-ink font-semibold"
                    : "bg-manila/60 text-foreground-muted border-crease hover:text-foreground hover:bg-manila",
                )}
              >
                {t(`stamps.categories.${cat.id}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-parchment/60 scrollbar-thin">
          {filteredStamps.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif-editorial text-base text-foreground-muted">
                {t("stamps.noStampsFound")}
              </p>
              <p className="font-letter text-xs text-foreground-muted">
                &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-items-center">
              {filteredStamps.map((stamp) => {
                const isSelected = tempSelectedId === stamp.id;
                return (
                  <div
                    key={stamp.id}
                    ref={isSelected ? selectedStampRef : undefined}
                    onClick={() => {
                      setTempSelectedId(stamp.id);
                    }}
                    className={cn(
                      "group relative flex flex-col items-center p-3 rounded-xs border transition-all cursor-pointer w-full max-w-[145px]",
                      isSelected
                        ? "bg-manila border-wax shadow-xs ring-1 ring-wax"
                        : "bg-parchment border-crease hover:border-ink/50 hover:bg-manila/40",
                    )}
                  >
                    <div className="relative my-1">
                      <Stamp
                        id={stamp.id}
                        size="md"
                        interactive={false}
                        selected={isSelected}
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
                        title={t(`stamps.items.${stamp.id}.name`)}
                      >
                        {t(`stamps.items.${stamp.id}.name`)}
                      </span>
                      <span className="block font-letter text-[9px] text-foreground-muted truncate">
                        {t(`stamps.items.${stamp.id}.denomination`)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-crease bg-manila/50 flex flex-col gap-3 shrink-0">
          <div className="text-left space-y-1">
            {currentPreviewStamp ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif-editorial text-sm font-semibold text-foreground">
                    {t(`stamps.items.${currentPreviewStamp.id}.name`)}
                  </span>
                  <span className="font-letter text-[10px] px-1.5 py-0.5 rounded-xs bg-crease/60 text-foreground-muted">
                    {t(`stamps.items.${currentPreviewStamp.id}.denomination`)}
                  </span>
                  <span className="font-letter text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs border border-crease text-foreground-muted">
                    {t(`stamps.categories.${currentPreviewStamp.category}`)}
                  </span>
                </div>
                <p className="font-letter text-[10px] text-foreground-muted leading-relaxed line-clamp-2">
                  {t(`stamps.items.${currentPreviewStamp.id}.description`)}
                </p>
              </div>
            ) : (
              <p className="font-letter text-xs text-foreground-muted">
                {t("stamps.subtitle")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            {allowRemove && tempSelectedId && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 text-xs font-letter border border-crease rounded-xs text-foreground-muted hover:text-wax hover:border-wax transition-colors cursor-pointer"
              >
                {t("stamps.removeStamp")}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-letter border border-crease rounded-xs text-foreground hover:bg-crease/40 transition-colors cursor-pointer"
            >
              {t("stamps.cancel")}
            </button>

            <button
              type="button"
              disabled={!tempSelectedId}
              onClick={handleApply}
              className={cn(
                "px-4 py-2 text-xs font-letter font-semibold uppercase tracking-wider bg-wax hover:bg-wax-hover text-on-wax rounded-xs transition-colors cursor-pointer shadow-xs",
                !tempSelectedId && "opacity-50 cursor-not-allowed",
              )}
            >
              {t("stamps.affixStamp")}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function StampPickerModal({
  isOpen,
  onClose,
  selectedStampId,
  onSelectStamp,
  allowRemove = true,
  className,
}: StampPickerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="stamp-picker-title"
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
    </AnimatePresence>
  );
}
