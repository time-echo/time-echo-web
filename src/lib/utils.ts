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
  return new Date(iso).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    options,
  );
}
