import { getSupabase } from '../config/supabase';
import { Order, OrderDetail } from '../types/order.types';
import { OrderQueryInput } from '../validators/order.validator';
import { logger } from '../utils/logger';

const supabase = () => getSupabase();

export async function findAll(filters: OrderQueryInput): Promise<{ data: Order[]; total: number }> {
  const { page, limit, status, user_id, order_number, from_date, to_date, payment_method, search, sort_by, sort_dir } = filters;

  let query = supabase()
    .from('orders')
    .select('*, user:users(full_name, email, phone)', { count: 'exact' })
    .eq('is_deleted', false);

  if (status) query = query.eq('status', status);
  if (user_id) query = query.eq('user_id', user_id);
  if (order_number) query = query.eq('order_number', order_number);
  if (from_date) query = query.gte('created_at', from_date);
  if (to_date) query = query.lte('created_at', to_date);
  if (payment_method) query = query.eq('payment_method', payment_method);
  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,shipping_name.ilike.%${search}%,shipping_phone.ilike.%${search}%`
    );
  }

  // Sorting
  const ascending = sort_dir === 'asc';
  query = query.order(sort_by ?? 'created_at', { ascending });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    logger.error('order.model.findAll error:', error);
    throw new Error(error.message);
  }

  return { data: (data as Order[]) || [], total: count || 0 };
}

export async function findById(id: string): Promise<OrderDetail | null> {
  const { data, error } = await supabase()
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      user:users(full_name, email, phone)
    `)
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    logger.error('order.model.findById error:', error);
    throw new Error(error.message);
  }

  return data as OrderDetail;
}

export async function findByOrderNumber(order_number: string): Promise<OrderDetail | null> {
  const { data, error } = await supabase()
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      user:users(full_name, email, phone)
    `)
    .eq('order_number', order_number)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    logger.error('order.model.findByOrderNumber error:', error);
    throw new Error(error.message);
  }

  return data as OrderDetail;
}

// Order creation is complex, we'll keep the basic insert here
// The service layer will handle the transaction logic (fetching variants, calculating prices, etc.)
export async function create(orderData: any, itemsData: any[]): Promise<Order> {
  // In a real production app, this should be an RPC function in Postgres to guarantee atomicity.
  // For this template, we do it sequentially.
  
  const { data: order, error: orderError } = await supabase()
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    logger.error('order.model.create error:', orderError);
    throw new Error(orderError.message);
  }

  const orderId = (order as Order).id;

  const itemsToInsert = itemsData.map(item => ({
    ...item,
    order_id: orderId,
  }));

  const { error: itemsError } = await supabase()
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    logger.error('order.model.create items error:', itemsError);
    // Ideally rollback here if we had transaction support
  }

  return order as Order;
}

export async function updateStatus(
  id: string,
  status: string,
  note?: string,
  paymentStatus?: string
): Promise<Order> {
  const updateData: Record<string, unknown> = { status };
  if (note !== undefined) updateData['note'] = note;
  if (paymentStatus !== undefined) updateData['payment_status'] = paymentStatus;

  const { data, error } = await supabase()
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('order.model.updateStatus error:', error);
    throw new Error(error.message);
  }

  return data as Order;
}

export async function getVariantSnapshot(variantId: string) {
  const { data, error } = await supabase()
    .from('product_variants')
    .select(`
      id, size, color_name, additional_price, stock_quantity, sku,
      product:products(id, name, base_price, sale_price, discount_percent),
      images:product_images(image_url)
    `)
    .eq('id', variantId)
    .single();
    
  if (error || !data) return null;
  return data;
}
