import { z } from 'zod'

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  inStock: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'best_selling']).default('newest'),
  q: z.string().optional(),
})

export const createProductSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  categoryId: z.string().cuid(),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export const createReviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
})

export type ProductQuery = z.infer<typeof productQuerySchema>
export type CreateProduct = z.infer<typeof createProductSchema>
export type CreateReview = z.infer<typeof createReviewSchema>
