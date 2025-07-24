// Example usage of the ToolCard component

import ToolCard from '@/components/ToolCard';
import { ToolDocument } from '@/models/Tool';

// Example tool data
const exampleTool = {
  _id: 'example-id',
  title: 'Example AI Tool',
  description: 'This is an example AI tool for demonstration purposes.',
  tags: ['AI', 'productivity', 'automation', 'machine learning'],
  siteUrl: 'https://example.com',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-15T00:00:00.000Z')
} as ToolDocument;

export default function ToolCardExamples() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">ToolCard Component Examples</h1>
      
      {/* 1. Grid variant (default) */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Grid Variant (Default)</h2>
        <ToolCard tool={exampleTool} />
      </div>

      {/* 2. List variant */}
      <div>
        <h2 className="text-lg font-semibold mb-4">List Variant</h2>
        <ToolCard tool={exampleTool} variant="list" />
      </div>

      {/* 3. Compact variant */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Compact Variant</h2>
        <ToolCard tool={exampleTool} variant="compact" />
      </div>

      {/* 4. Search variant */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Search Variant</h2>
        <ToolCard 
          tool={exampleTool} 
          variant="search" 
          onClose={() => console.log('Closed')}
        />
      </div>

      {/* 5. Recommended variant */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recommended Variant</h2>
        <ToolCard tool={exampleTool} variant="recommended" />
      </div>

      {/* 6. Admin variant */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Admin Variant</h2>
        <ToolCard tool={exampleTool} variant="admin" />
      </div>

      {/* 7. Customized with props */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Customized Grid</h2>
        <ToolCard 
          tool={exampleTool} 
          variant="grid"
          showDate={false}
          showVisitButton={false}
          maxTags={2}
          onTagClick={(tag) => console.log('Tag clicked:', tag)}
          className="border-2 border-primary"
        />
      </div>
    </div>
  );
}
