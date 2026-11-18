import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const publicRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.5 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.5 },
  ];

  return publicRoutes.map(({ path, changeFrequency, priority }) => {
    const url = `${siteUrl}${path}`;
    return {
      url,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          es: `${url}?locale=es`,
          en: `${url}?locale=en`,
        },
      },
    };
  });
}
