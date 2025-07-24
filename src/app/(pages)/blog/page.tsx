import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { config } from "@/config";
import { wisp } from "@/lib/wisp";
import { normalizeTagSlug } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

// Enable ISR with 1 hour revalidation for blog listing page
export const revalidate = 3600; // 1 hour in seconds

interface SearchParams {
  page?: string;
}

interface BlogPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Blog - Latest AI Tools, Prompting & Image Generation Tutorials |",
  description: "Discover comprehensive guides, tutorials, and insights on AI tools, prompt engineering, and AI image generation. Stay updated with the latest trends in artificial intelligence and digital innovation.",
  keywords: ["AI tools", "prompt engineering", "AI image generation", "artificial intelligence", "machine learning", "digital innovation", "technology tutorials", "AI guides"],
  authors: [{ name: config.blog.name }],
  creator: config.blog.name,
  publisher: config.blog.name,
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
    title: "Blog - Latest AI Tools, Prompting & Image Generation Tutorials | " + config.blog.name,
    description: "Discover comprehensive guides, tutorials, and insights on AI tools, prompt engineering, and AI image generation. Stay updated with the latest trends in artificial intelligence.",
    url: config.baseUrl + "/blog",
    siteName: config.blog.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: config.baseUrl + "/images/blog-og.png",
        width: 1200,
        height: 630,
        alt: config.blog.name + " Blog - AI Tools and Tutorials",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog - Latest AI Tools, Prompting & Image Generation Tutorials | " + config.blog.name,
    description: "Discover comprehensive guides, tutorials, and insights on AI tools, prompt engineering, and AI image generation.",
    creator: "@" + config.blog.name.toLowerCase().replace(/\s+/g, ''),
    images: [config.baseUrl + "/images/blog-og.jpg"],
  },
  alternates: {
    canonical: config.baseUrl + "/blog",
    types: {
      'application/rss+xml': [
        {
          url: config.baseUrl + "/rss",
          title: config.blog.name + " RSS Feed",
        },
      ],
    },
  },
  category: 'technology',
};

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12; // 12 posts per page as requested

  // Fetch posts and tags in parallel
  const [{ posts, pagination }, tagsResult, recentPostsResult] = await Promise.all([
    wisp.getPosts({
      limit,
      page,
    }),
    wisp.getTags(),
    wisp.getPosts({
      limit: 5,
      page: 1,
    })
  ]);

  return (
    <div className="container mx-auto px-5">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8 md:pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            IntelPedia Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tutorials, and stories about AI tools, prompting, and AI Image Generation.
          </p>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            
            {/* Blog Posts Grid */}
            {posts.length > 0 ? (
              <>
                {/* Posts per page indicator */}
                <div className="flex justify-between items-center mb-8">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, (page - 1) * limit + posts.length)} of {pagination.totalPosts || 'many'} posts
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {pagination.totalPages}
                  </div>
                </div>

                {/* Posts Grid - 3 per row */}
                <BlogPostsPreview 
                  posts={posts} 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mb-12"
                />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12 mb-8">
                    <BlogPostsPagination 
                      pagination={pagination} 
                      basePath="/blog?page=" 
                    />
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                  📝
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  No posts found
                </h3>
                <p className="text-muted-foreground">
                  We&apos;re working on adding new content. Check back soon!
                </p>
              </div>
            )}

            {/* Real Tags Section */}
            {posts.length > 0 && tagsResult.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Explore Topics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tagsResult.tags.slice(0, 8).map((tag, index) => {
                    const icons = ['💻', '⚡', '🤖', '🎨', '🔧', '📱', '🚀', '💡'];
                    const tagSlug = normalizeTagSlug(tag.name);
                    return (
                      <Link key={tag.id} href={`/tag/${tagSlug}`} className="bg-muted rounded-lg p-4 text-center hover:bg-accent transition-colors cursor-pointer block">
                        <div className="text-2xl mb-2">
                          {icons[index % icons.length]}
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {tag.name}
                        </p>
                      </Link>
                    );
                  })}
                </div>
                {tagsResult.tags.length > 8 && (
                  <div className="text-center mt-6">
                    <Link href="/tag" className="text-muted-foreground hover:text-foreground font-medium">
                      View All Topics →
                    </Link>
                  </div>
                )}
              </div>
            )}

          </main>

          {/* Blog Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-3">
            <div className="sticky top-8 space-y-6">
              
              {/* Popular Tags */}
              {tagsResult.tags.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                    <span className="text-xl mr-2">🏷️</span>
                    Popular Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsResult.tags.slice(0, 10).map((tag) => {
                      const tagSlug = normalizeTagSlug(tag.name);
                      return (
                        <Link key={tag.id} href={`/tag/${tagSlug}`}>
                          <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-border">
                            {tag.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              {recentPostsResult.posts.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                    <span className="text-xl mr-2">📚</span>
                    Recent Articles
                  </h3>
                  <div className="space-y-3">
                    {recentPostsResult.posts.slice(0, 5).map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="group cursor-pointer">
                          <h4 className="text-sm font-medium text-card-foreground group-hover:text-muted-foreground transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Recent'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-muted-foreground mb-3">
                  <div className="text-2xl mb-2">📧</div>
                  <h3 className="text-lg font-semibold text-card-foreground">Stay Updated</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest AI insights and tutorials delivered to your inbox
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/rss" target="_blank">
                    <span className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors text-sm font-medium">
                      Subscribe to RSS
                    </span>
                  </Link>
                  <Link href="mailto:contact@intelpedia.tech">
                    <span className="block w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-4 py-2 rounded-md transition-colors text-sm font-medium">
                      Get in Touch
                    </span>
                  </Link>
                </div>
              </div>

              {/* Archive by Month */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                  <span className="text-xl mr-2">📅</span>
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    • All Articles
                  </Link>
                  <Link href="/tag" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    • Browse by Topic
                  </Link>
                  <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    • About Intelpedia
                  </Link>
                  <Link href="/tools" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    • AI Tools Directory
                  </Link>
                </div>
              </div>

              {/* Search Widget */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                  <span className="text-xl mr-2">🔍</span>
                  Explore More
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for something specific? Browse our content by category or use our site search.
                </p>
                <Link href="/" className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors text-sm font-medium text-center">
                  Back to Home
                </Link>
              </div>

            </div>
          </aside>

         
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
