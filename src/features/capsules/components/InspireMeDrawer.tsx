"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Plus, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import {
  INSPIRATION_CATEGORIES,
  DEFAULT_INSPIRATION_CATEGORY_ID,
  InspirationCategoryId,
  getInspirationCategory,
} from "../data/inspirationPrompts";

export interface InspirePromptSelection {
  categoryId: InspirationCategoryId;
  promptId: string;
  promptText: string;
}

export interface InspireMeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (selection: InspirePromptSelection) => boolean;
  selectedPromptId?: string | null;
  onRemovePrompt?: () => void;
  activeCategoryId?: InspirationCategoryId;
  onCategoryChange?: (categoryId: InspirationCategoryId) => void;
  className?: string;
}

interface InspireMeContentProps {
  onClose: () => void;
  onSelectPrompt: (selection: InspirePromptSelection) => boolean;
  selectedPromptId?: string | null;
  onRemovePrompt?: () => void;
  activeCategoryId: InspirationCategoryId;
  onCategoryChange: (categoryId: InspirationCategoryId) => void;
}

function InspireMeContent({
  onClose,
  onSelectPrompt,
  selectedPromptId,
  onRemovePrompt,
  activeCategoryId,
  onCategoryChange,
}: InspireMeContentProps) {
  const { t } = useTimeEcho();
  const [limitReached, setLimitReached] = useState(false);

  const activeCategory = getInspirationCategory(activeCategoryId);
  const hasAppliedPrompt = Boolean(selectedPromptId);

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

  const handleCategorySelect = (categoryId: InspirationCategoryId) => {
    setLimitReached(false);
    onCategoryChange(categoryId);
  };

  const handleRemove = () => {
    setLimitReached(false);
    onRemovePrompt?.();
  };

  const handlePromptClick = (promptId: string, promptText: string) => {
    if (selectedPromptId === promptId) {
      handleRemove();
      return;
    }

    if (hasAppliedPrompt) return;

    const inserted = onSelectPrompt({
      categoryId: activeCategory.id,
      promptId,
      promptText,
    });

    if (!inserted) {
      setLimitReached(true);
      return;
    }

    setLimitReached(false);
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
        <div className="p-4 sm:p-5 border-b border-crease bg-manila/40 shrink-0 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-wax shrink-0" />
                <h2
                  id="inspire-me-drawer-title"
                  className="font-serif-editorial text-xl font-semibold text-foreground leading-tight"
                >
                  {t("inspireMe.drawerTitle")}
                </h2>
              </div>
              <p className="font-letter text-xs text-foreground-muted leading-relaxed">
                {t("inspireMe.drawerSubtitle")}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("inspireMe.close")}
              className="p-2 rounded-xs text-foreground-muted hover:text-foreground hover:bg-crease/40 transition-colors cursor-pointer shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center border border-crease bg-parchment"
            >
              <X size={16} />
            </button>
          </div>

          <div
            role="tablist"
            aria-label={t("inspireMe.categoriesAria")}
            className="flex flex-wrap gap-1.5 pt-0.5"
          >
            {INSPIRATION_CATEGORIES.map((category) => {
              const isSelected = category.id === activeCategory.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`inspire-panel-${category.id}`}
                  id={`inspire-tab-${category.id}`}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "px-2.5 py-1.5 text-[11px] font-letter rounded-xs transition-colors whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-wax text-on-wax font-semibold shadow-2xs"
                      : "bg-parchment text-foreground-muted hover:text-foreground hover:border-ink/50 border border-crease",
                  )}
                >
                  {t(category.nameKey)}
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`inspire-panel-${activeCategory.id}`}
          aria-labelledby={`inspire-tab-${activeCategory.id}`}
          className="flex-1 overflow-y-auto p-4 sm:p-5 bg-parchment/60 space-y-4 scrollbar-thin"
        >
          {hasAppliedPrompt && (
            <div
              role="status"
              className="paper-sheet rounded-xs p-3.5 border border-ink/30 bg-manila/60 text-foreground font-letter text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <span className="leading-relaxed">
                {t("inspireMe.onePromptLimit")}
              </span>
              {onRemovePrompt && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2.5 py-1.5 text-[11px] font-letter border border-crease rounded-xs bg-parchment text-foreground-muted hover:text-wax hover:border-wax transition-colors cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-center"
                >
                  {t("inspireMe.removePrompt")}
                </button>
              )}
            </div>
          )}

          <div className="border-b border-dashed border-crease pb-3 space-y-1">
            <h3 className="font-serif-editorial text-base font-semibold text-foreground">
              {t(activeCategory.nameKey)}
            </h3>
            <p className="font-letter text-xs text-foreground-muted italic">
              {t(activeCategory.descriptionKey)}
            </p>
          </div>

          {limitReached && (
            <div
              role="alert"
              className="paper-sheet rounded-xs p-3.5 border border-wax/40 bg-wax/5 text-foreground font-letter text-xs flex items-start gap-2.5"
            >
              <AlertCircle size={15} className="text-wax shrink-0 mt-0.5" />
              <span>{t("inspireMe.maxLengthWarning")}</span>
            </div>
          )}

          {activeCategory.prompts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-serif-editorial text-base text-foreground-muted">
                {t("inspireMe.emptyCategory")}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeCategory.prompts.map((prompt) => {
                const promptText = t(prompt.textKey);
                const isSelectedPrompt = selectedPromptId === prompt.id;
                const isDisabled = hasAppliedPrompt && !isSelectedPrompt;

                return (
                  <button
                    key={prompt.id}
                    type="button"
                    disabled={isDisabled}
                    aria-pressed={isSelectedPrompt}
                    onClick={() => handlePromptClick(prompt.id, promptText)}
                    className={cn(
                      "group w-full text-left p-4 rounded-xs border transition-all flex items-start justify-between gap-3 shadow-2xs",
                      isSelectedPrompt
                        ? "bg-manila border-wax hover:bg-manila/80 cursor-pointer"
                        : isDisabled
                          ? "bg-parchment/70 border-crease opacity-55 cursor-not-allowed"
                          : "bg-parchment border-crease hover:border-wax/60 hover:bg-manila/40 cursor-pointer",
                    )}
                  >
                    <span className="font-serif-editorial text-[15px] leading-relaxed text-foreground">
                      {promptText}
                    </span>
                    {isSelectedPrompt ? (
                      <span className="inline-flex items-center gap-1 shrink-0 pt-1 font-letter text-[10px] uppercase tracking-wider font-semibold text-wax">
                        <Check size={13} strokeWidth={2.5} />
                        <span className="hidden sm:inline">
                          {t("inspireMe.selected")}
                        </span>
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 shrink-0 pt-1 font-letter text-[10px] uppercase tracking-wider font-semibold text-foreground-muted transition-colors",
                          !isDisabled && "group-hover:text-wax",
                        )}
                      >
                        <Plus size={13} />
                        <span className="hidden sm:inline">
                          {t("inspireMe.usePrompt")}
                        </span>
                      </span>
                    )}
                  </button>
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

export function InspireMeDrawer({
  isOpen,
  onClose,
  onSelectPrompt,
  selectedPromptId,
  onRemovePrompt,
  activeCategoryId,
  onCategoryChange,
  className,
}: InspireMeDrawerProps) {
  const [internalCategoryId, setInternalCategoryId] =
    useState<InspirationCategoryId>(DEFAULT_INSPIRATION_CATEGORY_ID);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  const resolvedCategoryId = activeCategoryId ?? internalCategoryId;
  const handleCategoryChange = onCategoryChange ?? setInternalCategoryId;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspire-me-drawer-title"
          className={cn(
            "fixed inset-0 z-50 flex justify-end overflow-hidden",
            className,
          )}
        >
          <InspireMeContent
            onClose={onClose}
            onSelectPrompt={onSelectPrompt}
            selectedPromptId={selectedPromptId}
            onRemovePrompt={onRemovePrompt}
            activeCategoryId={resolvedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
