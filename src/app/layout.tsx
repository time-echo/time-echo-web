import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { fraunces, courierPrime, plexSans } from "@/lib/fonts";
import { TimeEchoProvider } from "@/lib/context/TimeEchoContext";
import { AppShell } from "@/components/layout/AppShell";
import { SupportedLanguage } from "@/types/timeecho";
import { getTranslation } from "@/lib/i18n";
import { FlashProvider } from "@/components/ui/FlashBanner";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerList = await headers();
  const cookieVal =
    cookieStore.get("timeecho_locale")?.value ||
    cookieStore.get("NEXT_LOCALE")?.value;
  const headerVal = headerList.get("x-locale");
  const locale: SupportedLanguage =
    cookieVal === "en" || headerVal === "en" ? "en" : "es";

  return {
    title: getTranslation(locale, "metadata.title"),
    description: getTranslation(locale, "metadata.description"),
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
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const headerList = await headers();
  const cookieVal =
    cookieStore.get("timeecho_locale")?.value ||
    cookieStore.get("NEXT_LOCALE")?.value;
  const headerVal = headerList.get("x-locale");
  const locale: SupportedLanguage =
    cookieVal === "en" || headerVal === "en" ? "en" : "es";
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${courierPrime.variable} ${plexSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-parchment text-foreground font-ui antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TimeEchoProvider defaultLocale={locale}>
            <FlashProvider>
              <Suspense
                fallback={<div className="min-h-screen bg-parchment" />}
              >
                <AppShell>{children}</AppShell>
              </Suspense>
            </FlashProvider>
          </TimeEchoProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
