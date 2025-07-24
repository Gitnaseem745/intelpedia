import { config } from "@/config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/critical.css";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import { DynamicWebVitals } from "@/components/DynamicComponents";
import { ConditionalHeader } from "@/components/ConditionalHeader";

const fontSans = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: 'swap', // Improve font loading performance
  preload: true,
});

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
        yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION
    },
    icons: {
        icon: [
            { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicons/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ],
        other: [
            { rel: 'manifest', url: '/favicons/site.webmanifest' }
        ]
    },
    manifest: '/favicons/site.webmanifest',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Performance optimizations */}
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Preload critical CSS */}
                <link rel="preload" href="/fonts/Inter-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                
                {/* Additional favicon and icon links for better browser support */}
                <link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
                <link rel="manifest" href="/favicons/site.webmanifest" />
                
                {/* Additional meta tags for mobile browsers */}
                <meta name="theme-color" content="#ffffff" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
            </head>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased w-full m-auto",
                    fontSans.variable
                )}
            >
                <Providers>
                    <main>
                        <ConditionalHeader />
                        {children}
                        <Footer />
                    </main>
                </Providers>
                {process.env.NODE_ENV === 'production' && <DynamicWebVitals />}
            </body>
            {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
        </html>
    );
}
