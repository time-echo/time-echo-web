"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn, formatLocaleDate } from "@/lib/utils";
import { SupportedLanguage } from "@/types/timeecho";

export interface ArchivalDatePickerProps {
  id?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string; // YYYY-MM-DD
  locale?: SupportedLanguage;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

function parseISODate(iso: string) {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10) - 1, // 0-indexed
    day: parseInt(match[3], 10),
  };
}

function toISODate(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, "0");
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ArchivalDatePicker({
  id,
  value,
  onChange,
  min,
  locale = "es",
  className,
  placeholder,
  disabled = false,
  hasError = false,
}: ArchivalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const effectiveMin = useMemo(() => {
    if (min) return min;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toISODate(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
    );
  }, [min]);

  const minParsed = useMemo(() => parseISODate(effectiveMin), [effectiveMin]);

  const parsedValue = useMemo(() => parseISODate(value), [value]);

  // Track external value changes during render without cascading effects
  const [prevValue, setPrevValue] = useState(value);
  const [viewDate, setViewDate] = useState(() => {
    if (parsedValue) {
      return { year: parsedValue.year, month: parsedValue.month };
    }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  if (prevValue !== value) {
    setPrevValue(value);
    if (parsedValue) {
      setViewDate({ year: parsedValue.year, month: parsedValue.month });
    }
  }

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const weekdays = locale === "es" ? WEEKDAYS_ES : WEEKDAYS_EN;

  const monthName = useMemo(() => {
    const raw = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
      month: "long",
    }).format(new Date(viewDate.year, viewDate.month, 1));
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [locale, viewDate.year, viewDate.month]);

  const displayFormatted = useMemo(() => {
    if (!value) {
      return (
        placeholder ||
        (locale === "es" ? "Elige una fecha..." : "Select a date...")
      );
    }
    return formatLocaleDate(value, locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [value, locale, placeholder]);

  const canGoPrevYear = useMemo(() => {
    if (!minParsed) return true;
    return viewDate.year - 1 >= minParsed.year;
  }, [minParsed, viewDate.year]);

  const canGoPrevMonth = useMemo(() => {
    if (!minParsed) return true;
    if (viewDate.year < minParsed.year) return false;
    if (viewDate.year === minParsed.year && viewDate.month <= minParsed.month)
      return false;
    return true;
  }, [minParsed, viewDate.year, viewDate.month]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewDate.year, viewDate.month, 1);
    let startDayOfWeek = firstDay.getDay() - 1; // 0 is Mon, 6 is Sun
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const daysInMonth = new Date(
      viewDate.year,
      viewDate.month + 1,
      0,
    ).getDate();
    const daysInPrevMonth = new Date(
      viewDate.year,
      viewDate.month,
      0,
    ).getDate();

    const days: Array<{
      year: number;
      month: number;
      day: number;
      isCurrentMonth: boolean;
      iso: string;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    const now = new Date();
    const todayISO = toISODate(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Previous month padding
    const prevMonthYear =
      viewDate.month === 0 ? viewDate.year - 1 : viewDate.year;
    const prevMonthIdx = viewDate.month === 0 ? 11 : viewDate.month - 1;

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const iso = toISODate(prevMonthYear, prevMonthIdx, d);
      days.push({
        year: prevMonthYear,
        month: prevMonthIdx,
        day: d,
        isCurrentMonth: false,
        iso,
        isDisabled: Boolean(effectiveMin && iso < effectiveMin),
        isSelected: iso === value,
        isToday: iso === todayISO,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISODate(viewDate.year, viewDate.month, d);
      days.push({
        year: viewDate.year,
        month: viewDate.month,
        day: d,
        isCurrentMonth: true,
        iso,
        isDisabled: Boolean(effectiveMin && iso < effectiveMin),
        isSelected: iso === value,
        isToday: iso === todayISO,
      });
    }

    // Next month padding to complete row of 7
    const nextMonthYear =
      viewDate.month === 11 ? viewDate.year + 1 : viewDate.year;
    const nextMonthIdx = viewDate.month === 11 ? 0 : viewDate.month + 1;
    const remainder = days.length % 7;
    if (remainder !== 0) {
      const toAdd = 7 - remainder;
      for (let d = 1; d <= toAdd; d++) {
        const iso = toISODate(nextMonthYear, nextMonthIdx, d);
        days.push({
          year: nextMonthYear,
          month: nextMonthIdx,
          day: d,
          isCurrentMonth: false,
          iso,
          isDisabled: Boolean(effectiveMin && iso < effectiveMin),
          isSelected: iso === value,
          isToday: iso === todayISO,
        });
      }
    }

    return days;
  }, [viewDate.year, viewDate.month, effectiveMin, value]);

  const handlePrevMonth = useCallback(() => {
    if (!canGoPrevMonth) return;
    setViewDate((prev) => {
      const prevMonth = prev.month === 0 ? 11 : prev.month - 1;
      const prevYear = prev.month === 0 ? prev.year - 1 : prev.year;
      return { year: prevYear, month: prevMonth };
    });
  }, [canGoPrevMonth]);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => {
      const nextMonth = prev.month === 11 ? 0 : prev.month + 1;
      const nextYear = prev.month === 11 ? prev.year + 1 : prev.year;
      return { year: nextYear, month: nextMonth };
    });
  }, []);

  const handlePrevYear = useCallback(() => {
    if (!canGoPrevYear) return;
    setViewDate((prev) => ({ ...prev, year: prev.year - 1 }));
  }, [canGoPrevYear]);

  const handleNextYear = useCallback(() => {
    setViewDate((prev) => ({ ...prev, year: prev.year + 1 }));
  }, []);

  const handleSelectDay = (iso: string) => {
    if (effectiveMin && iso < effectiveMin) return;
    onChange(iso);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full font-letter">
      {/* Trigger button/field */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(
          "w-full paper-sheet rounded-xs px-3 py-2 text-xs border font-letter text-foreground flex items-center justify-between cursor-pointer transition-colors text-left",
          hasError
            ? "border-wax/80 focus:border-wax"
            : isOpen
              ? "border-wax ring-1 ring-wax/30"
              : "border-crease hover:border-wax/50 focus:border-wax",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <span className={cn("truncate", !value && "text-foreground-muted")}>
          {displayFormatted}
        </span>
        <CalendarIcon
          size={14}
          className="text-foreground-muted shrink-0 ml-2"
        />
      </button>

      {/* Calendar Dropdown Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={locale === "es" ? "Calendario" : "Calendar"}
          className="absolute z-50 mt-1.5 left-0 w-72 sm:w-80 paper-sheet rounded-xs border border-crease p-4 bg-parchment shadow-xl font-letter select-none animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-crease gap-1">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevYear}
                disabled={!canGoPrevYear}
                title={locale === "es" ? "Año anterior" : "Previous year"}
                className={cn(
                  "p-1 rounded-xs text-foreground-muted transition-colors",
                  canGoPrevYear
                    ? "hover:bg-manila/50 hover:text-foreground cursor-pointer"
                    : "opacity-20 cursor-not-allowed",
                )}
              >
                <ChevronsLeft size={15} />
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={!canGoPrevMonth}
                title={locale === "es" ? "Mes anterior" : "Previous month"}
                className={cn(
                  "p-1 rounded-xs text-foreground-muted transition-colors",
                  canGoPrevMonth
                    ? "hover:bg-manila/50 hover:text-foreground cursor-pointer"
                    : "opacity-20 cursor-not-allowed",
                )}
              >
                <ChevronLeft size={15} />
              </button>
            </div>

            <div className="font-serif-editorial text-sm font-semibold text-foreground text-center truncate px-1">
              {monthName}{" "}
              <span className="font-letter text-xs text-foreground-muted">
                {viewDate.year}
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleNextMonth}
                title={locale === "es" ? "Mes siguiente" : "Next month"}
                className="p-1 rounded-xs hover:bg-manila/50 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                onClick={handleNextYear}
                title={locale === "es" ? "Año siguiente" : "Next year"}
                className="p-1 rounded-xs hover:bg-manila/50 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
            {weekdays.map((wd) => (
              <span
                key={wd}
                className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {calendarDays.map((item, idx) => {
              if (item.isDisabled) {
                return (
                  <span
                    key={`${item.iso}-${idx}`}
                    className="h-7 w-full flex items-center justify-center text-[11px] text-foreground-muted/30 cursor-not-allowed select-none font-letter"
                  >
                    {item.day}
                  </span>
                );
              }

              return (
                <button
                  key={`${item.iso}-${idx}`}
                  type="button"
                  onClick={() => handleSelectDay(item.iso)}
                  className={cn(
                    "h-7 w-full flex items-center justify-center text-[11px] rounded-xs font-letter transition-all cursor-pointer",
                    item.isSelected
                      ? "bg-wax text-on-wax font-semibold shadow-2xs"
                      : item.isToday
                        ? "border border-crease font-semibold hover:bg-manila/50 text-foreground"
                        : item.isCurrentMonth
                          ? "text-foreground hover:bg-manila/50 hover:text-ink"
                          : "text-foreground-muted/60 hover:bg-manila/40",
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2.5 border-t border-crease flex items-center justify-between text-[10px] text-foreground-muted">
            <span>{locale === "es" ? "Sello archival" : "Archival seal"}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground underline transition-colors cursor-pointer"
            >
              {locale === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
