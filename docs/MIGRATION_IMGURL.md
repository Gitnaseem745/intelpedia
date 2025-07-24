# Migration Plan: Adding imgUrl Field

## Overview
This migration adds the optional `imgUrl` field to both `Tool` and `PendingTool` models to store image URLs for tools.

## Changes Made

### 1. Database Schema Changes
- **Tool Model**: Added optional `imgUrl: string` field
- **PendingTool Model**: Added optional `imgUrl: string` field

### 2. Validation Schema Updates
- **toolSchema.ts**: Added optional `imgUrl` field with URL validation

### 3. Frontend Updates
- **submit-tool/page.tsx**: Added image URL input field with validation
- Form now includes imgUrl in FormData interface and state management

### 4. API Updates
- **api/tools/submit/route.ts**: Updated to handle the new imgUrl field

## Migration Steps

### For Existing Data
Since the `imgUrl` field is optional, no database migration is required. Existing documents will continue to work without this field.

### For New Deployments
1. Deploy the updated code
2. Test the submission form with and without image URLs
3. Verify that existing tools still display correctly

### Optional: Backfill Existing Tools
If you want to add images to existing tools, you can:

1. **Manual Update**: Use MongoDB Compass or similar tool to add imgUrl to existing documents
2. **Script-based Update**: Create a script to fetch and update tools with appropriate images

Example script (run in MongoDB shell or Node.js):
```javascript
// Example: Add default images based on categories or fetch from external APIs
db.tools.updateMany(
  { imgUrl: { $exists: false } },
  { $set: { imgUrl: null } }
)

// Or update specific tools:
db.tools.updateOne(
  { title: "Example Tool" },
  { $set: { imgUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tool-name.svg" } }
)
```

## Testing Checklist

- [ ] Submit a new tool with an image URL
- [ ] Submit a new tool without an image URL
- [ ] Verify validation works for invalid URLs
- [ ] Check that existing tools still load correctly
- [ ] Ensure pending tools display properly in admin dashboard

## Notes

- The field is optional, so it won't break existing functionality
- Empty strings are automatically converted to `undefined` in the API
- URL validation ensures only valid URLs are accepted
- The frontend provides helpful placeholder text and description
