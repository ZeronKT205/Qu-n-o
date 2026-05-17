import { z } from 'zod';
import { ProductBadge, ProductSize } from '../types/enums';

// ============================================
// CREATE PRODUCT
// ============================================
export const createProductSchema = z.object({
  category_id: z.string().uuid('category_id phải là UUID hợp lệ'),
  name: z
    .string()
    .min(3, 'Tên sản phẩm tối thiểu 3 ký tự')
    .max(255, 'Tên sản phẩm tối đa 255 ký tự'),
  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .optional(),
  description: z.string().max(5000).optional(),
  base_price: z
    .number({ error: 'Giá gốc là bắt buộc' })
    .nonnegative('Giá gốc phải >= 0'),
  sale_price: z.number().nonnegative('Giá sale phải >= 0').optional().nullable(),
  discount_percent: z
    .number()
    .int()
    .min(0)
    .max(100, 'Phần trăm giảm giá phải từ 0-100')
    .optional()
    .nullable(),
  badge: z.nativeEnum(ProductBadge).optional().nullable(),
  sku_prefix: z.string().max(20).optional().nullable(),
  material: z.string().max(255).optional().nullable(),
  care_instructions: z.string().max(2000).optional().nullable(),
  is_featured: z.boolean().optional().default(false),
  images: z
    .array(
      z.object({
        image_url: z.string().url('URL ảnh không hợp lệ'),
        alt_text: z.string().max(255).optional(),
        sort_order: z.number().int().nonnegative().optional().default(0),
        is_primary: z.boolean().optional().default(false),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        size: z.nativeEnum(ProductSize),
        color_name: z.string().min(1).max(50),
        color_hex: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/, 'Mã màu phải là hex hợp lệ (VD: #FF0000)')
          .optional()
          .default('#000000'),
        sku: z.string().min(1).max(50),
        stock_quantity: z.number().int().nonnegative().default(0),
        additional_price: z.number().nonnegative().optional().default(0),
      })
    )
    .optional(),
});

// ============================================
// UPDATE PRODUCT — all fields optional
// ============================================
export const updateProductSchema = createProductSchema
  .omit({ images: true, variants: true })
  .partial();

// ============================================
// QUERY PARAMS for GET /products
// ============================================
export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
  category: z.string().optional(),
  badge: z.nativeEnum(ProductBadge).optional(),
  min_price: z.coerce.number().nonnegative().optional(),
  max_price: z.coerce.number().nonnegative().optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'bestseller'])
    .optional()
    .default('newest'),
  search: z.string().max(100).optional(),
  featured: z.coerce.boolean().optional(),
});

// Inferred types from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
