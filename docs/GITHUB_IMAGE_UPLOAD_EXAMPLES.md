# GitHub Image Upload Integration Example

This file demonstrates how to use the GitHub image upload system in your Next.js application.

## Basic Usage in a Component

```tsx
'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';

export default function ExamplePage() {
  const [toolData, setToolData] = useState({
    title: '',
    imgUrl: ''
  });

  const handleImageUploaded = (cdnUrl: string) => {
    setToolData(prev => ({ ...prev, imgUrl: cdnUrl }));
    console.log('Image uploaded to:', cdnUrl);
    // Example CDN URL: https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/chatgpt.png
  };

  const handleSaveTool = async () => {
    // Your tool data now includes the CDN URL
    const payload = {
      title: toolData.title,
      imgUrl: toolData.imgUrl, // This is the jsDelivr CDN URL
      // ... other fields
    };

    const response = await fetch('/api/tools/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Tool saved with image!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <input
        type="text"
        placeholder="Tool name"
        value={toolData.title}
        onChange={(e) => setToolData(prev => ({ ...prev, title: e.target.value }))}
        className="w-full p-2 border rounded mb-4"
      />

      <ImageUpload
        toolName={toolData.title}
        onImageUploaded={handleImageUploaded}
        currentImageUrl={toolData.imgUrl}
        disabled={!toolData.title}
      />

      <Button onClick={handleSaveTool} className="w-full mt-4">
        Save Tool
      </Button>
    </div>
  );
}
```

## Direct API Usage

```tsx
import { uploadToolImage } from '@/lib/utils/image-upload';

async function handleDirectUpload(file: File, toolName: string) {
  try {
    const result = await uploadToolImage({
      toolName: toolName,
      file: file,
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`);
      }
    });

    if (result.success) {
      console.log('Upload successful!');
      console.log('CDN URL:', result.cdnUrl);
      console.log('GitHub URL:', result.githubUrl);
      console.log('File path:', result.filePath);
      
      // Use the CDN URL in your application
      const toolData = {
        title: toolName,
        imgUrl: result.cdnUrl // Store this in your database
      };
    } else {
      console.error('Upload failed:', result.error);
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}
```

## Utility Functions Examples

```tsx
import { 
  validateImageFile, 
  formatFileSize, 
  isValidCdnUrl,
  extractToolNameFromCdnUrl 
} from '@/lib/utils/image-upload';

// Validate file before upload
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Format file size for display
const sizeText = formatFileSize(file.size); // "1.2 MB"

// Check if URL is from our CDN
const isOurCdn = isValidCdnUrl('https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/chatgpt.png'); // true

// Extract tool name from CDN URL
const toolName = extractToolNameFromCdnUrl('https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/chatgpt.png'); // "chatgpt"
```

## Image URL Examples

When images are uploaded, they will be accessible via these URLs:

### GitHub Repository URL
```
https://github.com/Gitnaseem745/ai-tools-imgs/blob/main/imgs/chatgpt.png
```

### Raw GitHub URL
```
https://raw.githubusercontent.com/Gitnaseem745/ai-tools-imgs/main/imgs/chatgpt.png
```

### jsDelivr CDN URL (Recommended)
```
https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/chatgpt.png
```

The jsDelivr CDN URL is what you should store in your database as it provides:
- Global CDN distribution
- Better performance
- Automatic optimization
- Reliable caching

## Error Handling Examples

```tsx
try {
  const result = await uploadToolImage({ toolName, file });
  
  if (!result.success) {
    switch (result.error) {
      case 'No image file provided':
        // Handle missing file
        break;
      case 'Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed':
        // Handle invalid file type
        break;
      case 'File too large. Maximum size is 2MB':
        // Handle file too large
        break;
      case 'GitHub authentication failed. Please check your token.':
        // Handle auth error
        break;
      case 'GitHub API rate limit exceeded or insufficient permissions.':
        // Handle rate limit
        break;
      default:
        // Handle generic error
        break;
    }
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## Integration with Tool Approval System

When you approve a tool in your admin panel, the image will already be available via CDN:

```tsx
// In your approve API route
const newTool = new Tool({
  title: pendingTool.title,
  description: pendingTool.description,
  imgUrl: pendingTool.imgUrl, // This is already the CDN URL
  // ... other fields
});
```

## File Naming Convention

Files are automatically named based on the tool name:
- Tool name: "ChatGPT"
- Sanitized: "chatgpt"
- Final filename: "chatgpt.png" (or .jpg, .webp based on upload)
- Full path: "imgs/chatgpt.png"
- CDN URL: "https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/chatgpt.png"

## Best Practices

1. **Always validate files before upload**
2. **Use meaningful tool names** (they become the filename)
3. **Store the CDN URL** in your database, not the GitHub URL
4. **Handle upload errors gracefully**
5. **Show upload progress** for better UX
6. **Validate tool names** before allowing upload
7. **Consider rate limiting** for production use
