'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  uploadToolImage, 
  validateImageFile, 
  createImagePreview, 
  formatFileSize,
  type ImageUploadResponse 
} from '@/lib/utils/image-upload';
import { Upload, X, ImageIcon, Loader2, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  toolName: string;
  onImageUploaded: (cdnUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  toolName,
  onImageUploaded,
  currentImageUrl,
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: 'Invalid file',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    try {
      const preview = await createImagePreview(file);
      setPreviewUrl(preview);
    } catch (error) {
      console.error('Failed to create preview:', error);
      toast({
        title: 'Preview error',
        description: 'Could not create image preview',
        variant: 'destructive',
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please drop an image file (PNG, JPG, JPEG, or WebP)',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image file first',
        variant: 'destructive',
      });
      return;
    }

    if (!toolName || toolName.trim().length === 0) {
      toast({
        title: 'Tool name required',
        description: 'Please enter a tool name before uploading an image',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result: ImageUploadResponse = await uploadToolImage({
        toolName: toolName.trim(),
        file: selectedFile,
        onProgress: setUploadProgress,
      });

      if (result.success && result.cdnUrl) {
        toast({
          title: 'Upload successful!',
          description: 'Image has been uploaded and is now available via CDN',
        });
        
        onImageUploaded(result.cdnUrl);
        
        // Keep the preview but clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSelectedFile(null);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="image-upload">Tool Image</Label>
      
      {/* Current Image Display */}
      {currentImageUrl && !previewUrl && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded border overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <Image 
                src={currentImageUrl} 
                alt="Current tool image" 
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<div class="w-6 h-6 text-gray-400">📷</div>';
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Current Image</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Served via jsDelivr CDN
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </Card>
      )}

      {/* Upload Area */}
      <Card 
        className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="text-center">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto rounded border overflow-hidden">
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedFile?.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedFile ? formatFileSize(selectedFile.size) : ''}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragOver ? 'Drop image here' : 'Upload tool image'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag & drop or click to select • PNG, JPG, WebP • Max 2MB
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* File Input */}
      <Input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Progress */}
      {isUploading && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={isUploading || disabled || !toolName}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to Database
              </>
            )}
          </Button>
          <Button
            onClick={clearSelection}
            variant="outline"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Help Text */}
      {/* <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Images will be uploaded to GitHub and served via jsDelivr CDN</p>
        <p>• File will be named based on the tool name (e.g., chatgpt.png)</p>
        <p>• Existing images with the same name will be overwritten</p>
      </div> */}
    </div>
  );
}
