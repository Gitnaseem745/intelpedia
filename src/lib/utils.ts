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

/**
 * Removes emojis from a string
 * Comprehensive regex pattern to match all types of emojis
 */
export function removeEmojis(text: string): string {
  // Comprehensive emoji regex pattern that covers:
  // - Basic emojis
  // - Skin tone modifiers
  // - Zero-width joiners and variant selectors
  // - Regional indicator symbols
  // - Keycap sequences
  const emojiRegex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}\u{200d}\u{20e3}\u{fe0f}]+/gu;
  
  return text.replace(emojiRegex, '').trim();
}

/**
 * Filters emojis from an array of tags
 */
export function filterEmojisFromTags(tags: string[] | undefined | null): string[] {
  if (!tags || !Array.isArray(tags)) {
    return [];
  }
  return tags.map(tag => removeEmojis(tag)).filter(tag => tag.length > 0);
}
