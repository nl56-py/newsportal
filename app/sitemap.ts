import { MetadataRoute } from "next";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { CATEGORY_MAP } from "@/lib/nepali-utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Static core routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // Category routes
  Object.keys(CATEGORY_MAP).forEach((catKey) => {
    routes.push({
      url: `${baseUrl}/category/${catKey}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    });
  });

  // Dynamic news article routes
  MOCK_ARTICLES.forEach((art) => {
    routes.push({
      url: `${baseUrl}/news/${art.slug}`,
      lastModified: new Date(art.publishedAt),
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  return routes;
}
