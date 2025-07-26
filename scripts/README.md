# Database Cleanup Scripts

This directory contains scripts for managing and cleaning up the tools database.

## Scripts for Deleting Tools Without Images

### 1. Preview Script (Safe - No Deletion)
**File:** `preview-delete-tools-without-image.js`
**Command:** `npm run preview-delete-no-image`

**What it does:**
- Connects to your MongoDB database
- Finds all tools that don't have an `imgUrl` property
- Shows detailed information about each tool
- Exports results to a JSON file for review
- Provides recommendations before deletion
- **Does NOT delete anything - completely safe to run**

**Example output:**
```
🔍 Analyzing approved tools without imgUrl...
📊 Results for approved tools:
   Total approved tools: 150
   Without imgUrl: 25
   Percentage: 16.7%

📋 Detailed list of approved tools without imgUrl:
1. Example Tool Name
   ID: 65f1234567890abcdef12345
   URL: https://example.com
   Tags: ai, productivity
   Featured: false
   Free: true
   Created: 2024-01-15T10:30:00.000Z
   imgUrl: Not set
```

### 2. Deletion Script (Destructive)
**File:** `delete-tools-without-image.js`
**Command:** `npm run delete-tools-no-image`

**What it does:**
- Connects to your MongoDB database
- Finds all tools without `imgUrl` in both collections:
  - `tools` (approved tools)
  - `pending-tools` (pending tools)
- Shows summary of tools to be deleted
- **Asks for confirmation before deletion**
- Performs bulk deletion
- Shows final results

**Example output:**
```
📊 SUMMARY:
   Approved tools to delete: 25
   Pending tools to delete: 8
   Total tools to delete: 33

⚠️  WARNING: This action cannot be undone!
Do you want to proceed with deletion? (y/N): y

✅ Successfully deleted 25 approved tools
✅ Successfully deleted 8 pending tools
🎉 Bulk deletion completed successfully!
```

## Prerequisites

1. **Environment Variables**: Make sure you have a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

2. **Dependencies**: All required packages should already be installed:
   - `mongoose`
   - `dotenv`

## Safety Features

### Preview Script Safety:
- ✅ Read-only operations
- ✅ No data modification
- ✅ Exports data for review
- ✅ Provides detailed analysis

### Deletion Script Safety:
- ✅ Shows preview before deletion
- ✅ Requires explicit confirmation
- ✅ Can be cancelled at any time (Ctrl+C)
- ✅ Detailed logging of operations
- ✅ Error handling and rollback

## Recommended Workflow

1. **First, run the preview script:**
   ```bash
   npm run preview-delete-no-image
   ```

2. **Review the generated JSON file:**
   ```bash
   # File: scripts/tools-to-delete-preview.json
   # Contains complete details of all tools that would be deleted
   ```

3. **Backup your database (recommended):**
   ```bash
   mongodump --uri="your_mongodb_uri" --out=backup_before_cleanup
   ```

4. **If satisfied, run the deletion script:**
   ```bash
   npm run delete-tools-no-image
   ```

## What Qualifies as "No Image"?

Tools are considered to have "no image" if their `imgUrl` field is:
- `undefined` (field doesn't exist)
- `null`
- Empty string `""`
- Missing entirely

## Recovery

If you need to recover deleted tools:
1. Restore from your MongoDB backup
2. Check the exported JSON file from the preview script
3. Manually recreate important tools using the admin dashboard

## Troubleshooting

### "MONGODB_URI not set" error:
- Create `.env.local` file in project root
- Add your MongoDB connection string

### Connection errors:
- Check if MongoDB is running
- Verify connection string is correct
- Ensure network connectivity

### Permission errors:
- Ensure your MongoDB user has delete permissions
- Check if collections exist

## Files Created

- `scripts/tools-to-delete-preview.json` - Detailed export of tools to be deleted
- Console logs showing all operations

## Alternative Methods

If you prefer manual control, you can also:
1. Use MongoDB Compass to manually review and delete tools
2. Write custom MongoDB queries
3. Use the admin dashboard to edit tools individually

## Script Information

Both scripts:
- Support both `tools` and `pending-tools` collections
- Provide detailed logging
- Handle errors gracefully
- Close database connections properly
- Can be interrupted safely with Ctrl+C
