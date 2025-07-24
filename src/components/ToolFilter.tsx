import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, X, Search } from 'lucide-react';
import { ToolFilters } from '@/hooks/useToolFiltering';

interface ToolFilterProps {
  filters: ToolFilters;
  onFilterChange: (key: keyof ToolFilters, value: any) => void;
  onClearFilters: () => void;
  filterCounts: {
    all: number;
    free: number;
    paid: number;
    freemium: number;
  };
  className?: string;
}

export default function ToolFilter({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  filterCounts,
  className = '' 
}: ToolFilterProps) {
  const pricingTypes = [
    { key: 'all', label: 'All Tools', count: filterCounts.all },
    { key: 'free', label: 'Free', count: filterCounts.free },
    { key: 'freemium', label: 'Freemium', count: filterCounts.freemium },
    { key: 'paid', label: 'Paid Only', count: filterCounts.paid }
  ];

  const hasActiveFilters = filters.pricingType !== 'all' || filters.search || (filters.tags && filters.tags.length > 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">Search</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tools..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Pricing Type */}
        <div>
          <Label className="text-sm font-medium">Pricing Model</Label>
          <div className="mt-2 space-y-2">
            {pricingTypes.map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filters.pricingType === key ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-between text-left"
                onClick={() => onFilterChange('pricingType', key)}
              >
                <span>{label}</span>
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Active Tags Filter */}
        {filters.tags && filters.tags.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Active Tag Filters</Label>
            <div className="mt-2 flex flex-wrap gap-1">
              {filters.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = filters.tags!.filter((_, i) => i !== index);
                      onFilterChange('tags', newTags.length > 0 ? newTags : []);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
