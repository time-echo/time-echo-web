import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: "checkEmail",
    pathname: "/check_email",
    noIndex: true,
    follow: false,
  });
}

export default function CheckEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
