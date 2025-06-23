"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { wisp, GetPostsResult } from "@/lib/wisp";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "date-fns";

interface SearchContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchContent: React.FC<SearchContentProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GetPostsResult["posts"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<GetPostsResult["posts"]>([]);

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const result = await wisp.getPosts({ limit: 100 }); // Get more posts for better search
        setAllPosts(result.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (isOpen) {
      fetchAllPosts();
    }
  }, [isOpen]);

  // Search function
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simple client-side search
    const filteredPosts = allPosts.filter((post) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(searchLower))
      );
    });

    setSearchResults(filteredPosts);
    setIsLoading(false);
  }, [searchQuery, allPosts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                />
                <button
                  onClick={handleClose}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-neutral-600 dark:text-neutral-400">Searching...</p>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">No posts found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              ) : searchQuery && searchResults.length > 0 ? (
                <div className="p-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 px-2">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-4">
                    {searchResults.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          onClick={handleClose}
                          className="block p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className="flex space-x-4">
                            {/* Post Image */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                                <Image
                                  src={post.image || "/images/placeholder.webp"}
                                  alt={post.title}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Post Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              
                              {post.description && (
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                  {post.description}
                                </p>
                              )}

                              <div className="mt-2 flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-500">
                                <span>
                                  {formatDate(post.publishedAt || post.updatedAt, "MMM dd, yyyy")}
                                </span>
                                
                                {post.tags.length > 0 && (
                                  <div className="flex space-x-1">
                                    {post.tags.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag.id}
                                        className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-xs"
                                      >
                                        #{tag.name}
                                      </span>
                                    ))}
                                    {post.tags.length > 2 && (
                                      <span className="text-neutral-400">
                                        +{post.tags.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    Search Posts
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Start typing to search through all posts, tags, and content
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchContent;
