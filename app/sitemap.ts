import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// Only the home page is listed for search engines.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
