import { z } from 'zod';

export const toolSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(120, { message: 'Title must be less than 120 characters.' }),

  description: z.string()
    .trim()
    .min(20, { message: 'Description must be at least 20 characters long.' }),

  tags: z.array(z.string()).optional(),

  features: z.array(
    z.object({
      name: z.string(),
      details: z.string()
    })
  ).optional(),

  siteUrl: z
    .string()
    .url({ message: 'Invalid URL format.' })
    .min(10, { message: 'URL must be at least 10 characters long.' }),

  imgUrl: z
    .string()
    .url({ message: 'Invalid image URL format.' })
    .optional()
    .or(z.literal('')),

  featured: z.boolean().optional(),

  isFree: z.boolean().optional(),

  pricing: z.number()
    .min(0, { message: 'Pricing must be a positive number.' })
    .optional()
});

export type ToolInput = z.infer<typeof toolSchema>;
