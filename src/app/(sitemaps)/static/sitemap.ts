import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

const staticPaths = [
  "", // Home page
  "about",
  "privacy-policy", 
  "terms-of-service",
  "tools", // Main tools directory
  "blog", // Main blog page
  "tag", // Tags index
  "submit-tool", // Tool submission
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = staticPaths.map((path) => ({
    url: path === "" ? config.baseUrl : urlJoin(config.baseUrl, path),
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" as const : 
                    path === "tools" || path === "blog" ? "daily" as const :
                    path === "tag" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1.0 : 
             path === "tools" || path === "blog" ? 0.9 :
             path === "about" ? 0.8 : 0.7,
  }));
  return paths;
}
