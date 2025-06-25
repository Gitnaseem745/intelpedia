import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { config } from "@/config";
import { wisp } from "@/lib/wisp";
import { normalizeTagSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await wisp.getTags();
  return [
    {
      url: urlJoin(config.baseUrl, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...result.tags.map((tag) => {
      const tagSlug = normalizeTagSlug(tag.name);
      return {
        url: urlJoin(config.baseUrl, "tag", tagSlug),
        lastModified: new Date(),
        priority: 0.8,
      };
    }),
  ];
}
