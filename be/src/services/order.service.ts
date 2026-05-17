import * as OrderModel from '../models/order.model';
import { ApiError } from '../utils/ApiError';
import { CreateOrderInput, OrderQueryInput, UpdateOrderStatusInput } from '../validators/order.validator';
import { Order, OrderDetail } from '../types/order.types';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../types/enums';
import { getSupabase } from '../config/supabase';

// ============================================
// ORDER STATUS MACHINE
// ============================================
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: ['completed', 'return_requested'],
  return_requested: ['returned', 'delivered'], // admin can reject return
  completed: [],
  cancelled: [],
  returned: [],
};

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
  return `LEV-${date}-${randomStr}`;
}

export async function getOrders(filters: OrderQueryInput): Promise<{ data: Order[]; total: number }> {
  return OrderModel.findAll(filters);
}

export async function getOrderById(id: string): Promise<OrderDetail> {
  const order = await OrderModel.findById(id);
  if (!order) {
    throw ApiError.notFound(`Không tìm thấy đơn hàng với ID: "${id}"`);
  }
  return order;
}

export async function getOrderByNumber(order_number: string): Promise<OrderDetail> {
  const order = await OrderModel.findByOrderNumber(order_number);
  if (!order) {
    throw ApiError.notFound(`Không tìm thấy đơn hàng: "${order_number}"`);
  }
  return order;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order_number = generateOrderNumber();
  
  let subtotal = 0;
  const orderItemsData = [];

  // 1. Resolve all variants to get prices and check stock
  for (const item of input.items) {
    const snapshot = await OrderModel.getVariantSnapshot(item.variant_id);
    if (!snapshot) {
      throw ApiError.badRequest(`Variant không hợp lệ: ${item.variant_id}`);
    }
    if (snapshot.stock_quantity < item.quantity) {
      throw ApiError.badRequest(`Sản phẩm ${(snapshot.product as any).name} không đủ số lượng tồn kho`);
    }

    // Calculate price: sale_price (if any) + additional_price
    const productData = snapshot.product as any;
    const basePrice = productData.sale_price ?? productData.base_price;
    const unitPrice = Number(basePrice) + Number(snapshot.additional_price);
    const totalPrice = unitPrice * item.quantity;

    subtotal += totalPrice;

    // Default image
    const primaryImage = snapshot.images?.find((img: any) => img.is_primary)?.image_url 
      || snapshot.images?.[0]?.image_url 
      || null;

    orderItemsData.push({
      variant_id: item.variant_id,
      product_name: productData.name,
      product_image: primaryImage,
      variant_size: snapshot.size,
      variant_color: snapshot.color_name,
      unit_price: unitPrice,
      quantity: item.quantity,
      total_price: totalPrice,
    });
  }

  // 2. Calculate discounts (mock voucher logic for now)
  let discount_amount = 0;
  // if (input.voucher_id) { ... fetch voucher, check validity, calculate discount }
  
  let shipping_fee = subtotal > 499000 ? 0 : 30000;
  let total_amount = subtotal - discount_amount + shipping_fee;

  // 3. Prepare order data
  const orderData = {
    order_number,
    user_id: input.user_id,
    address_id: input.address_id || null,
    voucher_id: input.voucher_id || null,
    
    subtotal,
    discount_amount,
    shipping_fee,
    total_amount,
    
    status: OrderStatus.PENDING_PAYMENT,
    payment_method: input.payment_method,
    payment_status: PaymentStatus.PENDING,
    
    shipping_name: input.shipping_name || 'N/A', // Real app would fetch from address_id if provided
    shipping_phone: input.shipping_phone || 'N/A',
    shipping_address: input.shipping_address || 'N/A',
    
    note: input.note,
  };

  // 4. Create Order
  const order = await OrderModel.create(orderData, orderItemsData);

  // TODO: Deduct stock quantity in DB (requires another model update)

  return order;
}

export async function updateOrderStatus(
  id: string,
  input: UpdateOrderStatusInput,
  adminUserId?: string
): Promise<Order> {
  const existing = await OrderModel.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Không tìm thấy đơn hàng với ID: "${id}"`);
  }

  const fromStatus = existing.status as string;
  const toStatus = input.status as string;

  // Status machine validation
  const allowedTransitions = VALID_TRANSITIONS[fromStatus] ?? [];
  if (!allowedTransitions.includes(toStatus)) {
    throw ApiError.badRequest(
      `Không thể chuyển trạng thái từ ${fromStatus} sang ${toStatus}`,
      'INVALID_STATUS_TRANSITION'
    );
  }

  // Determine payment_status side-effect
  let paymentStatus: string | undefined;
  if (toStatus === 'confirmed' && existing.payment_method === PaymentMethod.BANK_TRANSFER) {
    paymentStatus = PaymentStatus.PAID;
  } else if (toStatus === 'cancelled') {
    paymentStatus = PaymentStatus.FAILED;
  }

  // Update order status (and optionally payment_status)
  const updated = await OrderModel.updateStatus(id, toStatus, input.note, paymentStatus);

  // Insert order_status_history record
  await getSupabase()
    .from('order_status_history')
    .insert({
      order_id: id,
      from_status: fromStatus,
      to_status: toStatus,
      changed_by: adminUserId ?? null,
      note: input.note ?? null,
    });

  return updated;
}
