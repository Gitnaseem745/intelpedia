import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { 
  TopBannerAd, 
  SidebarAd, 
  InContentAd, 
  MobileAd, 
  SquareAd,
  AdSlot 
} from "@/components/AdSlot";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  const { slug } = params;

  const result = await wisp.getPost(slug); // change with your actual function to fetch a post
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

  const result = await wisp.getPost(slug); // change with your actual function to fetch a post
  const { posts } = await wisp.getRelatedPosts({ slug, limit: 3 }); // change with your actual function to fetch related posts

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
        <Header />
        
        {/* Ad-Optimized Layout Container */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            
            {/* Left Sidebar - Desktop Ads */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />
                <SquareAd />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-8">
              {/* Top Banner Ad - Above Content */}
              <div className="mb-8">
                <TopBannerAd />
              </div>

              {/* Blog Content Container */}
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <BlogPostContent post={result.post} />
              </article>

              {/* In-Content Ad - After Article */}
              <div className="my-8">
                <InContentAd />
              </div>

              {/* Related Posts */}
              <div className="mt-12">
                <RelatedPosts posts={posts} />
              </div>

              {/* Comments Section with Ad Above */}
              <div className="mt-12">
                {/* Ad Before Comments */}
                <div className="mb-8">
                  <AdSlot size="banner" position="pre-comments" />
                </div>
                
                <CommentSection slug={slug} />
              </div>
            </main>

            {/* Right Sidebar - Desktop Ads */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />
                <AdSlot size="square" position="right-sidebar-small" className="h-[200px]" />
              </div>
            </aside>
          </div>

          {/* Mobile Bottom Ad - Only visible on mobile */}
          <div className="lg:hidden mt-8">
            <MobileAd />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Page;
