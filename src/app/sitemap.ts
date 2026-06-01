import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { allContent } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return allContent.map((entry) => ({
    url: new URL(entry.path, siteUrl).toString(),
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
