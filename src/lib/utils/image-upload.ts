// Utility functions for image upload and processing

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  fileName?: string;
  filePath?: string;
  githubUrl?: string;
  cdnUrl?: string;
  sha?: string;
  commitSha?: string;
  error?: string;
}

export interface ImageUploadOptions {
  toolName: string;
  file: File;
  onProgress?: (progress: number) => void;
}

/**
 * Upload an image to GitHub repository via API
 */
export async function uploadToolImage({ 
  toolName, 
  file, 
  onProgress 
}: ImageUploadOptions): Promise<ImageUploadResponse> {
  try {
    // Validate inputs
    if (!file) {
      throw new Error('No file provided');
    }

    if (!toolName || toolName.trim().length === 0) {
      throw new Error('Tool name is required');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    formData.append('toolName', toolName.trim());

    // Track upload progress if callback provided
    if (onProgress) {
      onProgress(0);
    }

    // Make upload request
    const response = await fetch('/api/upload-tool-image', {
      method: 'POST',
      body: formData,
    });

    if (onProgress) {
      onProgress(100);
    }

    const result: ImageUploadResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Upload failed with status ${response.status}`);
    }

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return {
      success: false,
      message: 'Upload failed',
      error: errorMessage
    };
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only PNG, JPG, JPEG, and WebP files are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 2MB.'
    };
  }

  return { valid: true };
}

/**
 * Preview image file before upload
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate jsDelivr CDN URL from GitHub repository info
 */
export function generateCdnUrl(owner: string, repo: string, path: string): string {
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}/${path}`;
}

/**
 * Check if a URL is a valid jsDelivr CDN URL for our repository
 */
export function isValidCdnUrl(url: string): boolean {
  const cdnPattern = /^https:\/\/cdn\.jsdelivr\.net\/gh\/Gitnaseem745\/ai-tools-imgs\//;
  return cdnPattern.test(url);
}

/**
 * Extract tool name from CDN URL
 */
export function extractToolNameFromCdnUrl(url: string): string | null {
  const match = url.match(/\/imgs\/(.+)\.[^.]+$/);
  return match ? match[1] : null;
}
