import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { ArrowRight, BookOpen, Lightbulb, Rocket, Star } from "@/lib/icons";
import Link from "next/link";
import type { Metadata } from "next";
import type { WebSite, Organization, WithContext } from "schema-dts";
import { DynamicTagCard } from "@/components/DynamicComponents";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Intelpedia - Your AI Tools & Innovation Hub",
    description: "Discover the latest AI tools, image generation techniques, prompting strategies, and AI news. Your comprehensive guide to artificial intelligence and cutting-edge AI technologies.",
    keywords: ["AI tools", "AI image generation", "AI prompting", "AI news", "artificial intelligence", "ChatGPT", "Midjourney", "Stable Diffusion", "AI tutorials"],
    authors: [{ name: "Naseem", url: "https://intelpedia.tech" }],
    creator: "Naseem",
    publisher: "Intelpedia",
    openGraph: {
      title: "Intelpedia - Your AI Tools & Innovation Hub",
      description: "Discover the latest AI tools, image generation techniques, prompting strategies, and AI news.",
      url: config.baseUrl,
      siteName: "Intelpedia",
      type: "website",
      images: [
        signOgImageUrl({
          title: "Intelpedia",
          label: "AI Tools & Innovation Hub",
          brand: config.blog.name,
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Intelpedia - Your AI Tools & Innovation Hub",
      description: "Discover the latest AI tools, image generation techniques, prompting strategies, and AI news.",
      creator: "@intelpedia",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      // Resource hints for better performance
      "dns-prefetch": "https://fonts.googleapis.com",
      "preconnect": "https://fonts.gstatic.com",
    },
  };
}

const Page = async (
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  
  // Fetch posts and tags with optimized query
  const [postsResult, tagsResult] = await Promise.all([
    wisp.getPosts({ limit: 6, page }),
    wisp.getTags()
  ]);
  
  // Featured categories/tags to highlight - limit for performance
  const featuredTags = tagsResult.tags.slice(0, 6);
  
  // Structured data for SEO
  const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Intelpedia",
    alternateName: "Intelpedia AI Blog",
    description: "Your comprehensive guide to AI tools, image generation, prompting techniques, and artificial intelligence news.",
    url: config.baseUrl,
    author: {
      "@type": "Person",
      name: "Naseem",
      url: config.baseUrl + "/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Intelpedia",
      url: config.baseUrl,
    },
  };

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Intelpedia",
    description: "Your premier destination for AI tools, image generation techniques, prompting strategies, and artificial intelligence news and tutorials.",
    url: config.baseUrl,
    founder: {
      "@type": "Person",
      name: "Naseem",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@intelpedia.in",
      contactType: "editorial",
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, organizationSchema]),
        }}
      />
      
      <div className="min-h-screen">
          {/* Hero Section */}
        <section className="container mx-auto px-5 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Welcome to Intelpedia
            </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Where Curiosity Meets Clarity
            </h1>            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Master AI tools, image generation, prompting techniques, and AI news. Your comprehensive guide to artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8" role="button" aria-label="Explore Articles">
                <Link href="#latest-posts" >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Articles
                </Link>
              </Button>
              <Button asChild variant="outline" role="button" aria-label="About Intelpedia" size="lg" className="px-8">
                <Link href="/about">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  About Intelpedia
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="container mx-auto px-5 py-16 bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore by Tags</h2>            <p className="text-lg text-muted-foreground max-w-2xl mx-auto tagline-text">
              Dive deep into your areas of interest. AI to development tutorials.
            </p>
          </div>            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredTags.map((tag, index) => (
              <DynamicTagCard key={tag.id} tag={tag} index={index} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/tag">
                <Badge className="mr-2" variant="secondary">{tagsResult.tags.length}</Badge>
                View All Tags
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section id="latest-posts" className="container mx-auto px-5 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest Articles</h2>            <p className="text-lg text-muted-foreground max-w-2xl mx-auto tagline-text">
              Stay updated with our newest AI technology content.
            </p>
          </div>
          
          <BlogPostsPreview posts={postsResult.posts} />
          <BlogPostsPagination pagination={postsResult.pagination} />
        </section>

        {/* Newsletter/CTA Section */}
        <section className="container mx-auto px-5 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay in the Loop</h2>            <p className="text-lg text-muted-foreground mb-8 tagline-text">
              Join our AI community and get insights delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button asChild size="lg" role="button" aria-label="RSS Subscribe Button" className="md:flex-1">
                <Link href="/rss" target="_blank">
                  <Rocket className="w-5 h-5 mr-2" />
                  Subscribe to RSS
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="md:flex-1" role="button" aria-label="Contact Intelpedia">
                <Link href="mailto:contact@intelpedia.tech">
                  <Star className="w-5 h-5 mr-2" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
