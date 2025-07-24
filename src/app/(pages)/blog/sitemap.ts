import { config } from "@/config";
import { wisp } from "@/lib/wisp";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

// Revalidate sitemap every 24 hours
export const revalidate = 86400;
// Alternative: Force dynamic rendering (uncomment if needed)
// export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await wisp.getPosts();
  return [
    {
      url: urlJoin(config.baseUrl, "blog"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...result.posts.map((post) => {
      return {
        url: urlJoin(config.baseUrl, "blog", post.slug),
        lastModified: new Date(post.updatedAt),
        changeFrequency: "hourly" as const,
        priority: 0.8,
      };
    }),
  ];
}
