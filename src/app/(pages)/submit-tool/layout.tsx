import { Metadata } from 'next';
import { config } from '@/config';
import { signOgImageUrl } from '@/lib/og-image';
import SubmitToolClient from './SubmitToolClient';
import type { WebPage, WithContext } from 'schema-dts';

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = signOgImageUrl({
    title: "Submit AI Tool",
    label: "Share Your AI Tool",
    brand: config.blog.name,
  });

  return {
    title: "Submit Your AI Tool - Share with the Community | Intelpedia",
    description: "Submit your AI tool to Intelpedia's directory. Share your artificial intelligence tool with our community of AI enthusiasts, developers, and creators.",
    keywords: [
      "submit AI tool",
      "AI tool submission",
      "share AI tool",
      "AI directory",
      "artificial intelligence tools",
      "AI tool listing",
      "promote AI tool",
      "AI tool marketplace",
      "AI community",
      "tool directory"
    ],
    authors: [{ name: "Intelpedia" }],
    creator: "Intelpedia",
    publisher: "Intelpedia",
    alternates: {
      canonical: `${config.baseUrl}/submit-tool`,
    },
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
      title: "Submit Your AI Tool - Share with the Community",
      description: "Submit your AI tool to Intelpedia's directory. Share your artificial intelligence tool with our community.",
      url: `${config.baseUrl}/submit-tool`,
      siteName: config.blog.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Submit Your AI Tool to Intelpedia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Submit Your AI Tool - Share with the Community",
      description: "Submit your AI tool to Intelpedia's directory and reach thousands of AI enthusiasts.",
      creator: "@intelpedia",
      images: [ogImage],
    },
  };
}

export default function SubmitToolPage() {
  const webPageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Submit Your AI Tool",
    description: "Submit your AI tool to Intelpedia's comprehensive directory of artificial intelligence tools",
    url: `${config.baseUrl}/submit-tool`,
    isPartOf: {
      "@type": "WebSite",
      name: config.blog.name,
      url: config.baseUrl
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: config.baseUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: `${config.baseUrl}/tools`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Submit Tool",
          item: `${config.baseUrl}/submit-tool`
        }
      ]
    },
    mainEntity: {
      "@type": "Action",
      name: "Submit AI Tool",
      description: "Action to submit an AI tool for inclusion in the directory"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <SubmitToolClient />
    </>
  );
}
