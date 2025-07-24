# Backend to Next.js API Migration Guide

## Overview

This guide documents the complete migration from your Express.js backend to Next.js API routes. All functionality has been preserved and enhanced with better TypeScript support, error handling, and modern patterns.

## ✅ Migration Completed

### 1. **Database Connection** (`backend/config/db.js` → `src/lib/db.ts`)
- Migrated to Next.js compatible MongoDB connection with connection caching
- Added TypeScript support
- Improved error handling

### 2. **Tool Model** (`backend/models/Tool.js` → `src/models/Tool.ts`)
- Converted to TypeScript with proper interfaces
- Enhanced type safety
- Maintained same schema structure

### 3. **Validation** (`backend/validation/toolSchema.js` → `src/lib/validations/toolSchema.ts`)
- Migrated Zod validation schema
- Added TypeScript types
- Enhanced validation messages

### 4. **API Routes**
- **GET /api/tools** - Get all tools
- **POST /api/tools** - Create new tool
- **GET /api/tools/[toolId]** - Get tool by ID
- **PUT /api/tools/[toolId]** - Update tool
- **DELETE /api/tools/[toolId]** - Delete tool
- **GET /api/tools/search** - Search tools (NEW)
- **GET /api/tools/tags** - Get all tags (NEW)
- **POST /api/tools/bulk** - Bulk operations (NEW)

### 5. **Enhanced Features Added**
- **Search & Pagination**: Full-text search with pagination
- **Tags Management**: Get all available tags with counts
- **Bulk Operations**: Import tools from data file
- **Better Error Handling**: Comprehensive error responses
- **TypeScript Support**: Full type safety throughout
- **React Hooks**: Ready-to-use hooks for frontend integration

## 🚀 Setup Instructions

### 1. Environment Variables
Create `.env.local` file in project root:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/intelpedia
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intelpedia
```

### 2. Install Dependencies
All required dependencies are already installed:
- `mongoose` - MongoDB ODM
- `zod` - Validation library
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the API
```bash
npm run test-api
```

### 5. Visit Management Page
Navigate to: `http://localhost:3000/tools-management`

## 📁 New File Structure

```
src/
├── app/api/tools/                    # API Routes
│   ├── route.ts                      # GET, POST /api/tools
│   ├── [toolId]/route.ts            # GET, PUT, DELETE /api/tools/:id
│   ├── search/route.ts              # GET /api/tools/search
│   ├── tags/route.ts                # GET /api/tools/tags
│   ├── bulk/route.ts                # POST /api/tools/bulk
│   └── README.md                    # API Documentation
├── app/tools-management/            # Demo Management Page
│   └── page.tsx                     # React component for testing
├── models/                          # Database Models
│   └── Tool.ts                      # Tool model with TypeScript
├── lib/                            # Utilities
│   ├── db.ts                       # Database connection
│   ├── api-utils.ts                # Error handling utilities
│   ├── validations/
│   │   └── toolSchema.ts           # Validation schemas
│   └── utils/
│       └── bulkCreate.ts           # Bulk operations
├── hooks/                          # React Hooks
│   └── useTools.ts                 # API interaction hooks
└── scripts/                       # Development Scripts
    └── test-api.js                 # API testing script
```

## 🔄 API Endpoints Mapping

| Old Express Route | New Next.js Route | Method | Description |
|-------------------|-------------------|---------|-------------|
| `GET /api/tools` | `GET /api/tools` | GET | Get all tools |
| `POST /api/tools` | `POST /api/tools` | POST | Create tool |
| `GET /api/tools/:toolId` | `GET /api/tools/[toolId]` | GET | Get by ID |
| `PUT /api/tools/:toolId` | `PUT /api/tools/[toolId]` | PUT | Update tool |
| `DELETE /api/tools/:toolId` | `DELETE /api/tools/[toolId]` | DELETE | Delete tool |
| *NEW* | `GET /api/tools/search` | GET | Search tools |
| *NEW* | `GET /api/tools/tags` | GET | Get all tags |
| *NEW* | `POST /api/tools/bulk` | POST | Bulk operations |

## 🎯 Usage Examples

### Frontend Integration (React)

```typescript
import { useTools, useCreateTool } from '@/hooks/useTools';

function ToolsComponent() {
  const { data: tools, isLoading } = useTools();
  const createTool = useCreateTool();

  const handleCreate = async (toolData) => {
    await createTool.mutateAsync(toolData);
  };

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {tools?.tools?.map(tool => (
        <div key={tool._id}>{tool.title}</div>
      ))}
    </div>
  );
}
```

### Direct API Calls

```javascript
// Get all tools
const response = await fetch('/api/tools');
const data = await response.json();

// Create tool
const response = await fetch('/api/tools', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(toolData)
});

// Search tools
const response = await fetch('/api/tools/search?q=AI&page=1&limit=10');
```

## 🧪 Testing

### Automated Testing
```bash
npm run test-api
```

### Manual Testing
1. Visit: `http://localhost:3000/tools-management`
2. Test CRUD operations through the UI
3. Use browser dev tools to inspect API calls

### API Documentation
Complete API documentation is available at: `src/app/api/README.md`

## 🔧 Migration Benefits

1. **Better Performance**: Next.js API routes with caching
2. **Type Safety**: Full TypeScript support
3. **Enhanced Features**: Search, pagination, bulk operations
4. **Better DX**: React Query hooks for easy integration
5. **Error Handling**: Comprehensive error responses
6. **Validation**: Enhanced Zod validation
7. **Modern Patterns**: Current Next.js best practices

## 🗂️ Backend Cleanup

After verifying everything works, you can safely remove:
- `backend/` folder (all functionality migrated)
- Express.js dependencies if not used elsewhere
- Old environment variables for Express server

## 🚨 Important Notes

1. **Database**: Use the same MongoDB database for seamless transition
2. **Data Migration**: No data migration needed - same database schema
3. **Environment**: Update your production environment variables
4. **Dependencies**: All Express dependencies can be removed
5. **Deployment**: Deploy as standard Next.js application

## 📞 Support

If you encounter any issues:
1. Check the API documentation in `src/app/api/README.md`
2. Run the test script: `npm run test-api`
3. Check console logs for detailed error messages
4. Verify your MongoDB connection string

## ✨ Next Steps

1. Integrate the API with your existing frontend components
2. Add authentication if needed
3. Implement rate limiting for production
4. Add more advanced search features
5. Consider adding caching for better performance

Your backend is now fully migrated to Next.js with enhanced functionality! 🎉
