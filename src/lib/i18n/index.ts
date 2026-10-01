import es from "./es.json";
import en from "./en.json";
import { SupportedLanguage } from "@/types/timeecho";

export const translations = {
  es,
  en,
} as const;

export type TranslationDictionary = typeof es;

/**
 * Nested key paths helper (e.g., 'common.save' or 'dashboard.title')
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

/**
 * Retrieve translation value by dot-notated key path with interpolation support.
 * e.g., getTranslation('es', 'header.nav.vault') -> 'Bóveda'
 */
export function getTranslation(
  locale: SupportedLanguage,
  keyPath: string,
  params?: Record<string, string | number>,
): string {
  const dict = translations[locale] || translations.es;
  const segments = keyPath.split(".");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = dict;
  for (const seg of segments) {
    if (current && typeof current === "object" && seg in current) {
      current = current[seg];
    } else {
      // Fallback to Spanish dictionary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fallbackCurrent: any = translations.es;
      for (const fSeg of segments) {
        if (
          fallbackCurrent &&
          typeof fallbackCurrent === "object" &&
          fSeg in fallbackCurrent
        ) {
          fallbackCurrent = fallbackCurrent[fSeg];
        } else {
          return keyPath;
        }
      }
      current = fallbackCurrent;
      break;
    }
  }

  if (typeof current !== "string") {
    return keyPath;
  }

  // Parameter interpolation: {name} or {{name}}
  if (params) {
    return Object.entries(params).reduce((acc, [k, v]) => {
      return acc
        .replaceAll(`{{${k}}}`, String(v))
        .replaceAll(`{${k}}`, String(v));
    }, current);
  }

  return current;
}

import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export function useTranslation() {
  const { locale, setLocale, toggleLocale, t } = useTimeEcho();
  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    isEs: locale === "es",
  };
}
