import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { RelatedPosts } from "@/components/RelatedPosts";
// import { 
//   TopBannerAd, 
//   SidebarAd, 
//   InContentAd, 
//   MobileAd, 
//   SquareAd,
//   AdSlot 
// } from "@/components/AdSlot";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  const { slug } = params;

  const result = await wisp.getPost(slug); 
  if (!result || !result.post) {
    return {
      title: "Blog post not found",
    };
  }

  const { title, description, image } = result.post;
  const generatedOgImage = signOgImageUrl({ title, brand: config.blog.name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [generatedOgImage, image] : [generatedOgImage],
    },
  };
}
interface Params {
  slug: string;
}

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;

  const { slug } = params;

  const result = await wisp.getPost(slug);
  const { posts } = await wisp.getRelatedPosts({ slug, limit: 3 }); 

  if (!result || !result.post) {
    return notFound();
  }

  const { title, publishedAt, updatedAt, image, author } = result.post;

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: image ? image : undefined,
    datePublished: publishedAt ? publishedAt.toString() : undefined,
    dateModified: updatedAt.toString(),
    author: {
      "@type": "Person",
      name: author.name ?? undefined,
      image: author.image ?? undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-5">
        
        {/* Ad-Optimized Layout Container */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            
            {/* Main Content Area */}
            <main className="lg:col-span-3">
              {/* Blog Content Container */}
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <BlogPostContent post={result.post} />
              </article>

              {/* Related Posts */}
              <div className="mt-12">
                <RelatedPosts posts={posts} />
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <CommentSection slug={slug} />
              </div>
            </main>

            {/* Right Sidebar - Ads Only */}
            <aside className="lg:col-span-1">
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

              </div>
            </aside>
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
    </>
  );
};

export default Page;
