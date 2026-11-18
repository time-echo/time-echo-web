import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/privacy", "/terms"],
        disallow: [
          "/api/",
          "/dashboard",
          "/letters/",
          "/analytics",
          "/settings",
          "/check_email",
          "/login/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
