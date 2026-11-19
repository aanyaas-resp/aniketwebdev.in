import type { MetadataRoute } from "next";
import { getBlogSlugs } from "@/lib/content";
import { getAllServiceSlugs } from "@/lib/services";
import { siteUrl } from "@/lib/seo";
import { LOCATION_PAGES } from "@/lib/locations";
import { CITIES } from "@/lib/cities";
import { INDIA_REGIONS } from "@/lib/india-regions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const posts = await getBlogSlugs();

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/locations`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...CITIES.map((c) => ({ url: `${base}/cities/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...getAllServiceSlugs().map((slug) => ({
      url: `${base}/servicesweoffer/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...LOCATION_PAGES.map((p) => ({
      url: `${base}/developers/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...INDIA_REGIONS.map((region) => ({
      url: `${base}/locations/${region.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
