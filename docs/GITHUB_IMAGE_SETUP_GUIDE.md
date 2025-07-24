# GitHub Image Upload Setup Guide

This guide will help you set up GitHub as an image store using jsDelivr CDN for your Next.js project.

## Prerequisites

1. GitHub account
2. Next.js project set up
3. Node.js and npm installed

## Step 1: Create GitHub Repository for Images

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `ai-tools-imgs` (or any name you prefer)
3. Make it public (required for jsDelivr CDN access)
4. Initialize with a README
5. Create a folder structure:
   ```
   ai-tools-imgs/
   ├── imgs/
   │   └── (your tool images will go here)
   └── README.md
   ```

## Step 2: Generate GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "AI Tools Image Upload"
4. Set expiration (recommended: 90 days or 1 year)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

## Step 3: Configure Environment Variables

1. In your Next.js project root, create `.env.local` file:
   ```env
   GITHUB_TOKEN=your_token_here
   ```

2. Replace `your_token_here` with your actual GitHub token
3. Add `.env.local` to your `.gitignore` (should already be there)

## Step 4: Install Required Dependencies

All required dependencies should already be installed. If not:

```bash
npm install
```

## Step 5: Update Configuration (Already Done)

The following files have been created/updated:

- ✅ `/src/app/api/upload-tool-image/route.ts` - Upload API endpoint
- ✅ `/src/components/ImageUpload.tsx` - React component for file upload
- ✅ `/src/lib/utils/image-upload.ts` - Utility functions
- ✅ `next.config.mjs` - Image domain configuration
- ✅ Submit tool page updated with image upload

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/submit-tool`
3. Enter a tool name
4. Upload an image
5. Check the GitHub repository to see if the image was uploaded
6. Verify the CDN URL works: `https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/your-tool-name.png`

## Step 7: Production Deployment

### Vercel (Recommended)

1. Deploy to Vercel as usual
2. Add environment variable in Vercel dashboard:
   - Go to your project dashboard
   - Settings → Environment Variables
   - Add `GITHUB_TOKEN` with your token value
   - Deploy again

### Other Platforms

Add the `GITHUB_TOKEN` environment variable in your hosting platform's settings.

## Troubleshooting

### Common Issues

**1. "GitHub token not configured"**
- Make sure `.env.local` exists with `GITHUB_TOKEN=your_token`
- Restart your development server after adding the token

**2. "GitHub authentication failed"**
- Check if your token is correct
- Verify token has `repo` scope
- Make sure token hasn't expired

**3. "Failed to upload image to GitHub"**
- Check if repository `ai-tools-imgs` exists and is public
- Verify you have write access to the repository
- Check GitHub API rate limits

**4. "Invalid file type"**
- Only PNG, JPG, JPEG, and WebP are supported
- Check file extension and MIME type

**5. "File too large"**
- Maximum file size is 2MB
- Compress your image or use a smaller file

### Testing GitHub API Connection

Create a test script to verify your setup:

```javascript
// test-github-connection.js
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function testConnection() {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ GitHub connection successful!');
      console.log('Authenticated as:', user.login);
    } else {
      console.error('❌ GitHub authentication failed');
      console.error('Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();
```

Run with: `node test-github-connection.js`

### Rate Limiting

GitHub API has rate limits:
- **Authenticated requests**: 5,000 per hour
- **Unauthenticated**: 60 per hour

For production, consider:
- Implementing request queuing
- Adding retry logic with exponential backoff
- Monitoring API usage

## Security Best Practices

1. **Never commit your GitHub token** to version control
2. **Use minimal scope** - only `repo` scope is needed
3. **Rotate tokens regularly** (every 90 days recommended)
4. **Monitor repository access** in GitHub settings
5. **Use environment variables** for all sensitive data

## File Organization

Images will be organized as:
```
ai-tools-imgs/
└── imgs/
    ├── chatgpt.png
    ├── claude.png
    ├── midjourney.webp
    └── ...
```

## CDN URLs

Your images will be accessible via:
- **GitHub**: `https://github.com/Gitnaseem745/ai-tools-imgs/blob/main/imgs/chatgpt.png`
- **Raw GitHub**: `https://raw.githubusercontent.com/Gitnaseem745/ai-tools-imgs/main/imgs/chatgpt.png`  
- **jsDelivr CDN**: `https://cdn.jsdelivr.net/gh/Gitnaseem745/ai-tools-imgs/imgs/chatgpt.png` ⭐

Always use the jsDelivr CDN URL in your application for best performance.

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all setup steps
3. Test with a simple file upload
4. Check browser console for errors
5. Verify GitHub repository permissions
