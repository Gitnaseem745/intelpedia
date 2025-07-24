import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';

// Revalidate sitemap every 6 hours to align with ISR
export const revalidate = 21600; // 6 hours in seconds

const baseUrl = process.env.NODE_ENV === 'production' ? config.baseUrl : 'http://localhost:3000';

async function getToolsData() {
  try {
    // Use direct database access for consistency with static generation
    await connectDB();
    const tools = await Tool.find({}, { _id: 1, updatedAt: 1, createdAt: 1 }).lean();
    return tools;
  } catch (error) {
    console.error('Failed to fetch tools for sitemap:', error);
    return [];
  }
}

async function getToolTags() {
  try {
    await connectDB();
    const tools = await Tool.find({}, { tags: 1 }).lean();
    // Extract unique tags
    const allTags = tools.flatMap(tool => tool.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags;
  } catch (error) {
    console.error('Failed to fetch tool tags for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getToolsData();
  const tags = await getToolTags();

  const toolsPages = [
    // Main tools page
    {
      url: urlJoin(baseUrl, "tools"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Submit tool page
    {
      url: urlJoin(baseUrl, "submit-tool"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Individual tool pages
  const toolDetailPages = tools.map((tool: any) => ({
    url: urlJoin(baseUrl, "tools", tool._id.toString()),
    lastModified: new Date(tool.updatedAt || tool.createdAt),
    changeFrequency: "weekly" as const,
    priority: tool.featured ? 0.8 : 0.7,
  }));

  // Tool tag pages
  const toolTagPages = tags.map((tag: string) => ({
    url: urlJoin(baseUrl, "tools", "tag", encodeURIComponent(tag)),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...toolsPages,
    ...toolDetailPages,
    ...toolTagPages,
  ];
}
