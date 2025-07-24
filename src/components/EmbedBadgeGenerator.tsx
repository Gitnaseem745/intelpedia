'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Download,
  Monitor,
  Smartphone,
  Square
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToolDocument } from '@/models/Tool';
import { config } from '@/config';

interface EmbedBadgeGeneratorProps {
  tool: ToolDocument;
}

type BadgeSize = 'small' | 'medium' | 'large';
type BadgeTheme = 'light' | 'dark';


const BADGE_WIDTH = 224;
const BADGE_HEIGHT = 64;

export default function EmbedBadgeGenerator({ tool }: EmbedBadgeGeneratorProps) {

  const [selectedTheme, setSelectedTheme] = useState<BadgeTheme>('light');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Create a safe slug from the tool title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };


  const toolUrl = `${config.baseUrl}/tools/${tool._id}?utm_medium=embed&utm_source=${tool.siteUrl.replace(/^https?:\/\//, '')}`;
  const featuredLight = `/badges/featured-light.png`;
  const featuredDark = `/badges/featured-dark.png`;

  const generateEmbedCode = (theme: BadgeTheme) => {
    const imgSrc = theme === 'dark' ? featuredDark : featuredLight;
    return `<a href="${toolUrl}" target="_blank"><img width="${BADGE_WIDTH}" src="${imgSrc}" alt="${tool.title} - Intelpedia" /></a>`;
  };

  // Copy to clipboard functionality
  const copyToClipboard = async (code: string, theme: BadgeTheme, size: string) => {
    try {
      await navigator.clipboard.writeText(code);
      const key = `${theme}-${size}`;
      setCopiedCode(key);
      
      toast({
        title: "Copied to clipboard!",
        description: `${theme === 'light' ? 'Light' : 'Dark'} ${size} embed code copied successfully.`,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the code manually.",
        variant: "destructive",
      });
    }
  };


  const badgePreviewUrl = (theme: BadgeTheme) =>
    theme === 'dark' ? featuredDark : featuredLight;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center mb-6">
        <ExternalLink className="w-5 h-5 mr-2 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">
          Share & Embed
        </h3>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Help others discover {tool.title} by embedding it on your website
      </p>


      {/* No size/tracking selection for static featured badge */}

      {/* Theme Options */}
      <div className="space-y-8">
        {/* Light Theme */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-medium text-foreground">Light Theme</h4>
              <p className="text-sm text-muted-foreground">Ideal for light websites</p>
            </div>
            <Button
              variant={selectedTheme === 'light' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTheme('light')}
            >
              Select
            </Button>
          </div>
          {/* Light Badge Preview */}
          <div className="bg-gray-50 dark:bg-gray-100 rounded-lg p-6 mb-4 flex items-center justify-center min-h-[80px]">
            <Image
              src={badgePreviewUrl('light')}
              alt="Light theme badge preview"
              width={BADGE_WIDTH}
              height={BADGE_HEIGHT}
              className="max-w-full h-auto"
              unoptimized
            />
          </div>
          <Button
            onClick={() => copyToClipboard(generateEmbedCode('light'), 'light', 'static')}
            className="w-full"
            variant="outline"
          >
            {copiedCode === `light-static` ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Light Embed
              </>
            )}
          </Button>
        </div>

        {/* Dark Theme */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-medium text-foreground">Dark Theme</h4>
              <p className="text-sm text-muted-foreground">Perfect for dark websites</p>
            </div>
            <Button
              variant={selectedTheme === 'dark' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTheme('dark')}
            >
              Select
            </Button>
          </div>
          {/* Dark Badge Preview */}
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 mb-4 flex items-center justify-center min-h-[80px]">
            <Image
              src={badgePreviewUrl('dark')}
              alt="Dark theme badge preview"
              width={BADGE_WIDTH}
              height={BADGE_HEIGHT}
              className="max-w-full h-auto"
              unoptimized
            />
          </div>
          <Button
            onClick={() => copyToClipboard(generateEmbedCode('dark'), 'dark', 'static')}
            className="w-full"
            variant="outline"
          >
            {copiedCode === `dark-static` ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Dark Embed
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Preview */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h5 className="text-sm font-medium text-foreground mb-2">Preview Code:</h5>
        <code className="text-xs text-muted-foreground font-mono block whitespace-pre-wrap break-all">
          {generateEmbedCode(selectedTheme)}
        </code>
      </div>

      {/* Additional Options */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            Responsive Design
          </Badge>
          <Badge variant="outline" className="text-xs">
            Referral Tracking
          </Badge>
          <Badge variant="outline" className="text-xs">
            SEO Friendly
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          All badges are optimized for web performance and include referral tracking.
        </p>
      </div>
    </div>
  );
}
