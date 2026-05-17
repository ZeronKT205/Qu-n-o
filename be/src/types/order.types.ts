import { OrderStatus, PaymentMethod, PaymentStatus } from './enums';

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  product_image: string | null;
  variant_size: string;
  variant_color: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  address_id: string | null;
  voucher_id: string | null;
  
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  
  note: string | null;
  cancelled_reason: string | null;
  
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  user?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

// ============================================
// DTOs
// ============================================

export interface CreateOrderItemDTO {
  variant_id: string;
  quantity: number;
}

export interface CreateOrderDTO {
  user_id: string;
  address_id?: string;
  voucher_id?: string;
  
  payment_method: PaymentMethod;
  
  // If not using address_id, allow manual input for guests or custom
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  
  note?: string;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  note?: string; // Reason for cancellation or status change
}
