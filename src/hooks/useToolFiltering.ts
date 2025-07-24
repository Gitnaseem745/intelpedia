import { useState, useMemo, useCallback } from 'react';
import { ToolDocument } from '@/models/Tool';

export interface ToolFilters {
  pricingType?: 'all' | 'free' | 'paid' | 'freemium';
  search?: string;
  tags?: string[];
}

export const useToolFiltering = (tools: ToolDocument[] = []) => {
  const [filters, setFilters] = useState<ToolFilters>({
    pricingType: 'all',
    search: '',
    tags: []
  });

  const filteredTools = useMemo(() => {
    let filtered = [...tools];

    // Filter by pricing type
    if (filters.pricingType && filters.pricingType !== 'all') {
      filtered = filtered.filter(tool => {
        switch (filters.pricingType) {
          case 'free':
            // Show tools that are free (isFree === true and pricing === 0 or undefined)
            return tool.isFree === true && (tool.pricing === undefined || tool.pricing === 0);
          case 'paid':
            // Show tools that are paid only (isFree === false and pricing > 0)
            return tool.isFree === false && tool.pricing !== undefined && tool.pricing > 0;
          case 'freemium':
            // Show tools that have both free and paid plans (isFree === true and pricing > 0)
            return tool.isFree === true && tool.pricing !== undefined && tool.pricing > 0;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(tool =>
        filters.tags!.some(filterTag => 
          tool.tags?.some(toolTag => 
            toolTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }, [tools, filters]);

  const updateFilter = useCallback((key: keyof ToolFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      pricingType: 'all',
      search: '',
      tags: []
    });
  }, []);

  const getFilterCounts = useMemo(() => {
    const counts = {
      all: tools.length,
      free: 0,
      paid: 0,
      freemium: 0
    };

    tools.forEach(tool => {
      if (tool.isFree === true && (tool.pricing === undefined || tool.pricing === 0)) {
        counts.free++;
      } else if (tool.isFree === false && tool.pricing !== undefined && tool.pricing > 0) {
        counts.paid++;
      } else if (tool.isFree === true && tool.pricing !== undefined && tool.pricing > 0) {
        counts.freemium++;
      }
    });

    return counts;
  }, [tools]);

  return {
    filters,
    filteredTools,
    updateFilter,
    clearFilters,
    getFilterCounts
  };
};
