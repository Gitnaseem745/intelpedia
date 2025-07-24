'use client';

import { useState, useMemo } from 'react';
import { usePendingTools } from '@/hooks/usePendingTools';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Loader2,
  RefreshCw,
  Clock
} from 'lucide-react';
import PendingToolCard from '@/components/PendingToolCard';
import { PendingToolDocument } from '@/models/PendingTool';

const ITEMS_PER_PAGE = 12;

export default function AdminPendingToolsPage() {
  const { data: pendingToolsData, isLoading, error, refetch } = usePendingTools();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingTools = useMemo(() => pendingToolsData?.tools || [], [pendingToolsData?.tools]);

  // Filter tools based on search term
  const filteredTools = useMemo(() => {
    if (!searchTerm) return pendingTools;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return pendingTools.filter((tool: PendingToolDocument) => 
      tool.title.toLowerCase().includes(lowercaseSearch) ||
      tool.description.toLowerCase().includes(lowercaseSearch) ||
      tool.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseSearch))
    );
  }, [pendingTools, searchTerm]);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleActionComplete = async () => {
    // Refresh the list after approve/reject action
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg text-muted-foreground">Loading pending tools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium text-destructive mb-2">Error loading pending tools</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {/* <Clock className="h-6 w-6 text-orange-500" /> */}
            <h1 className="text-3xl font-bold text-foreground">Pending Tools Review</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Review and manage tool submissions awaiting approval ({filteredTools.length} of {pendingTools.length} tools)
          </p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search pending tools by name, description, or tags..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      {pendingTools.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingTools.length}</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Filtered Results</span>
            </div>
            <p className="text-2xl font-bold mt-1">{filteredTools.length}</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Current Page</span>
            </div>
            <p className="text-2xl font-bold mt-1">{currentPage} of {totalPages || 1}</p>
          </div>
        </div>
      )}

      {/* Tools Grid */}
      {paginatedTools.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <div className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm ? 'No matching pending tools found' : 'No pending tools'}
          </div>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'All submissions have been reviewed or no tools have been submitted yet'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedTools.map((tool: PendingToolDocument) => (
            <PendingToolCard 
              key={tool._id?.toString()} 
              tool={tool}
              onActionComplete={handleActionComplete}
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
