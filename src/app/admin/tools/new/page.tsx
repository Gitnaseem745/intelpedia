'use client';

import { useState } from 'react';
import { useCreateTool } from '@/hooks/useTools';
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
  Plus, 
  X, 
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

interface Feature {
  name: string;
  details: string;
}

export default function NewToolPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createTool = useCreateTool();

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

  const handleInputChange = (field: string, value: string | number | boolean | undefined) => {
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
      const result = await createTool.mutateAsync({
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        siteUrl: formData.siteUrl,
        imgUrl: formData.imgUrl || undefined,
        features: formData.features.filter(f => f.name.trim() && f.details.trim()),
        featured: formData.featured,
        isFree: formData.isFree,
        pricing: formData.pricing
      });

      toast({
        title: "Success",
        description: "Tool created successfully!",
      });
      
      // Reset the form
      setFormData({
        title: '',
        description: '',
        tags: [],
        siteUrl: '',
        imgUrl: '',
        features: [],
        featured: false,
        isFree: undefined,
        pricing: undefined
      });
      setNewTag('');
      
      // Redirect to the edit page of the newly created tool
      router.push(`/admin/tools/${result.newTool._id}/edit`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tool",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.siteUrl.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 justify-items-start space-y-4">
        <Button className='absolute top-4 max-lg:hidden' variant="ghost" asChild>
          <Link href="/admin/tools">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Tool</h1>
          <p className="text-muted-foreground">Create a new tool entry for your collection</p>
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
                  <CardTitle>Features (Optional)</CardTitle>
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
                <CardTitle>Tags (Optional)</CardTitle>
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
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Tool
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>* Required fields</p>
                  {!isFormValid && (
                    <p className="text-destructive">Please fill in all required fields</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
