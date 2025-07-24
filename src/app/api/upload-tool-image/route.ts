import { NextRequest, NextResponse } from 'next/server';

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = 'Gitnaseem745';
const GITHUB_REPO_NAME = 'ai-tools-imgs';
const GITHUB_BRANCH = 'main';
const IMAGES_FOLDER = 'imgs';

// File validation
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface GitHubFileResponse {
  sha?: string;
  content: string;
}

interface GitHubUploadResponse {
  content: {
    name: string;
    path: string;
    sha: string;
    download_url: string;
  };
  commit: {
    sha: string;
    message: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check if GitHub token is configured
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const toolName = formData.get('toolName') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!toolName) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB' },
        { status: 400 }
      );
    }

    // Generate filename
    const fileExtension = getFileExtension(file.name, file.type);
    const sanitizedToolName = sanitizeFileName(toolName);
    const fileName = `${sanitizedToolName}.${fileExtension}`;
    const filePath = `${IMAGES_FOLDER}/${fileName}`;

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Content = Buffer.from(buffer).toString('base64');

    // Check if file already exists and get its SHA if it does
    let existingFileSha: string | undefined;
    try {
      const existingFileResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (existingFileResponse.ok) {
        const existingFile: GitHubFileResponse = await existingFileResponse.json();
        existingFileSha = existingFile.sha;
      }
    } catch (error) {
      // File doesn't exist, which is fine
      console.log('File does not exist yet, will create new:', error);
    }

    // Upload/update file to GitHub
    const uploadResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: existingFileSha 
            ? `Update ${fileName} for ${toolName}` 
            : `Add ${fileName} for ${toolName}`,
          content: base64Content,
          branch: GITHUB_BRANCH,
          ...(existingFileSha && { sha: existingFileSha }),
        }),
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('GitHub API Error:', errorData);
      
      if (uploadResponse.status === 401) {
        return NextResponse.json(
          { error: 'GitHub authentication failed. Please check your token.' },
          { status: 401 }
        );
      }
      
      if (uploadResponse.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded or insufficient permissions.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to upload image to GitHub' },
        { status: 500 }
      );
    }

    const uploadResult: GitHubUploadResponse = await uploadResponse.json();

    // Generate jsDelivr CDN URL
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${filePath}`;

    return NextResponse.json({
      success: true,
      message: existingFileSha ? 'Image updated successfully' : 'Image uploaded successfully',
      fileName: fileName,
      filePath: filePath,
      githubUrl: uploadResult.content.download_url,
      cdnUrl: cdnUrl,
      sha: uploadResult.content.sha,
      commitSha: uploadResult.commit.sha
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during image upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getFileExtension(fileName: string, mimeType: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension && ['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
    return extension;
  }
  
  // Fallback to mime type
  switch (mimeType) {
    case 'image/png': return 'png';
    case 'image/jpeg': return 'jpg';
    case 'image/jpg': return 'jpg';
    case 'image/webp': return 'webp';
    default: return 'png';
  }
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Rate limiting helper (optional enhancement)
async function checkRateLimit(): Promise<boolean> {
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.rate.remaining > 10; // Keep at least 10 requests in reserve
    }
    
    return true; // Assume OK if we can't check
  } catch (error) {
    console.warn('Could not check GitHub rate limit:', error);
    return true;
  }
}
