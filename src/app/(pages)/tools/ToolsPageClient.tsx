'use client';

import { useState, useEffect } from 'react';
import { useToolSearch, useToolTags } from '@/hooks/useTools';
import { useToolFiltering } from '@/hooks/useToolFiltering';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Tag as TagIcon } from 'lucide-react';
import { ToolDocument } from '@/models/Tool';
import ToolCard from '@/components/ToolCard';
import ToolFilter from '@/components/ToolFilter';

export default function ToolsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: tagsData } = useToolTags();
  
  // Get all tools for filtering
  const { data: allToolsData } = useToolSearch({
    limit: 1000 // Get all tools for client-side filtering
  });

  // Use the filtering hook
  const { 
    filters, 
    filteredTools, 
    updateFilter, 
    clearFilters: clearAllFilters, 
    getFilterCounts 
  } = useToolFiltering(allToolsData?.tools || []);

  // Update search and tags based on local state
  useEffect(() => {
    updateFilter('search', searchQuery);
  }, [searchQuery, updateFilter]);

  useEffect(() => {
    updateFilter('tags', selectedTags);
  }, [selectedTags, updateFilter]);

  // Pagination for filtered results
  const toolsPerPage = 12;
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);

  const isLoading = !allToolsData;
  const totalTools = filteredTools.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    clearAllFilters();
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-5">
      {/* Header */}
      <div className="mt-20 mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Discover AI Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore our curated collection of the best AI tools for productivity, creativity, and innovation.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for AI tools, features, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-border rounded-full focus:border-ring"
            />
          </div>
        </form>
      </div>

      {/* Filters and Controls */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            {(searchQuery || selectedTags.length > 0 || filters.pricingType !== 'all') && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive/90"
              >
                Clear All
              </Button>
            )}
            
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

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <ToolFilter
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearAllFilters}
              filterCounts={getFilterCounts}
              className="lg:col-span-1"
            />
            
            {/* Tag Filters */}
            {tagsData?.tags && (
              <div className="lg:col-span-3 bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tagsData.tags.map((tagItem: { tag: string; count: number }) => (
                    <Badge
                      key={tagItem.tag}
                      variant={selectedTags.includes(tagItem.tag) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => toggleTag(tagItem.tag)}
                    >
                      {tagItem.tag} ({tagItem.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Filters */}
        {(selectedTags.length > 0 || filters.pricingType !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium text-foreground">
              Active filters:
            </span>
            {filters.pricingType !== 'all' && (
              <Badge
                variant="default"
                className="cursor-pointer"
                onClick={() => updateFilter('pricingType', 'all')}
              >
                {filters.pricingType === 'free' && 'Free Tools'}
                {filters.pricingType === 'paid' && 'Paid Tools'}
                {filters.pricingType === 'freemium' && 'Freemium Tools'} ×
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

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
          {paginatedTools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters.
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={`mb-12 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }`}>
              {paginatedTools.map((tool: ToolDocument) => (
                <ToolCard 
                  key={String(tool._id)} 
                  tool={tool} 
                  variant={viewMode}
                  onTagClick={toggleTag}
                  maxTags={viewMode === 'list' ? undefined : 3}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mb-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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
