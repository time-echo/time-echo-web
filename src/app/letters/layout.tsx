import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "compose",
    pathname: "/letters/new",
    noIndex: true,
    follow: false,
  });
}

export default function LettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
