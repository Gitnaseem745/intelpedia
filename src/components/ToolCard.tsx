'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar, Tag as TagIcon, Wrench, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, format } from 'date-fns';
import { ToolDocument } from '@/models/Tool';
import PricingDisplay from '@/components/PricingDisplay';

export type ToolCardVariant = 'grid' | 'list' | 'compact' | 'search' | 'recommended' | 'admin';

interface ToolCardProps {
  tool: ToolDocument;
  variant?: ToolCardVariant;
  showDate?: boolean;
  showVisitButton?: boolean;
  maxTags?: number;
  className?: string;
  onTagClick?: (tag: string) => void;
  onClose?: () => void;
}

export default function ToolCard({ 
  tool, 
  variant = 'grid',
  showDate = true,
  showVisitButton = true,
  maxTags = 3,
  className = '',
  onTagClick,
  onClose
}: ToolCardProps) {
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const renderToolIcon = (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: { wrapper: 'w-8 h-8', icon: 'w-4 h-4', image: 32 },
      md: { wrapper: 'w-12 h-12', icon: 'w-6 h-6', image: 48 },
      lg: { wrapper: 'w-16 h-16', icon: 'w-8 h-8', image: 64 }
    };
    
    const { wrapper, icon, image } = sizes[size];
    
    if (tool.imgUrl) {
      return (
        <div className={`${wrapper} rounded-lg overflow-hidden bg-primary/10 flex-shrink-0`}>
          <Image
            src={tool.imgUrl}
            alt={`${tool.title} icon`}
            width={image}
            height={image}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<div class="w-full h-full bg-primary/10 flex items-center justify-center"><svg class="${icon} text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M10 3h4a8 8 0 018 8v2a8 8 0 01-8 8h-4a8 8 0 01-8-8V11a8 8 0 018-8z"></path></svg></div>`;
            }}
          />
        </div>
      );
    }
    
    return (
      <div className={`${wrapper} rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0`}>
        <Wrench className={`${icon} text-primary`} />
      </div>
    );
  };

  const renderToolBanner = (height: 'sm' | 'md' | 'lg' = 'md') => {
    if (tool.imgUrl) {
      return (
        <div className="w-full rounded-t-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 relative">
          <Image
            src={tool.imgUrl}
            alt={`${tool.title} preview`}
            width={800}
            height={400}
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to gradient background with icon
              const target = e.target as HTMLImageElement;
              const container = target.parentElement;
              if (container) {
                container.innerHTML = `
                  <div class="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <svg class="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M10 3h4a8 8 0 018 8v2a8 8 0 01-8 8h-4a8 8 0 01-8-8V11a8 8 0 018-8z"></path>
                    </svg>
                  </div>
                `;
              }
            }}
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Pricing Badge Overlay */}
          <div className="absolute top-2 right-2 z-10 shadow-lg">
            <PricingDisplay 
              isFree={tool.isFree} 
              pricing={tool.pricing} 
              variant="default"
              size="sm"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-48 rounded-t-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center relative">
        <Wrench className="w-12 h-12 text-primary/40" />
        
        {/* Pricing Badge Overlay for fallback banner */}
        <div className="absolute top-2 left-2 z-10">
          <PricingDisplay 
            isFree={tool.isFree} 
            pricing={tool.pricing} 
            variant="default"
            size="sm"
          />
        </div>
      </div>
    );
  };

  const renderTags = () => (
    <div className="flex flex-wrap gap-1">
      {tool.tags?.slice(0, maxTags).map((tag: string, index: number) => (
        <Badge 
          key={index} 
          variant="secondary"
          className={`text-xs ${onTagClick ? 'cursor-pointer hover:bg-secondary/80' : ''}`}
          onClick={onTagClick ? (e) => handleTagClick(tag, e) : undefined}
        >
          {variant === 'recommended' && <TagIcon className="w-3 h-3 mr-1" />}
          {tag}
        </Badge>
      ))}
      {tool.tags && tool.tags.length > maxTags && (
        <Badge variant="outline" className="text-xs">
          +{tool.tags.length - maxTags}{variant === 'compact' ? '' : ' more'}
        </Badge>
      )}
    </div>
  );

  const renderActionButtons = () => {
    if (variant === 'search') return null;
    
    if (variant === 'admin') {
      return (
        <div className="pt-2 border-t">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/admin/tools/${tool._id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Tool
            </Link>
          </Button>
        </div>
      );
    }
    
    return (
      <div className={`flex ${variant === 'list' ? 'flex-col space-y-2' : 'gap-2'}`}>
        <Link 
          href={`/tools/${tool._id}`} 
          className={variant === 'list' ? 'w-full' : 'flex-1'}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className={variant === 'list' ? 'w-full' : 'w-full'}
          >
            View Details
          </Button>
        </Link>
        {showVisitButton && (
          <Button
            variant={variant === 'recommended' ? 'outline' : 'default'}
            size="sm"
            onClick={() => window.open(tool.siteUrl, '_blank', 'noopener,noreferrer')}
            className={variant === 'recommended' ? 'px-3' : variant === 'list' ? 'w-full' : ''}
          >
            {variant === 'recommended' ? (
              <ExternalLink className="w-4 h-4" />
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-1" />
                Visit
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const renderDate = () => {
    if (!showDate || !tool.createdAt) return null;
    
    if (variant === 'admin') {
      return (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(tool.updatedAt || tool.createdAt), 'MMM d, yyyy')}</span>
          </div>
          
          {tool.siteUrl && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <a href={tool.siteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 mr-1" />
        {formatDate(new Date(tool.createdAt), 'MMM dd, yyyy')}
      </div>
    );
  };

  // Search variant (compact search result)
  if (variant === 'search') {
    return (
      <Link
        href={`/tools/${tool._id}`}
        onClick={onClose}
        className="block p-3 rounded-xl hover:bg-muted transition-colors group"
      >
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            {renderToolIcon('md')}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {tool.title}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
            <div className="mt-2">
              {renderTags()}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List variant (full width with side-by-side layout)
  if (variant === 'list') {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link 
              href={`/tools/${tool._id}`}
              className="text-xl font-semibold text-card-foreground hover:text-primary transition-colors"
            >
              {tool.title}
            </Link>
            <p className="text-muted-foreground mt-2 mb-4">
              {tool.description}
            </p>
            
            <div className="mb-4">
              {renderTags()}
            </div>
            
            {renderDate()}
          </div>
          
          <div className="ml-6">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (minimal card)
  if (variant === 'compact') {
    return (
      <div className={`bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}>
        {/* Small Featured Image Banner */}
        {renderToolBanner('sm')}
        
        <div className="p-4">
          <Link 
            href={`/tools/${tool._id}`}
            className="block"
          >
            <h3 className="font-semibold text-card-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {tool.description}
            </p>
          </Link>
          
          <div className="mb-3">
            {renderTags()}
          </div>
          
          <div className="flex justify-between items-center">
            {renderDate()}
            {renderActionButtons()}
          </div>
        </div>
      </div>
    );
  }

  // Recommended variant (Card component based)
  if (variant === 'recommended') {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border border-border bg-card overflow-hidden ${className}`}>
        {/* Featured Image Banner */}
        {renderToolBanner('sm')}
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {tool.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
            {tool.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="mb-4">
            {renderTags()}
          </div>
          {renderActionButtons()}
        </CardContent>
      </Card>
    );
  }

  // Admin variant (Card component based with admin features)
  if (variant === 'admin') {
    return (
      <Card className={`group hover:shadow-md transition-shadow ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Link href={`/admin/tools/${tool._id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {tool.description}
          </p>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {renderTags()}
            </div>
          )}

          {/* Meta Info */}
          {renderDate()}

          {/* Action Buttons */}
          {renderActionButtons()}
        </CardContent>
      </Card>
    );
  }

  // Default: Grid variant
  return (
    <div className={`bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Featured Image Banner */}
      {renderToolBanner('md')}
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <Link 
            href={`/tools/${tool._id}`}
            className="text-xl font-semibold text-card-foreground hover:text-primary transition-colors block line-clamp-2 leading-tight"
          >
            {tool.title}
          </Link>
          <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
            {tool.description}
          </p>
        </div>
        
        <div className="mb-4">
          {renderTags()}
        </div>
        
        <div className="flex items-center justify-between">
          {renderDate()}
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
}
