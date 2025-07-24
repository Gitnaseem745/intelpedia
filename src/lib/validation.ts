import { z } from 'zod';

// Validation schemas for API endpoints
export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required').max(256, 'Password too long'),
});

export const toolSubmissionSchema = z.object({
  name: z.string().min(1, 'Tool name is required').max(100, 'Tool name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  url: z.string().url('Invalid URL').max(500, 'URL too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  tags: z.array(z.string().max(30, 'Tag too long')).max(10, 'Too many tags'),
  imageUrl: z.string().url('Invalid image URL').max(500, 'Image URL too long').optional(),
  pricing: z.enum(['free', 'freemium', 'paid']).optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(2000, 'Comment too long'),
  author: z.string().min(1, 'Author name is required').max(100, 'Author name too long'),
  email: z.string().email('Invalid email').max(100, 'Email too long').optional(),
});

// Input sanitization helper
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, ''); // Remove vbscript: URLs
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
  upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
} as const;
