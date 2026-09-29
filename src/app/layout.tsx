import type { Metadata } from "next";
import { fraunces, courierPrime, plexSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeEcho",
  description: "Escribe hoy a la persona en la que te convertirás.",
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
        className="bg-parchment text-foreground font-ui antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}