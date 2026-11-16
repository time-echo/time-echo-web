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
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(iso);

  return isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", options);
}
