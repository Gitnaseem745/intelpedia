import { Metadata } from 'next';
import ToolsByTagClient from './ToolsByTagClient';
import { config } from '@/config';
import { signOgImageUrl } from '@/lib/og-image';
import type { CollectionPage, WithContext } from 'schema-dts';

async function getTagStats(tag: string) {
  try {
    const response = await fetch(`${config.baseUrl}/api/tools/search?tag=${encodeURIComponent(tag)}`, {
      cache: 'no-store',
    });
    if (!response.ok) return { count: 0, tools: [] };
    const data = await response.json();
    return { count: data.length || 0, tools: data || [] };
  } catch (error) {
    return { count: 0, tools: [] };
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const { count } = await getTagStats(decodedTag);
  
  const capitalizedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1);
  const metaTitle = count > 0 
    ? `${capitalizedTag} AI Tools (${count}) - Category Directory | Intelpedia`
    : `${capitalizedTag} AI Tools - Category Directory | Intelpedia`;
  
  const metaDescription = count > 0
    ? `Discover ${count} AI tools in the ${decodedTag} category. Compare features, pricing, and reviews to find the perfect ${decodedTag} tool for your needs.`
    : `Explore AI tools in the ${decodedTag} category. Find innovative solutions and tools for ${decodedTag}-related tasks and workflows.`;

  const ogImage = signOgImageUrl({ 
    title: `${capitalizedTag} AI Tools`, 
    brand: config.blog.name 
  });

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      `${decodedTag} tools`,
      `${decodedTag} AI`,
      "AI tools",
      "artificial intelligence",
      "tool directory",
      "software tools",
      capitalizedTag,
      "productivity",
      "automation"
    ],
    authors: [{ name: "Intelpedia" }],
    creator: "Intelpedia",
    publisher: "Intelpedia",
    alternates: {
      canonical: `${config.baseUrl}/tools/tag/${tag}`,
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
      title: metaTitle,
      description: metaDescription,
      url: `${config.baseUrl}/tools/tag/${tag}`,
      siteName: config.blog.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${capitalizedTag} AI Tools Directory`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: "@intelpedia",
      images: [ogImage],
    },
  };
}

export default async function ToolsByTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const { count, tools } = await getTagStats(decodedTag);
  
  const capitalizedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1);

  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${capitalizedTag} AI Tools`,
    description: `Collection of AI tools categorized under ${decodedTag}`,
    url: `${config.baseUrl}/tools/tag/${tag}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${capitalizedTag} AI Tools`,
      description: `List of AI tools in the ${decodedTag} category`,
      numberOfItems: count,
      itemListElement: tools.slice(0, 10).map((tool: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: tool.title,
          description: tool.description,
          url: `${config.baseUrl}/tools/${tool._id}`,
        }
      }))
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
          name: capitalizedTag,
          item: `${config.baseUrl}/tools/tag/${tag}`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsByTagClient />
    </>
  );
}
