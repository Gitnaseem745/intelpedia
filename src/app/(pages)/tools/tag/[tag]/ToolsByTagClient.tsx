'use client';

import { useState, useEffect } from 'react';
import { useToolSearch, useToolTags } from '@/hooks/useTools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, Grid, List, ExternalLink, Calendar, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { ToolDocument } from '@/models/Tool';
import ToolCard from '@/components/ToolCard';

export default function ToolsByTagClient() {
  const params = useParams();
  const router = useRouter();
  const tag = decodeURIComponent(params.tag as string);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: searchResults, isLoading } = useToolSearch({
    q: searchQuery || undefined,
    tags: tag,
    page: currentPage,
    limit: 12
  });

  const { data: tagsData } = useToolTags();

  const tools = searchResults?.tools || [];
  const totalTools = searchResults?.pagination?.totalTools || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const ToolListItem = ({ tool }: { tool: ToolDocument }) => (
    <div className="bg-card rounded-lg border border-border p-6 hover:bg-card/80 hover:shadow-md transition-shadow duration-200">
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
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tool.tags?.map((toolTag: string, index: number) => (
              <Badge 
                key={index} 
                variant={toolTag === tag ? 'default' : 'secondary'}
                className="text-xs"
              >
                {toolTag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(new Date(tool.createdAt), 'MMM dd, yyyy')}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-6">
          <Link href={`/tools/${tool._id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <a 
            href={tool.siteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              <ExternalLink className="w-4 h-4 mr-1" />
              Visit
            </Button>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-5">
      {/* Breadcrumb Navigation */}
      <div className="mt-8 mb-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/tools" className="hover:text-primary">
            Tools
          </Link>
          <span>/</span>
          <span>Tags</span>
          <span>/</span>
          <span className="text-foreground">{tag}</span>
        </nav>
      </div>

      {/* Back Button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>
      </div>

      {/* Header */}
      <div className="mt-12 mb-12 text-center">
        <div className="flex justify-center items-center mb-4">
          <TagIcon className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-4xl lg:text-5xl font-bold">
            {tag}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover all tools tagged with &quot;{tag}&quot;. Find the perfect AI tools for your needs.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={`Search within ${tag} tools...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-border rounded-full focus:border-ring"
            />
          </div>
        </form>
      </div>

      {/* Controls */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="text-sm">
              <TagIcon className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
            
            <span className="text-sm text-muted-foreground">
              {totalTools} tool{totalTools !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Related Tags */}
      {tagsData?.tags && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Explore Other Categories</h3>
          <div className="flex flex-wrap gap-2">
            {tagsData.tags
              .filter((tagItem: { tag: string; count: number }) => tagItem.tag !== tag)
              .slice(0, 10)
              .map((tagItem: { tag: string; count: number }) => (
                <Link key={tagItem.tag} href={`/tools/tag/${encodeURIComponent(tagItem.tag)}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary/80"
                  >
                    {tagItem.tag} ({tagItem.count})
                  </Badge>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tools...</p>
        </div>
      )}

      {/* Tools Grid/List */}
      {!isLoading && (
        <>
          {tools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-4">
                No tools found with the tag &quot;{tag}&quot;{searchQuery && ` matching "${searchQuery}"`}.
              </p>
              <div className="space-x-4">
                <Link href="/tools">
                  <Button>
                    Browse All Tools
                  </Button>
                </Link>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={`mb-12 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }`}>
              {tools.map((tool: ToolDocument) => (
                viewMode === 'grid' 
                  ? <ToolCard key={String(tool._id)} tool={tool} />
                  : <ToolListItem key={String(tool._id)} tool={tool} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {searchResults?.pagination && searchResults.pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mb-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: searchResults.pagination.totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === searchResults.pagination.totalPages || 
                  Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </div>
                ))
              }
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, searchResults.pagination.totalPages))}
                disabled={currentPage === searchResults.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
