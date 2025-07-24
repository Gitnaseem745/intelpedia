"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, Wrench } from "lucide-react";
import { wisp, GetPostsResult } from "@/lib/wisp";
import { useToolSearch } from "@/hooks/useTools";
import { ToolDocument } from "@/models/Tool";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ToolCard from "@/components/ToolCard";

interface SearchContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchContent: React.FC<SearchContentProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogResults, setBlogResults] = useState<GetPostsResult["posts"]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [allPosts, setAllPosts] = useState<GetPostsResult["posts"]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'blog' | 'tools'>('all');

  // Tool search hook
  const { data: toolResults, isLoading: isLoadingTools } = useToolSearch({
    q: searchQuery || undefined,
    limit: 5
  });

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const result = await wisp.getPosts({ limit: 100 });
        setAllPosts(result.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (isOpen) {
      fetchAllPosts();
    }
  }, [isOpen]);

  // Search function for blog posts
  useEffect(() => {
    if (!searchQuery.trim()) {
      setBlogResults([]);
      return;
    }

    setIsLoadingBlog(true);
    
    // Simple client-side search for blog posts
    const filteredPosts = allPosts.filter((post) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(searchLower))
      );
    });

    setBlogResults(filteredPosts);
    setIsLoadingBlog(false);
  }, [searchQuery, allPosts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setBlogResults([]);
    setActiveTab('all');
    onClose();
  };

  const tools = toolResults?.tools || [];
  const isLoading = isLoadingBlog || isLoadingTools;
  const hasResults = blogResults.length > 0 || tools.length > 0;

  const filteredBlogResults = activeTab === 'tools' ? [] : blogResults.slice(0, 5);
  const filteredToolResults = activeTab === 'blog' ? [] : tools.slice(0, 5);

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
            className="bg-card dark:bg-card rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-6 border-b border-border">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts, tools, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleClose}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Tabs */}
              {searchQuery && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    All ({blogResults.length + tools.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('blog')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      activeTab === 'blog'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Posts ({blogResults.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      activeTab === 'tools'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Wrench className="w-4 h-4 mr-1" />
                    Tools ({tools.length})
                  </button>
                </div>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Searching...</p>
                </div>
              ) : searchQuery && !hasResults ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">No results found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              ) : searchQuery && hasResults ? (
                <div className="p-4 space-y-6">
                  {/* Blog Posts Results */}
                  {filteredBlogResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Blog Posts ({blogResults.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredBlogResults.map((post) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group"
                          >
                            <Link
                              href={`/blog/${post.slug}`}
                              onClick={handleClose}
                              className="block p-3 rounded-xl hover:bg-muted transition-colors"
                            >
                              <div className="flex space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                    <Image
                                      src={post.image || "/images/placeholder.webp"}
                                      alt={post.title}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {post.title}
                                  </h4>
                                  {post.description && (
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                      {post.description}
                                    </p>
                                  )}
                                  <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                                    <span>
                                      {formatDate(post.publishedAt || post.updatedAt, "MMM dd, yyyy")}
                                    </span>
                                    {post.tags.length > 0 && (
                                      <div className="flex space-x-1">
                                        {post.tags.slice(0, 2).map((tag) => (
                                          <span
                                            key={tag.id}
                                            className="px-2 py-0.5 bg-secondary rounded-full text-xs"
                                          >
                                            #{tag.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                      {blogResults.length > 5 && activeTab === 'all' && (
                        <div className="mt-3 text-center">
                          <button
                            onClick={() => setActiveTab('blog')}
                            className="text-sm text-primary hover:underline"
                          >
                            View all {blogResults.length} blog posts
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tools Results */}
                  {filteredToolResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2 flex items-center">
                        <Wrench className="w-4 h-4 mr-2" />
                        Tools ({tools.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredToolResults.map((tool: ToolDocument) => (
                          <motion.div
                            key={String(tool._id)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group"
                          >
                            <ToolCard 
                              tool={tool} 
                              variant="search" 
                              onClose={handleClose}
                              maxTags={3}
                            />
                          </motion.div>
                        ))}
                      </div>
                      {tools.length > 5 && activeTab === 'all' && (
                        <div className="mt-3 text-center">
                          <button
                            onClick={() => setActiveTab('tools')}
                            className="text-sm text-primary hover:underline"
                          >
                            View all {tools.length} tools
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Search Everything
                  </h3>
                  <p className="text-muted-foreground">
                    Search through blog posts, AI tools, tags, and content
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
