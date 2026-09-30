import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services-data";
import { PLATFORM } from "@/lib/platform-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://indiskaai.com";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  ...SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" },
  ...PLATFORM.map((p) => ({
    path: `/platform/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/research", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/updates", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/team", priority: 0.8, changeFrequency: "monthly" },
  { path: "/future", priority: 0.7, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/partner", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
