import { z } from 'zod';

export const dateRangeSchema = z.object({
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from_date phải là YYYY-MM-DD').optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'to_date phải là YYYY-MM-DD').optional(),
});

export const adminCustomerQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  search: z.string().optional(),
  role: z.enum(['customer', 'admin', 'super_admin']).optional(),
  is_active: z.coerce.boolean().optional(),
  sort_by: z.enum(['created_at', 'orders_count', 'total_spent']).optional().default('created_at'),
  sort_dir: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const updateCustomerSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^(0|\+84)[3-9]\d{8}$/).optional().nullable(),
  is_active: z.boolean().optional(),
  role: z.enum(['customer', 'admin']).optional(), // super_admin cannot be set via API
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type AdminCustomerQueryInput = z.infer<typeof adminCustomerQuerySchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
