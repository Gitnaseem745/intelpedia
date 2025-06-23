"use client";
import { cn } from "@/lib/utils";
import { GetPostsResult } from "@/lib/wisp";
import { formatDate } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

export const BlogPostPreview: FunctionComponent<{
    post: GetPostsResult["posts"][0];
}> = ({ post }) => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-xs">
                <div className="relative card-border border overflow-hidden rounded-2xl flex flex-col">
                    <div className="p-4 flex justify-center relative">
                        <div className="w-full h-48 rounded-xl gradient-border inner-glow overflow-hidden relative">
                            <Link href={`blog/${post?.slug}`} className="absolute inset-0">
                                <Image alt={post.title} src={post?.image || "/images/placeholder.webp"} fill  className="w-full h-full" />
                            </Link>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <div className="p-4">
                        <Link href={`/tag/${post?.tags[0]?.name}`} className="inline-block px-3 py-1 glass text-indigo-300 rounded-full text-xs font-medium mb-3 border border-indigo-400/30">
                            {post.tags[0].name.charAt(0).toLocaleUpperCase() + post.tags[0].name.slice(1) || "Database"}
                        </Link>
                        <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">{post?.title}</h3>
                        <p className="text-white/70 mb-4 leading-relaxed text-xs line-clamp-2">
                            {post.description}
                        </p>
                        <div className="flex justify-between items-center">
                            <Link href={`/blog/${post?.slug}`} className="text-indigo-400 hover:text-indigo-300 transition flex items-center text-xs font-medium glass px-3 py-1.5 rounded-lg border border-indigo-400/30">
                                Read More
                                <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                            <span className="text-white/50 text-xs glass px-2 py-1 rounded-full border border-white/10">
                                {formatDate(post?.publishedAt || post?.updatedAt, "dd MMMM yyyy")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BlogPostsPreview: FunctionComponent<{
    posts: GetPostsResult["posts"];
    className?: string;
}> = ({ posts, className }) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 md:my-16 my-8",
                className
            )}
        >
            {posts.map((post) => (
                <BlogPostPreview key={post.id} post={post} />
            ))}
        </div>
    );
};
