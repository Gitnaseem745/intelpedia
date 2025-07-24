# Tools API Documentation

This API provides endpoints for managing AI tools in the Intelpedia application. The API is built using Next.js App Router and provides full CRUD operations for tools.

## Base URL
```
/api/tools
```

## Environment Variables
Make sure to set up the following environment variable in your `.env.local` file:

```
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

### 1. Get All Tools
- **GET** `/api/tools`
- **Description**: Retrieves all tools from the database
- **Response**:
  ```json
  {
    "message": "Total 10 tools are fetched from db.",
    "tools": [...]
  }
  ```

### 2. Get Tool by ID
- **GET** `/api/tools/[toolId]`
- **Description**: Retrieves a specific tool by its ID
- **Parameters**:
  - `toolId` (string): MongoDB ObjectId of the tool
- **Response**:
  ```json
  {
    "message": "Tool Name is fetched.",
    "tool": {...}
  }
  ```

### 3. Create New Tool
- **POST** `/api/tools`
- **Description**: Creates a new tool
- **Request Body**:
  ```json
  {
    "title": "Tool Name",
    "description": "Tool description (min 20 characters)",
    "tags": ["ai", "productivity"],
    "siteUrl": "https://example.com",
    "features": [
      {
        "name": "Feature Name",
        "details": "Feature description"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Tool with Tool Name is added to db.",
    "newTool": {...}
  }
  ```

### 4. Update Tool
- **PUT** `/api/tools/[toolId]`
- **Description**: Updates an existing tool
- **Parameters**:
  - `toolId` (string): MongoDB ObjectId of the tool
- **Request Body**: Same as create, but all fields are optional
- **Response**:
  ```json
  {
    "message": "Tool with ID: [toolId] is updated.",
    "tool": {...}
  }
  ```

### 5. Delete Tool
- **DELETE** `/api/tools/[toolId]`
- **Description**: Deletes a tool by its ID
- **Parameters**:
  - `toolId` (string): MongoDB ObjectId of the tool
- **Response**:
  ```json
  {
    "message": "Tool with ID: [toolId] deleted."
  }
  ```

### 6. Search Tools
- **GET** `/api/tools/search`
- **Description**: Search tools with various filters
- **Query Parameters**:
  - `q` (string): Text search in title and description
  - `tags` (string): Comma-separated list of tags to filter by
  - `page` (number): Page number for pagination (default: 1)
  - `limit` (number): Number of results per page (default: 10)
- **Example**: `/api/tools/search?q=AI&tags=productivity,automation&page=1&limit=5`
- **Response**:
  ```json
  {
    "message": "Found 5 tools matching your search.",
    "tools": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalTools": 15,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```

### 7. Get All Tags
- **GET** `/api/tools/tags`
- **Description**: Retrieves all unique tags with their usage count
- **Response**:
  ```json
  {
    "message": "Found 25 unique tags.",
    "tags": [
      {
        "tag": "ai",
        "count": 50
      },
      {
        "tag": "productivity",
        "count": 30
      }
    ]
  }
  ```

### 8. Bulk Operations
- **POST** `/api/tools/bulk`
- **Description**: Performs bulk operations on tools
- **Request Body**:
  ```json
  {
    "action": "bulk-create"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Bulk create completed. Added: 100, Skipped: 5, Errors: 0",
    "stats": {
      "addedCount": 100,
      "skippedCount": 5,
      "errorCount": 0
    }
  }
  ```

## Data Models

### Tool Schema
```typescript
interface Tool {
  _id: string;
  title: string;           // Required, unique, 3-120 characters
  description: string;     // Required, min 20 characters
  tags: string[];         // Optional array of strings
  siteUrl: string;        // Required, valid URL, min 10 characters
  features?: Feature[];   // Optional array of features
  createdAt: Date;
  updatedAt: Date;
}

interface Feature {
  name: string;
  details: string;
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters long."
    }
  ]
}
```

### Not Found (404)
```json
{
  "error": "Tool with ID [toolId] is not found."
}
```

### Method Not Allowed (405)
```json
{
  "error": "Method POST not allowed"
}
```

### Duplicate Entry (409)
```json
{
  "error": "A tool with this title already exists."
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## React Hooks

The API comes with pre-built React hooks for easy integration:

```typescript
import {
  useTools,
  useTool,
  useToolSearch,
  useToolTags,
  useCreateTool,
  useUpdateTool,
  useDeleteTool,
  useBulkCreateTools
} from '@/hooks/useTools';

// Usage examples
const { data: tools, isLoading } = useTools();
const { data: tool } = useTool(toolId);
const createMutation = useCreateTool();
const updateMutation = useUpdateTool();
const deleteMutation = useDeleteTool();
```

## File Structure

```
src/
├── app/api/tools/
│   ├── route.ts              # GET /api/tools, POST /api/tools
│   ├── [toolId]/route.ts     # GET, PUT, DELETE /api/tools/[toolId]
│   ├── search/route.ts       # GET /api/tools/search
│   ├── tags/route.ts         # GET /api/tools/tags
│   └── bulk/route.ts         # POST /api/tools/bulk
├── models/
│   └── Tool.ts               # Mongoose model for Tool
├── lib/
│   ├── db.ts                 # Database connection
│   ├── api-utils.ts          # Error handling utilities
│   └── validations/
│       └── toolSchema.ts     # Zod validation schema
├── hooks/
│   └── useTools.ts           # React Query hooks
└── utils/
    └── bulkCreate.ts         # Bulk operations utility
```

## Migration from Express Backend

This API replaces the Express.js backend with the following mappings:

| Express Route | Next.js API Route |
|---------------|-------------------|
| `GET /api/tools` | `GET /api/tools` |
| `POST /api/tools` | `POST /api/tools` |
| `GET /api/tools/:toolId` | `GET /api/tools/[toolId]` |
| `PUT /api/tools/:toolId` | `PUT /api/tools/[toolId]` |
| `DELETE /api/tools/:toolId` | `DELETE /api/tools/[toolId]` |

Additional features added:
- Search endpoint with pagination
- Tags endpoint for filtering
- Bulk operations endpoint
- Better error handling and validation
- TypeScript support throughout
- React Query hooks for easy frontend integration
