"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu as MenuIcon, X } from "lucide-react";
import { FunctionComponent } from "react";
import Image from "next/image";
import SearchContent from "./SearchContent";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  href,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  href?: string;
  children?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.div
        transition={{ duration: 0.3 }}
        className="cursor-pointer"
      >
        {href ? (
          <Link
            href={href}
            className={`text-black hover:opacity-[0.9] dark:text-white ${
              isActive ? "font-semibold" : ""
            }`}
          >
            {item}
          </Link>
        ) : (
          <span className="text-black hover:opacity-[0.9] dark:text-white">
            {item}
          </span>
        )}
      </motion.div>
      {active !== null && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent flex justify-center space-x-6 px-8 py-4"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image src={src} alt={title} width={150} height={60} className="w-140 h-70 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-md shadow-2xl flex items-center justify-center text-xs text-gray-500" />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </Link>
  );
};

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
      <section className="flex items-center justify-between mt-8 md:mt-10 mb-12">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight">
            {config.blog.name}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center z-[1000]">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Blog" href="/">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/blog/latest">Latest Posts</HoveredLink>
                <HoveredLink href="/blog/featured">Featured</HoveredLink>
                <HoveredLink href="/blog/archive">Archive</HoveredLink>
              </div>
            </MenuItem>
            
            {/* <MenuItem setActive={setActive} active={active} item="Projects">
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                <ProductItem
                  title="Next.js Blog"
                  href="/projects/nextjs-blog"
                  src="/images/tailwind.webp"
                  description="A modern blog built with Next.js and Tailwind CSS"
                />
                <ProductItem
                  title="Portfolio Site"
                  href="/projects/portfolio"
                  src="/images/portfolio.jpg"
                  description="Personal portfolio showcasing my work and skills"
                />
                <ProductItem
                  title="E-commerce App"
                  href="/projects/ecommerce"
                  src="/images/e-commerce.jpg"
                  description="Full-stack e-commerce solution with payment integration"
                />
                <ProductItem
                  title="Task Manager"
                  href="/projects/task-manager"
                  src="/images/taskmanager.jpg"
                  description="Productivity app for managing tasks and projects"
                />
              </div>
            </MenuItem> */}
            
            <MenuItem setActive={setActive} active={active} item="About" href="/about">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/about">About Me</HoveredLink>
                <HoveredLink href="/about/experience">Experience</HoveredLink>
                <HoveredLink href="/about/contact">Contact</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Projects" href="/projects">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/projects/nextjs-blog">Next.js Blog</HoveredLink>
                <HoveredLink href="/projects/portfolio">Portfolio Site</HoveredLink>
                <HoveredLink href="/projects/ecommerce">E-commerce App</HoveredLink>
                <HoveredLink href="/projects/task-manager">Task Manager</HoveredLink>
              </div>
            </MenuItem>
          </Menu>

          <button 
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Search size={20} className="text-black dark:text-white" />
          </button>
        </div>

        {/* Search Icon and Mobile Menu Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <button 
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Search size={20} className="text-black dark:text-white" />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMobileMenu}
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
                >
                  <X size={20} className="text-black dark:text-white" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-6 space-y-6">
                {/* Blog Section */}
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-3">Blog</h3>
                  <div className="space-y-2 ml-4">
                    <Link href="/" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Latest Posts
                    </Link>
                    <Link href="/blog/featured" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Featured
                    </Link>
                    <Link href="/blog/archive" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Archive
                    </Link>
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-3">Projects</h3>
                  <div className="space-y-3 ml-4">
                    <Link href="/projects/nextjs-blog" className="block" onClick={toggleMobileMenu}>
                      <div className="py-2">
                        <h4 className="font-medium text-black dark:text-white">Next.js Blog</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Modern blog with Next.js</p>
                      </div>
                    </Link>
                    <Link href="/projects/portfolio" className="block" onClick={toggleMobileMenu}>
                      <div className="py-2">
                        <h4 className="font-medium text-black dark:text-white">Portfolio Site</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Personal showcase</p>
                      </div>
                    </Link>
                    <Link href="/projects/ecommerce" className="block" onClick={toggleMobileMenu}>
                      <div className="py-2">
                        <h4 className="font-medium text-black dark:text-white">E-commerce App</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Full-stack solution</p>
                      </div>
                    </Link>
                    <Link href="/projects/task-manager" className="block" onClick={toggleMobileMenu}>
                      <div className="py-2">
                        <h4 className="font-medium text-black dark:text-white">Task Manager</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Productivity app</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-3">About</h3>
                  <div className="space-y-2 ml-4">
                    <Link href="/about" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      About Me
                    </Link>
                    <Link href="/about/experience" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Experience
                    </Link>
                    <Link href="/about/contact" className="block py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={toggleMobileMenu}>
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
