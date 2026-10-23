import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { SupportedLanguage } from "@/types/timeecho";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale =
    cookieStore.get("timeecho_locale")?.value ||
    cookieStore.get("NEXT_LOCALE")?.value;

  let locale: SupportedLanguage = "es";
  if (cookieLocale === "en" || cookieLocale === "es") {
    locale = cookieLocale;
  } else {
    const headerList = await headers();
    const headerLocale = headerList.get("x-locale");
    if (headerLocale === "en" || headerLocale === "es") {
      locale = headerLocale as SupportedLanguage;
    } else {
      const acceptLanguage = headerList.get("accept-language") || "";
      locale = acceptLanguage.toLowerCase().startsWith("en") ? "en" : "es";
    }
  }

  const messages = (await import(`../lib/i18n/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
