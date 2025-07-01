import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { config } from "@/config";
import { wisp } from "@/lib/wisp";
import { normalizeTagSlug } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

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
  const [{ posts, pagination }, tagsResult] = await Promise.all([
    wisp.getPosts({
      limit,
      page,
    }),
    wisp.getTags()
  ]);

  return (
    <div className="container mx-auto px-5">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8 md:pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            IntelPedia Blog
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover insights, tutorials, and stories about AI tools, prompting, and AI Image Generation.
          </p>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Right Sidebar - Ads */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Ad Space 1 - Rectangle */}
              <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-2">
                  <div className="w-8 h-8 mx-auto mb-2">📺</div>
                  <p className="text-sm font-medium">Ad Space</p>
                  <p className="text-xs">300×250</p>
                </div>
              </div>

              {/* Ad Space 2 - Square */}
              <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-2">
                  <div className="w-8 h-8 mx-auto mb-2">📊</div>
                  <p className="text-sm font-medium">Ad Space</p>
                  <p className="text-xs">250×250</p>
                </div>
              </div>

              {/* Ad Space 3 - Skyscraper */}
              <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center h-96 flex flex-col justify-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="w-8 h-8 mx-auto mb-2">🏢</div>
                  <p className="text-sm font-medium">Ad Space</p>
                  <p className="text-xs">160×600</p>
                  <p className="text-xs mt-2">Skyscraper</p>
                </div>
              </div>

              {/* Ad Space 4 - Custom */}
              <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="w-6 h-6 mx-auto mb-2">💼</div>
                  <p className="text-xs font-medium">Sponsored</p>
                  <p className="text-xs">Custom Size</p>
                </div>
              </div>

              {/* Newsletter Signup - Additional Content */}
              {/* <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 text-center">
                <div className="text-indigo-600 dark:text-indigo-400 mb-3">
                  <div className="w-8 h-8 mx-auto mb-2">📧</div>
                  <p className="text-sm font-medium">Stay Updated</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                  Get the latest posts delivered to your inbox
                </p>
                <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md transition-colors">
                  Subscribe
                </button>
              </div> */}

            </div>
          </aside>
          {/* Main Content Area */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            
            {/* Blog Posts Grid */}
            {posts.length > 0 ? (
              <>
                {/* Posts per page indicator */}
                <div className="flex justify-between items-center mb-8">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, (page - 1) * limit + posts.length)} of {pagination.totalPosts || 'many'} posts
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
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
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                  📝
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We&apos;re working on adding new content. Check back soon!
                </p>
              </div>
            )}

            {/* Real Tags Section */}
            {posts.length > 0 && tagsResult.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Explore Topics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tagsResult.tags.slice(0, 8).map((tag, index) => {
                    const icons = ['💻', '⚡', '🤖', '🎨', '🔧', '📱', '🚀', '💡'];
                    const tagSlug = normalizeTagSlug(tag.name);
                    return (
                      <Link key={tag.id} href={`/tag/${tagSlug}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer block">
                        <div className="text-2xl mb-2">
                          {icons[index % icons.length]}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {tag.name}
                        </p>
                      </Link>
                    );
                  })}
                </div>
                {tagsResult.tags.length > 8 && (
                  <div className="text-center mt-6">
                    <Link href="/tag" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                      View All Topics →
                    </Link>
                  </div>
                )}
              </div>
            )}

          </main>

         
        </div>

        {/* Mobile Bottom Ad - Only visible on mobile */}
        <div className="lg:hidden mt-8">
          <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 mx-auto mb-2">📱</div>
              <p className="text-sm font-medium">Mobile Ad Space</p>
              <p className="text-xs">320×100</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
