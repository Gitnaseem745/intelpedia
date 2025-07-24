'use client';

import { useState, useMemo } from 'react';
import { useTools } from '@/hooks/useTools';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Loader2,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { ToolDocument } from '@/models/Tool';

const ITEMS_PER_PAGE = 12;

export default function AdminToolsPage() {
  const { data: toolsData, isLoading, error } = useTools();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tools = useMemo(() => toolsData?.tools || [], [toolsData?.tools]);

  // Filter tools based on search term
  const filteredTools = useMemo(() => {
    if (!searchTerm) return tools;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return tools.filter((tool: ToolDocument) => 
      tool.title.toLowerCase().includes(lowercaseSearch) ||
      tool.description.toLowerCase().includes(lowercaseSearch) ||
      tool.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseSearch))
    );
  }, [tools, searchTerm]);

  // Paginate filtered tools
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTools, currentPage]);

  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg text-muted-foreground">Loading tools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium text-destructive mb-2">Error loading tools</div>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tools</h1>
          <p className="text-muted-foreground">
            Manage and edit your tools collection ({filteredTools.length} of {tools.length} tools)
          </p>
        </div>
        
        <Button asChild>
          <Link href="/admin/tools/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Tool
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tools by name, description, or tags..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tools Grid */}
      {paginatedTools.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm ? 'No tools found' : 'No tools available'}
          </div>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Start by adding your first tool'
            }
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link href="/admin/tools/new">Add Your First Tool</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedTools.map((tool: ToolDocument) => (
            <ToolCard 
              key={tool._id?.toString()} 
              tool={tool} 
              variant="admin"
              showDate={true}
              maxTags={3}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-1 text-muted-foreground">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
