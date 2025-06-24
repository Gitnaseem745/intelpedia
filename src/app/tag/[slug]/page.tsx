import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { ArrowLeft, Hash, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Params {
  slug: string;
}

export async function generateMetadata(
  props: {
    params: Promise<Params>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const tagName = slug.replaceAll('-', ' ');
  
  return {
    title: `${tagName} - AI Articles & Insights | Intelpedia`,
    description: `Explore AI articles and insights tagged with ${tagName}. Discover the latest in AI tools, image generation, prompting techniques, and artificial intelligence content at Intelpedia.`,
    keywords: [tagName, "AI articles", "AI insights", "AI tools", "artificial intelligence", "AI image generation", "AI prompting", "ChatGPT", "Midjourney"],
    openGraph: {
      title: `${tagName} - AI Articles & Insights`,
      description: `Explore AI articles and insights tagged with ${tagName}. Discover the latest in AI tools and artificial intelligence content.`,
      url: `${config.baseUrl}/tag/${slug}`,
      siteName: "Intelpedia",
      type: "website",
      images: [
        signOgImageUrl({
          title: tagName,
          label: "AI Articles & Insights",
          brand: config.blog.name,
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tagName} - AI Articles & Insights`,
      description: `Explore AI articles and insights tagged with ${tagName}`,
      creator: "@intelpedia",
    },
  };
}

const Page = async (
  props: {
    params: Promise<Params>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { slug } = params;

  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const result = await wisp.getPosts({ limit: 6, tags: [slug], page });
  
  const tagName = slug.replaceAll('-', ' ');
  const totalPosts = result.pagination?.totalPages || 0;
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-5">
        {/* Navigation Breadcrumb */}
        <div className="mt-6 mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/tag">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Tags
            </Link>
          </Button>
        </div>

        {/* Tag Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
            <Hash className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 capitalize">
            {tagName}
          </h1>
          
          <div className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discover all our articles and insights about {tagName}. 
            {totalPosts > 0 && (
              <span className="block mt-2">
                <Badge variant="secondary" className="px-3 py-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {totalPosts} article{totalPosts !== 1 ? 's' : ''} found
                </Badge>
              </span>
            )}
          </div>
          
          {/* Tag Badge */}
          <Badge variant="outline" className="px-4 py-2 text-base">
            <Hash className="w-4 h-4 mr-2" />
            {tagName}
          </Badge>
        </div>

        {/* Posts Section */}
        {result.posts.length > 0 ? (
          <div className="mb-20">
            <BlogPostsPreview posts={result.posts} />
            <BlogPostsPagination
              pagination={result.pagination}
              basePath={`/tag/${slug}/?page=`}
            />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center p-4 bg-muted rounded-xl mb-6">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No Articles Found</h3>
              <p className="text-muted-foreground mb-6">
                We don&apos;t have any articles tagged with &ldquo;{tagName}&rdquo; yet. 
                Check back later or explore other topics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/tag">
                    View All Tags
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
