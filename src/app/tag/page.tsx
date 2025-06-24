import { TagCard } from "@/components/TagCard";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Topics & Categories - Browse by Tags | Intelpedia",
    description: "Explore AI tools, image generation, prompting techniques, and artificial intelligence topics by category. Discover ChatGPT, Midjourney, Stable Diffusion, and more AI content.",
    keywords: ["AI topics", "AI categories", "AI tools", "AI image generation", "AI prompting", "ChatGPT", "Midjourney", "Stable Diffusion", "artificial intelligence"],
    openGraph: {
      title: "AI Topics & Categories - Browse by Tags",
      description: "Explore AI tools, image generation, prompting techniques, and artificial intelligence topics by category.",
      url: `${config.baseUrl}/tag`,
      siteName: "Intelpedia",
      type: "website",
      images: [
        signOgImageUrl({
          title: "AI Topics & Categories",
          label: "Browse by Tags",
          brand: config.blog.name,
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Topics & Categories - Browse by Tags",
      description: "Explore AI tools, image generation, prompting techniques, and artificial intelligence topics by category.",
    },
  };
}

export default async function Page() {
  const result = await wisp.getTags();

  return (
    <div className="container mx-auto px-5">      
      <div className="mt-20 mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Explore All Topics</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover articles organized by topics. From web development to AI, find exactly what you&apos;re looking for.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
        {result.tags.map((tag, index) => (
          <TagCard key={tag.id} tag={tag} index={index} />
        ))}
      </div>
    </div>
  );
}
