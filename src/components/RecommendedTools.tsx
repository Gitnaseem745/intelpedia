'use client';

import { useToolSearch } from '@/hooks/useTools';
import { ToolDocument } from '@/models/Tool';
import ToolCard from '@/components/ToolCard';

interface RecommendedToolsProps {
  currentToolId: string;
  currentToolTags: string[];
}

export default function RecommendedTools({ currentToolId, currentToolTags }: RecommendedToolsProps) {
  // Get the first tag to search for related tools
  const searchTag = currentToolTags[0];
  
  const { data: searchResults, isLoading } = useToolSearch({
    tags: searchTag,
    limit: 7, // Get 7 to filter out current tool and show 6
  });

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Recommended Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tools = searchResults?.tools || [];
  
  // Filter out the current tool and limit to 6 tools
  const recommendedTools = tools
    .filter((tool: ToolDocument) => tool._id?.toString() !== currentToolId)
    .slice(0, 6);

  if (recommendedTools.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Recommended Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedTools.map((tool: ToolDocument) => (
          <ToolCard 
            key={tool._id?.toString()} 
            tool={tool} 
            variant="recommended"
            showDate={false}
            maxTags={3}
          />
        ))}
      </div>
    </div>
  );
}
