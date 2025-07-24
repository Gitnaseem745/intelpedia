"use client";

import Link from "next/link";
import Image from "next/image";
import { GetPostsResult } from "@/lib/wisp";

interface BlogSidebarProps {
  tags?: Array<{ id: string; name: string }>;
  recentPosts?: GetPostsResult["posts"];
  currentPost?: {
    tags: Array<{ id: string; name: string }>;
    author?: {
      name?: string;
      image?: string;
    };
  };
  showAuthor?: boolean;
  showTags?: boolean;
  showRecentPosts?: boolean;
  showQuickActions?: boolean;
  showNewsletter?: boolean;
  tagsTitle?: string;
  currentSlug?: string; // For filtering out current tag
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  tags = [],
  recentPosts = [],
  currentPost,
  showAuthor = false,
  showTags = true,
  showRecentPosts = true,
  showQuickActions = true,
  showNewsletter = true,
  tagsTitle,
  currentSlug,
}) => {
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        
        {/* Article Tags */}
        {showTags && currentPost?.tags && currentPost.tags.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <span className="text-xl mr-2">🏷️</span>
              Article Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-border">
                    #{tag.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Tags */}
        {showTags && tags.length > 0 && !currentPost?.tags && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <span className="text-xl mr-2">🏷️</span>
              {tagsTitle || "Popular Topics"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags
                .filter(tag => currentSlug ? tag.name.toLowerCase() !== currentSlug.toLowerCase() : true)
                .slice(0, 10)
                .map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-border">
                      {tag.name}
                    </span>
                  </Link>
                ))}
            </div>
            {tagsTitle && (
              <div className="mt-4">
                <Link href="/tag" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                  View All Topics →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Author Info */}
        {showAuthor && currentPost?.author && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <span className="text-xl mr-2">👤</span>
              About the Author
            </h3>
            <div className="flex items-center gap-3 mb-3">
              {currentPost.author.image && (
                <Image 
                  src={currentPost.author.image} 
                  alt={currentPost.author.name || 'Author'} 
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h4 className="font-semibold text-card-foreground">
                  {currentPost.author.name || 'Anonymous'}
                </h4>
                <p className="text-sm text-muted-foreground">Content Creator</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Passionate about AI tools and sharing knowledge to help others stay ahead in the digital world.
            </p>
          </div>
        )}

        {/* Recent Posts */}
        {showRecentPosts && recentPosts.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <span className="text-xl mr-2">📚</span>
              Recent Articles
            </h3>
            <div className="space-y-3">
              {recentPosts.slice(0, 5).map((post) => (
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

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <span className="text-xl mr-2">⚡</span>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/blog" className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors text-sm font-medium text-center">
                More Articles
              </Link>
              <Link href="/tools" className="block w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-4 py-2 rounded-md transition-colors text-sm font-medium text-center">
                Explore Tools
              </Link>
              <Link href="/tag" className="block w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-4 py-2 rounded-md transition-colors text-sm font-medium text-center">
                Browse Topics
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        {showNewsletter && (
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
        )}

      </div>
    </aside>
  );
};
