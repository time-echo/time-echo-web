import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SupportedLanguage } from "@/types/timeecho";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLocaleDate(
  iso: string,
  locale: SupportedLanguage,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  if (!iso) return "";
  // Match date-only strings (YYYY-MM-DD) or UTC midnight strings (YYYY-MM-DDT00:00:00...Z)
  // to avoid timezone offsets shifting the calendar date backwards in western timezones.
  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s]00:00:00(?:\.000)?Z?)?$/.exec(iso);
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(iso);

  return isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", options);
}
