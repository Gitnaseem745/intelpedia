import { Metadata } from 'next';
import ToolDetailsClient from './ToolDetailsClient';
import { config } from '@/config';
import { signOgImageUrl } from '@/lib/og-image';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import type { Product, WithContext } from 'schema-dts';
import mongoose from 'mongoose';

// Enable ISR with 1 hour revalidation
export const revalidate = 3600; // 1 hour in seconds

// Enable dynamic rendering for paths not generated at build time
export const dynamicParams = true;

// Generate static params for all tools at build time
export async function generateStaticParams() {
  try {
    await connectDB();
    
    // Fetch all approved tools from the database
    const tools = await Tool.find({}, { _id: 1 }).lean();
    
    // Return array of toolId params for static generation
    const params = tools.map((tool: any) => ({
      toolId: tool._id.toString(),
    }));
    
    console.log(`Generated static params for ${params.length} tools`);
    return params;
  } catch (error) {
    console.error('Failed to generate static params for tools:', error);
    // Return empty array to allow fallback rendering
    return [];
  }
}

async function getToolData(toolId: string) {
  try {
    // For metadata generation, use direct database access instead of API calls
    await connectDB();
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return null;
    }

    const tool = await Tool.findById(toolId).lean();
    return tool as any; // Type assertion for MongoDB document
  } catch (error) {
    console.error('Failed to fetch tool data:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ toolId: string }> }
): Promise<Metadata> {
  const { toolId } = await params;
  const toolData = await getToolData(toolId);
  
  if (!toolData) {
    return {
      title: "Tool Not Found | Intelpedia",
      description: "The requested AI tool could not be found. Explore our directory of AI tools and discover alternatives.",
      robots: { index: false, follow: true },
    };
  }

  const { title, description, tags, imgUrl, pricing, isFree, features } = toolData;
  const cleanTitle = title.length > 50 ? `${title.slice(0, 47)}...` : title;
  const cleanDescription = description.length > 155 ? `${description.slice(0, 152)}...` : description;
  
  const metaTitle = `${cleanTitle} Reviews ${new Date().getFullYear()}: Details, Pricing, & Features`;
  const metaDescription = `${cleanDescription} Discover features, pricing${pricing ? ` ($${pricing})` : isFree ? ' (Free)' : ''}, and user insights.`;
  
  const ogImage = imgUrl || signOgImageUrl({ 
    title: cleanTitle, 
    brand: config.blog.name 
  });

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      ...tags,
      "AI tool", 
      "artificial intelligence", 
      "tool review", 
      "features", 
      "pricing"
    ],
    authors: [{ name: "Intelpedia" }],
    creator: "Intelpedia",
    publisher: "Intelpedia",
    alternates: {
      canonical: `${config.baseUrl}/tools/${toolId}`,
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
      url: `${config.baseUrl}/tools/${toolId}`,
      siteName: config.blog.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - AI Tool`,
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

export default async function ToolDetailsPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  const toolData = await getToolData(toolId);

  if (!toolData) {
    return <ToolDetailsClient />;
  }

  const { title, description, tags, siteUrl, imgUrl, pricing, isFree, features } = toolData;

  const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description,
    image: imgUrl ? [imgUrl] : undefined,
    url: `${config.baseUrl}/tools/${toolId}`,
    category: "Software",
    brand: {
      "@type": "Brand",
      name: title.split(' ')[0], // First word as brand
    },
    offers: pricing !== undefined ? {
      "@type": "Offer",
      price: pricing,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: siteUrl,
    } : isFree ? {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: siteUrl,
    } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "1",
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.5",
      },
      author: {
        "@type": "Person",
        name: "Intelpedia Team",
      },
      reviewBody: description,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolDetailsClient />
    </>
  );
}
