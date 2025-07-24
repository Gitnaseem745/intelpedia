'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

interface Feature {
  name: string;
  details: string;
}

interface FormData {
  title: string;
  description: string;
  siteUrl: string;
  imgUrl: string;
  tags: string[];
  features: Feature[];
  isFree?: boolean;
  pricing?: number;
}

export default function SubmitToolClient() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    siteUrl: '',
    imgUrl: '',
    tags: [],
    features: [],
    isFree: undefined,
    pricing: undefined
  });

  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState({ name: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const router = useRouter();

  const handleImageUploaded = (cdnUrl: string) => {
    setFormData(prev => ({ ...prev, imgUrl: cdnUrl }));
    toast({
      title: 'Image uploaded!',
      description: 'Your tool image has been uploaded and is ready to use.',
    });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addFeature = () => {
    if (featureInput.name.trim() && featureInput.details.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { ...featureInput }]
      }));
      setFeatureInput({ name: '', details: '' });
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }

    if (!formData.siteUrl.trim()) {
      newErrors.siteUrl = 'URL is required';
    } else {
      try {
        new URL(formData.siteUrl);
      } catch {
        newErrors.siteUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tools/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Tool submitted for review successfully!',
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          siteUrl: '',
          imgUrl: '',
          tags: [],
          features: [],
          isFree: undefined,
          pricing: undefined
        });
        
        // Redirect to home page or a success page
        router.push('/');
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit tool',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit a Tool</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share a useful tool with the community. All submissions are reviewed before publishing.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tool Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter tool name"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this tool does and how it's useful"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Tool URL *</Label>
            <Input
              id="siteUrl"
              type="url"
              value={formData.siteUrl}
              onChange={(e) => handleInputChange('siteUrl', e.target.value)}
              placeholder="https://example.com"
              className={errors.siteUrl ? 'border-red-500' : ''}
            />
            {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <ImageUpload
              toolName={formData.title}
              onImageUploaded={handleImageUploaded}
              currentImageUrl={formData.imgUrl}
              disabled={isSubmitting || !formData.title}
            />
            {!formData.title && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                💡 Enter a tool title first to enable image upload
              </p>
            )}
            {!formData.imgUrl && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📷 Adding an image helps your tool stand out! Upload one above or it will use a default placeholder.
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTag)}
                placeholder="Enter a tag and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={featureInput.name}
                  onChange={(e) => setFeatureInput(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Feature name"
                  className="flex-1"
                />
                <Input
                  value={featureInput.details}
                  onChange={(e) => setFeatureInput(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Feature details"
                  className="flex-1"
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  Add
                </Button>
              </div>
            </div>
            {formData.features.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <span className="font-medium">{feature.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        - {feature.details}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeFeature(index)}
                      variant="ghost"
                      size="sm"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Pricing Information (Optional)</Label>
            
            {/* Free Plan Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFree"
                checked={formData.isFree === true}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    isFree: checked === true ? true : undefined 
                  }))
                }
              />
              <Label htmlFor="isFree" className="text-sm font-medium">
                This tool has a free plan or tier
              </Label>
            </div>
            
            {/* Pricing Input */}
            <div className="space-y-2">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the monthly subscription price if applicable
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Tool for Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
