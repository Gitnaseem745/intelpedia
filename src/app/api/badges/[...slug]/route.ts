import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/config';

// This is a placeholder badge generation API
// In production, you might want to use a service like:
// - Vercel OG Image Generation
// - Canvas API with node-canvas
// - External service like Bannerbear or HTML/CSS to Image

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const [theme, size, toolSlug] = slug;

    // Validate parameters
    if (!theme || !size || !toolSlug) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    if (!['light', 'dark'].includes(theme)) {
      return new NextResponse('Invalid theme', { status: 400 });
    }

    if (!['small', 'medium', 'large'].includes(size)) {
      return new NextResponse('Invalid size', { status: 400 });
    }

    // Define sizes
    const sizes = {
      small: { width: 200, height: 60, fontSize: 12 },
      medium: { width: 280, height: 80, fontSize: 14 },
      large: { width: 400, height: 120, fontSize: 18 }
    };

    const { width, height, fontSize } = sizes[size as keyof typeof sizes];

    // Generate SVG badge
    const svg = generateBadgeSVG({
      theme,
      width,
      height,
      fontSize,
      toolName: toolSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Badge generation error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

function generateBadgeSVG({
  theme,
  width,
  height,
  fontSize,
  toolName
}: {
  theme: string;
  width: number;
  height: number;
  fontSize: number;
  toolName: string;
}) {
  const isDark = theme === 'dark';
  
  const backgroundColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const accentColor = isDark ? '#8b5cf6' : '#7c3aed';
  const featuredTextColor = isDark ? '#a78bfa' : '#7c3aed';

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" rx="${height * 0.15}" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="1" filter="url(#shadow)"/>
      
      <!-- Logo Circle -->
      <circle cx="${height * 0.3}" cy="${height * 0.5}" r="${height * 0.15}" fill="url(#logo-gradient)"/>
      
      <!-- AI Text in Logo -->
      <text x="${height * 0.3}" y="${height * 0.57}" font-family="Arial, sans-serif" font-size="${fontSize * 0.7}" font-weight="bold" fill="white" text-anchor="middle">AI</text>
      
      <!-- Featured on Text -->
      <text x="${height * 0.55}" y="${height * 0.4}" font-family="Arial, sans-serif" font-size="${fontSize * 0.7}" font-weight="600" fill="${featuredTextColor}">Featured on</text>
      
      <!-- Intelpedia Text -->
      <text x="${height * 0.55}" y="${height * 0.7}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}">Intelpedia</text>
    </svg>
  `;
}
