'use client';

import React, { useState, useEffect } from 'react';
import { useTool, useUpdateTool, useDeleteTool } from '@/hooks/useTools';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  X, 
  ExternalLink,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

interface Feature {
  name: string;
  details: string;
}

interface EditToolPageProps {
  params: Promise<{
    toolId: string;
  }>;
}

export default function EditToolPage({ params }: EditToolPageProps) {
  const { toolId } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();
  
  const { data: toolData, isLoading, error } = useTool(toolId);
  const updateTool = useUpdateTool();
  const deleteTool = useDeleteTool();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    siteUrl: '',
    imgUrl: '',
    features: [] as Feature[],
    featured: false,
    isFree: undefined as boolean | undefined,
    pricing: undefined as number | undefined
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tool = toolData?.tool;

  // Initialize form data when tool loads
  useEffect(() => {
    if (tool) {
      setFormData({
        title: tool.title || '',
        description: tool.description || '',
        tags: tool.tags || [],
        siteUrl: tool.siteUrl || '',
        imgUrl: tool.imgUrl || '',
        features: tool.features || [],
        featured: tool.featured || false,
        isFree: tool.isFree,
        pricing: tool.pricing
      });
    }
  }, [tool]);

  // Track changes
  useEffect(() => {
    if (tool) {
      const hasChanged = 
        formData.title !== tool.title ||
        formData.description !== tool.description ||
        formData.siteUrl !== tool.siteUrl ||
        formData.imgUrl !== (tool.imgUrl || '') ||
        formData.featured !== (tool.featured || false) ||
        formData.isFree !== tool.isFree ||
        formData.pricing !== tool.pricing ||
        JSON.stringify(formData.tags) !== JSON.stringify(tool.tags) ||
        JSON.stringify(formData.features) !== JSON.stringify(tool.features || []);
      
      setHasChanges(hasChanged);
    }
  }, [formData, tool]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUploaded = (cdnUrl: string) => {
    setFormData(prev => ({ ...prev, imgUrl: cdnUrl }));
    toast({
      title: 'Image uploaded!',
      description: 'Your tool image has been uploaded and is ready to use.',
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFeatureChange = (index: number, field: 'name' | 'details', value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', details: '' }]
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateTool.mutateAsync({
        id: toolId,
        tool: {
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          siteUrl: formData.siteUrl,
          imgUrl: formData.imgUrl || undefined,
          features: formData.features.filter(f => f.name.trim() && f.details.trim()),
          featured: formData.featured,
          isFree: formData.isFree,
          pricing: formData.pricing
        }
      });

      toast({
        title: "Success",
        description: "Tool updated successfully!",
      });
      
      setHasChanges(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tool",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTool.mutateAsync(toolId);
      toast({
        title: "Success",
        description: "Tool deleted successfully!",
      });
      router.push('/admin/tools');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tool",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg text-muted-foreground">Loading tool...</span>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <div className="text-lg font-medium text-destructive mb-2">Tool not found</div>
          <p className="text-muted-foreground mb-4">The tool you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <Button asChild>
            <Link href="/admin/tools">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center max-sm:flex-col max-sm:gap-4 max-sm:items-start justify-between mt-4">
        <div className="flex items-center space-x-4">
          <Button className='absolute top-4 max-lg:hidden' variant="ghost" asChild>
            <Link href="/admin/tools">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Tool</h1>
            <p className="text-muted-foreground">Update tool information and settings</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {tool.siteUrl && (
            <Button variant="outline" asChild>
              <a href={tool.siteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </a>
            </Button>
          )}
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteTool.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter tool title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter tool description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="siteUrl">Website URL *</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    value={formData.siteUrl}
                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Tool Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  toolName={formData.title}
                  onImageUploaded={handleImageUploaded}
                  currentImageUrl={formData.imgUrl}
                  disabled={isSubmitting || !formData.title}
                />
                {!formData.title && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                    💡 Enter a tool title first to enable image upload
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Features</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.features.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No features added yet</p>
                    <Button type="button" variant="outline" onClick={handleAddFeature} className="mt-2">
                      Add First Feature
                    </Button>
                  </div>
                ) : (
                  formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Feature name"
                          value={feature.name}
                          onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                        />
                        <Textarea
                          placeholder="Feature details"
                          value={feature.details}
                          onChange={(e) => handleFeatureChange(index, 'details', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Free Plan Toggle */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFree"
                    checked={formData.isFree === true}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isFree: checked === true ? true : undefined }))
                    }
                  />
                  <Label htmlFor="isFree" className="text-sm font-medium">
                    Has Free Plan
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Check if this tool offers a free plan or tier
                </p>

                {/* Pricing Input */}
                <div>
                  <Label htmlFor="pricing">Monthly Price (USD)</Label>
                  <Input
                    id="pricing"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing || ''}
                    onChange={(e) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        pricing: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))
                    }
                    placeholder="9.99"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the monthly subscription price if applicable
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Featured Toggle */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, featured: checked === true }))
                    }
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured Tool
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mark this tool as featured to display it prominently on the homepage
                </p>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !hasChanges}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                {hasChanges && (
                  <p className="text-xs text-muted-foreground text-center">
                    You have unsaved changes
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
