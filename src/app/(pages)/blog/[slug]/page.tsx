import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { RelatedPosts } from "@/components/RelatedPosts";
import { BlogSidebar } from "@/components/BlogSidebar";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

// Enable ISR with 2 hour revalidation for blog posts
export const revalidate = 7200; // 2 hours in seconds

// Enable dynamic rendering for new blog posts
export const dynamicParams = true;

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const result = await wisp.getPosts({ limit: 100 }); // Adjust limit as needed
    
    return result.posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for blog posts:', error);
    return [];
  }
}

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
      images: image ? [ image, generatedOgImage ] : [generatedOgImage],
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
  
  // Fetch recent posts for sidebar
  const { posts: recentPosts } = await wisp.getPosts({ limit: 5, page: 1 });

  if (!result || !result.post) {
    return notFound();
  }

  const { title, publishedAt, updatedAt, image, author } = result.post;

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: image ? image : undefined,
    datePublished: publishedAt ? (publishedAt instanceof Date ? publishedAt.toISOString() : new Date(publishedAt).toISOString()) : undefined,
    dateModified: updatedAt ? (updatedAt instanceof Date ? updatedAt.toISOString() : new Date(updatedAt).toISOString()) : undefined,
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

            {/* Right Sidebar - Blog Content */}
            <BlogSidebar 
              currentPost={{
                tags: result.post.tags,
                author: result.post.author ? {
                  name: result.post.author.name || undefined,
                  image: result.post.author.image || undefined
                } : undefined
              }}
              recentPosts={recentPosts}
              showAuthor={true}
              showTags={true}
              showRecentPosts={true}
              showQuickActions={true}
              showNewsletter={true}
            />
          </div>

        </div>
        
      </div>
    </>
  );
};

export default Page;
