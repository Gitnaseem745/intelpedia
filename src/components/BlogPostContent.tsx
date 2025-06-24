"use client";
import { GetPostResult } from "@/lib/wisp";
import Link from "next/link";
import Image from "next/image";
import sanitize, { defaults } from "sanitize-html";

export const PostContent = ({ content }: { content: string }) => {
  // Remove "Powered by wisp" branding from content
  const cleanedContent = content
    .replace(/<p[^>]*style="text-align:center"[^>]*>.*?Powered by wisp.*?<\/p>/gi, '')
    .replace(/<small[^>]*>.*?Powered by wisp.*?<\/small>/gi, '')
    .replace(/Powered by wisp/gi, '')
    .replace(/<a[^>]*href="[^"]*wisp\.blog[^"]*"[^>]*>.*?<\/a>/gi, '');

  const sanitizedContent = sanitize(cleanedContent, {
    allowedTags: [
      "b",
      "br",
      "i",
      "em",
      "strong",
      "a",
      "img",
      "h1",
      "h2",
      "h3",
      "code",
      "pre",
      "p",
      "li",
      "ul",
      "ol",
      "blockquote",
      // tables
      "td",
      "th",
      "table",
      "tr",
      "tbody",
      "thead",
      "tfoot",
      "small",
      "div",
      "iframe",
    ],
    allowedAttributes: {
      ...defaults.allowedAttributes,
      "*": ["style"],
      iframe: ["src", "allowfullscreen", "style"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
  });
  return (
    <div
      className="blog-content mx-auto"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    ></div>
  );
};

export const BlogPostContent = ({ post }: { post: GetPostResult["post"] }) => {
  if (!post) return null;
  const { title, publishedAt, createdAt, content, tags, author } = post;
  
  return (
    <div>
      <div className="prose lg:prose-xl dark:prose-invert mx-auto lg:prose-h1:text-4xl mb-10 break-words">
        {/* Title */}
        <h1 className="mb-6">{title}</h1>
        
        {/* Metadata Section - After Title */}
        <div className="not-prose mb-8 pb-6 border-b border-border/50">
          {/* Author and Date */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-2">
                {author.image && (
                  <Image 
                    src={author.image} 
                    alt={author.name || 'Author'} 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-foreground">
                  {author.name || 'Anonymous'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>•</span>
              <time className="text-muted-foreground">
                {Intl.DateTimeFormat("en-US", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(publishedAt || createdAt))}
              </time>
            </div>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.name}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 hover:bg-secondary text-secondary-foreground transition-colors duration-200 no-underline"
                >
                  <span className="mr-1">#</span>
                  {tag.name.replaceAll('-', ' ')}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <PostContent content={content} />
      </div>
    </div>
  );
};
