import { z } from 'zod';

// ============================================
// CREATE CATEGORY
// ============================================
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục tối thiểu 2 ký tự').max(100, 'Tên danh mục tối đa 100 ký tự'),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .optional(),
  icon_url: z.string().url('URL ảnh không hợp lệ').optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  sort_order: z.number().int().nonnegative().optional().default(0),
  is_active: z.boolean().optional().default(true),
});

// ============================================
// UPDATE CATEGORY
// ============================================
export const updateCategorySchema = createCategorySchema.partial();

// ============================================
// QUERY PARAMS for GET /categories
// ============================================
export const categoryQuerySchema = z.object({
  activeOnly: z.coerce.boolean().optional().default(true),
  search: z.string().max(100).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
