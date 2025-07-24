import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { tagSlugToDisplayName, getTagVariations } from "@/lib/utils";
import { ArrowLeft, Hash, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { CollectionPage, WithContext } from "schema-dts";

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
  const tagName = tagSlugToDisplayName(slug);
  
  // Fetch tag posts to get count
  const { posts: tagPosts } = await wisp.getPosts({ tags: getTagVariations(slug) });
  const postCount = tagPosts.length;
  
  const metaTitle = postCount > 0 
    ? `${tagName} Articles (${postCount}) - AI Insights | Intelpedia`
    : `${tagName} Articles - AI Insights | Intelpedia`;
  
  const metaDescription = postCount > 0
    ? `Read ${postCount} expert articles about ${tagName}. Discover AI tools, techniques, tutorials, and insights on ${tagName.toLowerCase()} at Intelpedia.`
    : `Explore expert articles about ${tagName}. Discover AI tools, techniques, tutorials, and insights on ${tagName.toLowerCase()} at Intelpedia.`;

  const ogImage = signOgImageUrl({
    title: tagName,
    label: "AI Articles & Insights",
    brand: config.blog.name,
  });
  
  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      tagName, 
      `${tagName} AI`,
      "AI articles", 
      "AI insights", 
      "AI tools", 
      "artificial intelligence", 
      "AI tutorials",
      "AI techniques",
      "machine learning",
      "deep learning"
    ],
    authors: [{ name: "Intelpedia" }],
    creator: "Intelpedia",
    publisher: "Intelpedia",
    alternates: {
      canonical: `${config.baseUrl}/tag/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${config.baseUrl}/tag/${slug}`,
      siteName: config.blog.name,
      locale: 'en_US',
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tagName} AI Articles and Insights`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: "@intelpedia",
      images: [ogImage],
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
  
  // Try to get posts using different tag variations
  let result = await wisp.getPosts({ limit: 6, tags: [slug], page });
  
  // If no posts found, try with different tag variations based on your DB format
  if (result.posts.length === 0) {
    const tagVariations = getTagVariations(slug);
    
    for (const tagVariation of tagVariations) {
      result = await wisp.getPosts({ limit: 6, tags: [tagVariation], page });
      if (result.posts.length > 0) break;
    }
  }
  
  const tagName = tagSlugToDisplayName(slug);
  const totalPosts = result.posts.length;
  
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tagName} Articles`,
    description: `Collection of AI articles and insights about ${tagName}`,
    url: `${config.baseUrl}/tag/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${tagName} Articles`,
      description: `Articles tagged with ${tagName}`,
      numberOfItems: totalPosts,
      itemListElement: result.posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description || `Article about ${tagName}`,
          url: `${config.baseUrl}/blog/${post.slug}`,
          author: {
            "@type": "Person",
            name: post.author.name || "Intelpedia",
          },
          datePublished: post.publishedAt ? (post.publishedAt instanceof Date ? post.publishedAt.toISOString() : new Date(post.publishedAt).toISOString()) : undefined,
          dateModified: post.updatedAt ? (post.updatedAt instanceof Date ? post.updatedAt.toISOString() : new Date(post.updatedAt).toISOString()) : undefined,
        }
      }))
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: config.baseUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tags",
          item: `${config.baseUrl}/tag`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tagName,
          item: `${config.baseUrl}/tag/${slug}`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            {slug}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
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
    </div>
    </>
  );
};

export default Page;
