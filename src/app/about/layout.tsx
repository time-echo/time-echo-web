import type { Metadata } from "next";
import {
  buildAboutJsonLd,
  buildPageMetadata,
  resolveRequestLocale,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "about",
    pathname: "/about",
  });
}

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await resolveRequestLocale();
  const aboutJsonLd = buildAboutJsonLd(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
