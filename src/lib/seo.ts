import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { SupportedLanguage } from "@/types/timeecho";
import { getTranslation } from "@/lib/i18n";

export type SeoPageKey =
  | "about"
  | "privacy"
  | "terms"
  | "login"
  | "checkEmail"
  | "dashboard"
  | "compose"
  | "analytics"
  | "settings";

interface PageMetadataOptions {
  pageKey?: SeoPageKey;
  pathname?: string;
  noIndex?: boolean;
  follow?: boolean;
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  return "https://timeecho.me";
}

export async function resolveRequestLocale(): Promise<SupportedLanguage> {
  const headerList = await headers();
  const headerLocale = headerList.get("x-locale");
  if (headerLocale === "en" || headerLocale === "es") {
    return headerLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale =
    cookieStore.get("timeecho_locale")?.value ||
    cookieStore.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "es") {
    return cookieLocale;
  }

  const acceptLanguage = headerList.get("accept-language") || "";
  return acceptLanguage.toLowerCase().startsWith("en") ? "en" : "es";
}

export async function buildPageMetadata({
  pageKey,
  pathname = "/",
  noIndex = false,
  follow = !noIndex,
}: PageMetadataOptions = {}): Promise<Metadata> {
  const locale = await resolveRequestLocale();
  const siteUrl = getSiteUrl();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonicalUrl =
    normalizedPath === "/" ? siteUrl : `${siteUrl}${normalizedPath}`;

  const defaultTitle = getTranslation(locale, "metadata.title");
  const title = pageKey
    ? getTranslation(locale, `metadata.pages.${pageKey}.title`)
    : defaultTitle;
  const description = pageKey
    ? getTranslation(locale, `metadata.pages.${pageKey}.description`)
    : getTranslation(locale, "metadata.description");

  const keywordsRaw = getTranslation(locale, "metadata.keywords");
  const keywords = keywordsRaw.split(",").map((item) => item.trim());
  const ogImageAlt = getTranslation(locale, "metadata.ogImageAlt");
  const ogImageUrl = `/images/letter-preview-${locale}.png`;
  const ogLocale = locale === "en" ? "en_US" : "es_LA";
  const alternateOgLocale = locale === "en" ? "es_LA" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: pageKey
      ? title
      : {
          default: defaultTitle,
          template: "%s | TimeEcho",
        },
    description,
    applicationName: "TimeEcho",
    keywords,
    authors: [{ name: "TimeEcho", url: siteUrl }],
    creator: "TimeEcho",
    publisher: "TimeEcho",
    category: "lifestyle",
    alternates: noIndex
      ? undefined
      : {
          canonical: canonicalUrl,
          languages: {
            es: `${canonicalUrl}?locale=es`,
            en: `${canonicalUrl}?locale=en`,
            "x-default": canonicalUrl,
          },
        },
    openGraph: {
      type: "website",
      siteName: "TimeEcho",
      title: pageKey ? `${title} | TimeEcho` : defaultTitle,
      description,
      url: canonicalUrl,
      locale: ogLocale,
      alternateLocale: [alternateOgLocale],
      images: [
        {
          url: ogImageUrl,
          width: 1897,
          height: 1030,
          alt: ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageKey ? `${title} | TimeEcho` : defaultTitle,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: !noIndex,
      follow,
      googleBot: {
        index: !noIndex,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim(),
          },
        }
      : {}),
  };
}

export function buildSiteJsonLd(locale: SupportedLanguage) {
  const siteUrl = getSiteUrl();
  const title = getTranslation(locale, "metadata.title");
  const description = getTranslation(locale, "metadata.description");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "TimeEcho",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon.png`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "TimeEcho",
        description,
        inLanguage: ["es", "en"],
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#webapp`,
        name: "TimeEcho",
        headline: title,
        url: siteUrl,
        description,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "All",
        inLanguage: locale,
        image: `${siteUrl}/images/letter-preview-${locale}.png`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}

export function buildAboutJsonLd(locale: SupportedLanguage) {
  const siteUrl = getSiteUrl();
  const title = getTranslation(locale, "metadata.pages.about.title");
  const description = getTranslation(
    locale,
    "metadata.pages.about.description",
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about#webpage`,
        url: `${siteUrl}/about`,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "TimeEcho",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: getTranslation(locale, "footer.about"),
            item: `${siteUrl}/about`,
          },
        ],
      },
    ],
  };
}
