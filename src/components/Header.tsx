"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/config";
import Link from "next/link";
import { Search, Menu as MenuIcon, X } from "lucide-react";
import { FunctionComponent } from "react";
import SearchContent from "./SearchContent";
import { Menu, MenuItem, HoveredLink } from "./Menu";

export const Header: FunctionComponent = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <section className="container flex items-center justify-between mt-6 mb-12 mx-auto">
        {/* Logo */}
        <Link href="/" >
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight">
            {config.blog.name}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center z-[1000]">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Home" href="/" />
            
            <MenuItem setActive={setActive} active={active} item="Blog" href="/">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/blog">All Posts</HoveredLink>
                <HoveredLink href="/#latest-posts">Latest Posts</HoveredLink>
                <HoveredLink href="/tag">Browse by Tags</HoveredLink>
                <HoveredLink href="/rss">RSS Feed</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Tags" href="/tag" />
            
            <MenuItem setActive={setActive} active={active} item="About" href="/about" />
          </Menu>

          <button 
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open Search"
            role="button"
          >
            <Search size={20} className="text-black dark:text-white" />
          </button>
        </div>

        {/* Search Icon and Mobile Menu Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <button 
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open Search"
            role="button"
          >
            <Search size={20} className="text-black dark:text-white" />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            role="button"
          >
            <MenuIcon size={20} className="text-black dark:text-white" />
          </button>
        </div>
      </section>

      {/* Search Component */}
      <SearchContent isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.5 
              }}
              className="fixed right-0 top-0 h-full w-80 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-l border-gray-200 dark:border-gray-800 z-[9999] md:hidden"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-black dark:text-white">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close Menu"
                role="button"
                >
                  <X size={20} className="text-black dark:text-white" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-6 space-y-6">
                {/* Home */}
                <div>
                  <Link href="/" className="block py-3 text-lg font-medium text-black dark:text-white hover:text-primary transition-colors" onClick={toggleMobileMenu}>
                    Home
                  </Link>
                </div>

                {/* Blog Section */}
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-3">Blog</h3>
                  <div className="space-y-2 ml-4">
                    <Link href="/blog" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      All Posts
                    </Link>
                    <Link href="/" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Latest Posts
                    </Link>
                    <Link href="/tag" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Browse by Tags
                    </Link>
                    <Link href="/rss" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      RSS Feed
                    </Link>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Link href="/tag" className="block py-3 text-lg font-medium text-black dark:text-white hover:text-primary transition-colors" onClick={toggleMobileMenu}>
                    All Tags
                  </Link>
                </div>

                {/* About */}
                <div>
                  <Link href="/about" className="block py-3 text-lg font-medium text-black dark:text-white hover:text-primary transition-colors" onClick={toggleMobileMenu}>
                    About
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
