import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { fraunces, courierPrime, plexSans } from "@/lib/fonts";
import { TimeEchoProvider } from "@/lib/context/TimeEchoContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { FlashProvider } from "@/components/ui/FlashBanner";
import { AnalyticsProvider } from "@/components/analytics";
import {
  buildPageMetadata,
  buildSiteJsonLd,
  resolveRequestLocale,
} from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FAF9F5",
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ pathname: "/" });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await resolveRequestLocale();
  const messages = await getMessages();
  const siteJsonLd = buildSiteJsonLd(locale);

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <TimeEchoProvider defaultLocale={locale}>
              <AnalyticsProvider>
                <FlashProvider>
                  <AppShell>{children}</AppShell>
                </FlashProvider>
              </AnalyticsProvider>
            </TimeEchoProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
