import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a tag name to a consistent URL slug format
 * Converts to lowercase for URL consistency with your DB format
 */
export function normalizeTagSlug(tagName: string): string {
  return tagName.toLowerCase();
}

/**
 * Converts a tag slug back to a display name
 * Keeps the original format with hyphens but makes it more readable
 */
export function tagSlugToDisplayName(slug: string): string {
  // Convert to proper case for display while keeping hyphens
return slug.split('-').map(word => 
    word.toLowerCase() === 'ai'
        ? 'AI'
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
).join(' ');
}

/**
 * Gets possible tag variations for database lookup
 * Since tags are stored with specific case formats like "AI-Tools"
 */
export function getTagVariations(slug: string): string[] {
  const variations = [
    slug, // original slug as provided
    slug.toLowerCase(), // lowercase version
    slug.toUpperCase(), // uppercase version
    tagSlugToDisplayName(slug), // proper case version
  ];

  // Handle special cases for AI tags
  if (slug.toLowerCase().startsWith('ai-')) {
    variations.push(slug.replace(/^ai-/i, 'AI-'));
  }
  
  if (slug.toLowerCase() === 'ai') {
    variations.push('AI');
  }

  // Remove duplicates
  return [...new Set(variations)];
}
