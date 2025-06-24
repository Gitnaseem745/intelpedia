import { config } from "@/config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    metadataBase: new URL(config.baseUrl),
    title: {
        default: config.blog.metadata.title.default || "Intelpedia - AI Tools & Innovation Hub",
        template: config.blog.metadata.title.template || "%s | Intelpedia",
    },
    description: config.blog.metadata.description || "Your comprehensive guide to AI tools, image generation techniques, prompting strategies, and artificial intelligence news.",
    keywords: ["AI tools", "artificial intelligence", "AI image generation", "AI prompting", "ChatGPT", "Midjourney", "Stable Diffusion", "AI news", "AI tutorials"],
    openGraph: {
        title: config.blog.metadata.title.default || "Intelpedia - AI Tools & Innovation Hub",
        description: config.blog.metadata.description || "Your comprehensive guide to AI tools and artificial intelligence.",
        url: config.baseUrl,
        siteName: config.blog.name,
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: config.blog.metadata.title.default || "Intelpedia - AI Tools & Innovation Hub",
        description: config.blog.metadata.description || "Your comprehensive guide to AI tools and artificial intelligence.",
        creator: "@intelpedia",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased w-full m-auto",
                    fontSans.variable
                )}
            >
                <Providers>
                    <main>
                        <Header />
                        {children}
                        <Footer />
                    </main>
                </Providers>
            </body>
            {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
        </html>
    );
}
