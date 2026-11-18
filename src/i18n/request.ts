import { getRequestConfig } from "next-intl/server";
import { resolveRequestLocale } from "@/lib/seo";

export default getRequestConfig(async () => {
  const locale = await resolveRequestLocale();
  const messages = (await import(`../lib/i18n/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
