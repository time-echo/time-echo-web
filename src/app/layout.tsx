import type { Metadata } from "next";
import { Suspense } from "react";
import { fraunces, courierPrime, plexSans } from "@/lib/fonts";
import { TimeEchoProvider } from "@/lib/context/TimeEchoContext";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeEcho — Una cápsula del tiempo digital para el alma",
  description:
    "Escribe hoy a la persona en la que te convertirás. Bóveda epistolar cifrada con lacre y verificación de realidad.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${courierPrime.variable} ${plexSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-parchment text-foreground font-ui antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <TimeEchoProvider>
          <Suspense fallback={<div className="min-h-screen bg-parchment" />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </TimeEchoProvider>
      </body>
    </html>
  );
}
