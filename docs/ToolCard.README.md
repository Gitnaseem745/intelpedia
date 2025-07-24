# ToolCard Component

A reusable React component for displaying tool information cards throughout the application. The component supports multiple variants and customization options to fit different use cases.

## Features

- **Multiple Variants**: 6 different display variants to match different contexts
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Clickable tags, action buttons, and hover effects
- **Customizable**: Flexible props to control appearance and behavior
- **Type Safe**: Full TypeScript support with proper type definitions

## Variants

### 1. Grid (Default)
- Standard card layout for grid displays
- Shows title, description, tags, date, and action buttons
- Used in: Main tools page

### 2. List
- Full-width layout with side-by-side content
- Ideal for list views with more content
- Used in: Tools page list view

### 3. Compact
- Minimal card with essential information
- Smaller footprint for dense layouts
- Good for: Sidebar components, small spaces

### 4. Search
- Simplified layout for search results
- No action buttons, click-to-navigate
- Used in: Search dropdown results

### 5. Recommended
- Enhanced card with shadui Card components
- Professional appearance for recommendations
- Used in: Recommended tools section

### 6. Admin
- Administrative interface with edit controls
- Shows meta information and edit buttons
- Used in: Admin dashboard

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tool` | `ToolDocument` | **required** | The tool data object |
| `variant` | `ToolCardVariant` | `'grid'` | Display variant |
| `showDate` | `boolean` | `true` | Whether to show creation/update date |
| `showVisitButton` | `boolean` | `true` | Whether to show the visit site button |
| `maxTags` | `number` | `3` | Maximum number of tags to display |
| `className` | `string` | `''` | Additional CSS classes |
| `onTagClick` | `(tag: string) => void` | `undefined` | Callback when tag is clicked |
| `onClose` | `() => void` | `undefined` | Callback for search variant close action |

## Usage Examples

### Basic Usage
```tsx
import ToolCard from '@/components/ToolCard';

<ToolCard tool={toolData} />
```

### Grid Layout (Tools Page)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {tools.map((tool) => (
    <ToolCard 
      key={tool._id} 
      tool={tool} 
      variant="grid"
      onTagClick={(tag) => handleTagFilter(tag)}
    />
  ))}
</div>
```

### List Layout
```tsx
<div className="space-y-6">
  {tools.map((tool) => (
    <ToolCard 
      key={tool._id} 
      tool={tool} 
      variant="list"
      maxTags={5}
    />
  ))}
</div>
```

### Recommended Tools
```tsx
<ToolCard 
  tool={tool} 
  variant="recommended"
  showDate={false}
  maxTags={3}
/>
```

### Search Results
```tsx
<ToolCard 
  tool={tool} 
  variant="search" 
  onClose={() => setSearchOpen(false)}
  maxTags={3}
/>
```

### Admin Interface
```tsx
<ToolCard 
  tool={tool} 
  variant="admin"
  showDate={true}
  maxTags={3}
/>
```

## Migration Guide

### From RecommendedTools Component
**Before:**
```tsx
// Complex Card structure with multiple imports
<Card className="group hover:shadow-lg...">
  <CardHeader>
    <CardTitle>{tool.title}</CardTitle>
    <CardDescription>{tool.description}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Tags rendering */}
    {/* Action buttons */}
  </CardContent>
</Card>
```

**After:**
```tsx
<ToolCard 
  tool={tool} 
  variant="recommended"
  showDate={false}
  maxTags={3}
/>
```

### From ToolsPageClient Component
**Before:**
```tsx
// Inline component definitions
const ToolCard = ({ tool }) => ( /* ... */ );
const ToolListItem = ({ tool }) => ( /* ... */ );

// Conditional rendering
{viewMode === 'grid' 
  ? <ToolCard tool={tool} />
  : <ToolListItem tool={tool} />
}
```

**After:**
```tsx
<ToolCard 
  tool={tool} 
  variant={viewMode} // 'grid' or 'list'
  onTagClick={handleTagClick}
/>
```

## Benefits

1. **DRY Principle**: Single component replaces multiple similar implementations
2. **Consistency**: Uniform appearance and behavior across the application
3. **Maintainability**: Changes in one place affect all usages
4. **Type Safety**: Full TypeScript support prevents errors
5. **Flexibility**: Multiple variants for different contexts
6. **Performance**: Optimized rendering with proper key props

## File Locations

- **Component**: `src/components/ToolCard.tsx`
- **Examples**: `src/components/ToolCard.examples.tsx`
- **Used in**:
  - `src/components/RecommendedTools.tsx`
  - `src/app/(pages)/tools/ToolsPageClient.tsx`
  - `src/components/SearchContent.tsx`
  - `src/app/admin/tools/page.tsx`

## Dependencies

- `@/components/ui/button`
- `@/components/ui/badge`
- `@/components/ui/card`
- `lucide-react` icons
- `next/link`
- `date-fns`
- `@/models/Tool`
