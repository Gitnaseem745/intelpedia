import { Metadata } from 'next';
import ToolsPageClient from './ToolsPageClient';

export const metadata: Metadata = {
  title: "AI Tools Directory - Discover the Best AI Tools | Intelpedia",
  description: "Explore our curated collection of the best AI tools for productivity, creativity, and innovation. Find ChatGPT alternatives, image generation tools, automation software, and more.",
  keywords: ["AI tools", "artificial intelligence", "productivity tools", "AI software", "automation tools", "ChatGPT", "AI image generation", "machine learning tools"],
  authors: [{ name: "Intelpedia" }],
  creator: "Intelpedia",
  publisher: "Intelpedia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "AI Tools Directory - Discover the Best AI Tools",
    description: "Explore our curated collection of the best AI tools for productivity, creativity, and innovation.",
    url: "/tools",
    siteName: "Intelpedia",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: "/images/tools-og.png",
        width: 1200,
        height: 630,
        alt: "Intelpedia AI Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory - Discover the Best AI Tools",
    description: "Explore our curated collection of the best AI tools for productivity, creativity, and innovation.",
    creator: "@intelpedia",
  },
};

export default function ToolsPage() {
  return <ToolsPageClient />;
}
