import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

const staticPaths = ["", "about", "privacy-policy", "terms-of-service"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = staticPaths.map((path) => ({
    url: path === "" ? config.baseUrl : urlJoin(config.baseUrl, path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.9,
  }));
  return paths;
}
