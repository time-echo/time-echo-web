import es from "./es.json";
import en from "./en.json";
import { createTranslator } from "next-intl";
import { SupportedLanguage } from "@/types/timeecho";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export { useTranslations, useLocale, useMessages, useFormatter } from "next-intl";

export const translations = {
  es,
  en,
} as const;

export type TranslationDictionary = typeof es;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

const translators = {
  es: createTranslator({ locale: "es", messages: es, onError: () => {} }),
  en: createTranslator({ locale: "en", messages: en, onError: () => {} }),
};

export function getTranslation(
  locale: SupportedLanguage,
  keyPath: string,
  params?: Record<string, string | number>,
): string {
  const translator = (translators[locale] || translators.es) as (
    k: string,
    p?: Record<string, string | number>,
  ) => string;
  const esTranslator = translators.es as (
    k: string,
    p?: Record<string, string | number>,
  ) => string;

  try {
    const res = translator(keyPath, params);
    if (res !== keyPath) {
      return res;
    }
  } catch {
    try {
      return esTranslator(keyPath, params);
    } catch {
      return keyPath;
    }
  }

  try {
    return esTranslator(keyPath, params);
  } catch {
    return keyPath;
  }
}

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
