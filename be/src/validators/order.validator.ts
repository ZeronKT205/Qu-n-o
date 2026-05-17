import { z } from 'zod';
import { OrderStatus, PaymentMethod } from '../types/enums';

// ============================================
// CREATE ORDER
// ============================================
export const createOrderSchema = z.object({
  user_id: z.string().uuid('user_id phải là UUID'),
  address_id: z.string().uuid().optional(),
  voucher_id: z.string().uuid().optional(),
  
  payment_method: z.nativeEnum(PaymentMethod).default(PaymentMethod.COD),
  
  shipping_name: z.string().min(2, 'Tên người nhận phải từ 2 ký tự').optional(),
  shipping_phone: z.string().regex(/^(0)[0-9]{9}$/, 'Số điện thoại không hợp lệ').optional(),
  shipping_address: z.string().min(10, 'Địa chỉ chi tiết hơn').optional(),
  
  note: z.string().max(1000).optional(),
  
  items: z.array(
    z.object({
      variant_id: z.string().uuid('variant_id phải là UUID'),
      quantity: z.number().int().positive('Số lượng phải > 0'),
    })
  ).min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm'),
}).refine(data => {
  // Require either address_id OR full manual shipping info
  if (!data.address_id) {
    return !!data.shipping_name && !!data.shipping_phone && !!data.shipping_address;
  }
  return true;
}, {
  message: 'Vui lòng cung cấp address_id hoặc điền đầy đủ thông tin giao hàng (tên, SĐT, địa chỉ)',
  path: ['shipping_address']
});

// ============================================
// UPDATE ORDER STATUS
// ============================================
export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: z.string().max(1000).optional(),
});

// ============================================
// QUERY PARAMS for GET /orders
// ============================================
export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  status: z.nativeEnum(OrderStatus).optional(),
  user_id: z.string().uuid().optional(),
  order_number: z.string().optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  search: z.string().optional(), // search by order_number OR shipping_name OR shipping_phone
  sort_by: z.enum(['created_at', 'total_amount']).optional().default('created_at'),
  sort_dir: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
