import { getSupabase } from '../config/supabase';
import { logger } from '../utils/logger';

const sb = () => getSupabase();

// ============================================
// DASHBOARD
// ============================================

/**
 * Returns today's revenue, order count, new customers.
 * Also returns comparison vs yesterday.
 */
export async function getDashboardStats() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const todayStart = `${todayStr}T00:00:00.000Z`;
  const todayEnd = `${todayStr}T23:59:59.999Z`;
  const yestStart = `${yesterdayStr}T00:00:00.000Z`;
  const yestEnd = `${yesterdayStr}T23:59:59.999Z`;

  // Today orders
  const { data: todayOrders } = await sb()
    .from('orders')
    .select('total_amount, status')
    .eq('is_deleted', false)
    .gte('created_at', todayStart)
    .lte('created_at', todayEnd);

  // Yesterday orders
  const { data: yestOrders } = await sb()
    .from('orders')
    .select('total_amount')
    .eq('is_deleted', false)
    .gte('created_at', yestStart)
    .lte('created_at', yestEnd);

  // Today new customers
  const { count: newCustomersToday } = await sb()
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)
    .gte('created_at', todayStart)
    .lte('created_at', todayEnd);

  // Yesterday new customers
  const { count: newCustomersYesterday } = await sb()
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)
    .gte('created_at', yestStart)
    .lte('created_at', yestEnd);

  // Total products
  const { count: totalProducts } = await sb()
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)
    .eq('is_active', true);

  // Pending orders count
  const { count: pendingOrders } = await sb()
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)
    .eq('status', 'pending_payment');

  const todayRevenue = (todayOrders || [])
    .filter(o => !['cancelled', 'return_requested', 'returned'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const yestRevenue = (yestOrders || []).reduce((sum, o) => sum + Number(o.total_amount), 0);

  return {
    revenue_today: todayRevenue,
    revenue_yesterday: yestRevenue,
    orders_today: (todayOrders || []).length,
    orders_yesterday: (yestOrders || []).length,
    new_customers_today: newCustomersToday || 0,
    new_customers_yesterday: newCustomersYesterday || 0,
    total_products: totalProducts || 0,
    pending_orders: pendingOrders || 0,
  };
}

/**
 * Revenue per day for the last N days (default 7).
 */
export async function getRevenueLast7Days() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const start = `${dateStr}T00:00:00.000Z`;
    const end = `${dateStr}T23:59:59.999Z`;

    const { data } = await sb()
      .from('orders')
      .select('total_amount, status')
      .eq('is_deleted', false)
      .gte('created_at', start)
      .lte('created_at', end);

    const revenue = (data || [])
      .filter(o => !['cancelled', 'return_requested', 'returned'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    result.push({ date: dateStr, label, revenue });
  }
  return result;
}

/**
 * Recent 5 orders for dashboard widget.
 */
export async function getRecentOrders() {
  const { data, error } = await sb()
    .from('orders')
    .select('id, order_number, total_amount, status, created_at, shipping_name, payment_method')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    logger.error('admin.model.getRecentOrders:', error);
    return [];
  }
  return data || [];
}

// ============================================
// REPORTS
// ============================================

/**
 * Summary stats for a date range.
 * Returns current period + previous period (same duration) for comparison.
 */
export async function getReportSummary(fromDate: string, toDate: string) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const durationMs = to.getTime() - from.getTime();

  // Previous period
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo.getTime() - durationMs);

  const buildRange = (start: Date, end: Date) => ({
    start: `${start.toISOString().slice(0, 10)}T00:00:00.000Z`,
    end: `${end.toISOString().slice(0, 10)}T23:59:59.999Z`,
  });

  const curr = buildRange(from, to);
  const prev = buildRange(prevFrom, prevTo);

  // Current period orders
  const { data: currOrders } = await sb()
    .from('orders')
    .select('total_amount, payment_method, status')
    .eq('is_deleted', false)
    .gte('created_at', curr.start)
    .lte('created_at', curr.end);

  // Previous period orders
  const { data: prevOrders } = await sb()
    .from('orders')
    .select('total_amount, status')
    .eq('is_deleted', false)
    .gte('created_at', prev.start)
    .lte('created_at', prev.end);

  // Pending (all time, not date-filtered — same as dashboard)
  const { count: pendingOrders } = await sb()
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)
    .eq('status', 'pending_payment');

  const activeOrders = (currOrders || []).filter(o => !['cancelled', 'return_requested', 'returned'].includes(o.status));
  const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const prevActiveOrders = (prevOrders || []).filter(o => !['cancelled', 'return_requested', 'returned'].includes(o.status));
  const prevTotalRevenue = prevActiveOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const transferOrders = (currOrders || []).filter(o => o.payment_method === 'bank_transfer');
  const cashOrders = (currOrders || []).filter(o => o.payment_method === 'cod');

  const transferRevenue = transferOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const cashRevenue = cashOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const totalOrderCount = (currOrders || []).length;
  const prevOrderCount = (prevOrders || []).length;

  return {
    total_orders: totalOrderCount,
    prev_total_orders: prevOrderCount,
    transfer_orders: transferOrders.length,
    cash_orders: cashOrders.length,
    pending_orders: pendingOrders || 0,
    total_revenue: totalRevenue,
    prev_total_revenue: prevTotalRevenue,
    payment_orders_breakdown: [
      {
        method: 'bank_transfer',
        label: 'Chuyển khoản',
        count: transferOrders.length,
        percent: totalOrderCount > 0 ? Math.round((transferOrders.length / totalOrderCount) * 100) : 0,
      },
      {
        method: 'cod',
        label: 'Tiền mặt',
        count: cashOrders.length,
        percent: totalOrderCount > 0 ? Math.round((cashOrders.length / totalOrderCount) * 100) : 0,
      },
    ],
    payment_revenue_breakdown: [
      {
        method: 'bank_transfer',
        label: 'Chuyển khoản',
        revenue: transferRevenue,
        percent: totalRevenue > 0 ? Math.round((transferRevenue / totalRevenue) * 100) : 0,
      },
      {
        method: 'cod',
        label: 'Tiền mặt',
        revenue: cashRevenue,
        percent: totalRevenue > 0 ? Math.round((cashRevenue / totalRevenue) * 100) : 0,
      },
    ],
  };
}

/**
 * Orders count per day for date range.
 */
export async function getOrdersChart(fromDate: string, toDate: string) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const result = [];

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const start = `${dateStr}T00:00:00.000Z`;
    const end = `${dateStr}T23:59:59.999Z`;

    const { count } = await sb()
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .gte('created_at', start)
      .lte('created_at', end);

    const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    result.push({ date: dateStr, label, orders: count || 0 });
  }
  return result;
}

/**
 * Revenue per day for current and previous period.
 */
export async function getRevenueChart(fromDate: string, toDate: string) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const durationDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  const result = [];

  for (let i = 0; i <= durationDays; i++) {
    const currDay = new Date(from);
    currDay.setDate(currDay.getDate() + i);
    const prevDay = new Date(currDay);
    prevDay.setDate(prevDay.getDate() - (durationDays + 1));

    const currDate = currDay.toISOString().slice(0, 10);
    const prevDate = prevDay.toISOString().slice(0, 10);

    const getRevForDay = async (dateStr: string) => {
      const { data } = await sb()
        .from('orders')
        .select('total_amount, status')
        .eq('is_deleted', false)
        .gte('created_at', `${dateStr}T00:00:00.000Z`)
        .lte('created_at', `${dateStr}T23:59:59.999Z`);
      return (data || [])
        .filter(o => !['cancelled', 'returned'].includes(o.status))
        .reduce((sum, o) => sum + Number(o.total_amount), 0);
    };

    const [currRev, prevRev] = await Promise.all([
      getRevForDay(currDate),
      getRevForDay(prevDate),
    ]);

    const label = `${String(currDay.getDate()).padStart(2, '0')}/${String(currDay.getMonth() + 1).padStart(2, '0')}`;
    result.push({ date: currDate, label, current: currRev, prev: prevRev });
  }
  return result;
}

/**
 * Top customers by total spent in date range.
 */
export async function getTopCustomers(fromDate: string, toDate: string, limit = 5) {
  const { data, error } = await sb()
    .from('orders')
    .select('user_id, total_amount, status')
    .eq('is_deleted', false)
    .gte('created_at', `${fromDate}T00:00:00.000Z`)
    .lte('created_at', `${toDate}T23:59:59.999Z`);

  if (error || !data) return [];

  // Aggregate by user_id in JS
  const customerMap: Record<string, { orders: number; total: number }> = {};
  for (const o of data) {
    if (['cancelled', 'returned'].includes(o.status)) continue;
    if (!customerMap[o.user_id]) {
      customerMap[o.user_id] = { orders: 0, total: 0 };
    }
    customerMap[o.user_id].orders += 1;
    customerMap[o.user_id].total += Number(o.total_amount);
  }

  const sorted = Object.entries(customerMap)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, limit);

  if (sorted.length === 0) return [];

  const userIds = sorted.map(([id]) => id);
  const { data: users } = await sb()
    .from('users')
    .select('id, full_name, email, avatar_url')
    .in('id', userIds);

  const userMap: Record<string, any> = {};
  for (const u of (users || [])) {
    userMap[u.id] = u;
  }

  return sorted.map(([userId, stats]) => ({
    id: userId,
    full_name: userMap[userId]?.full_name || 'Unknown',
    email: userMap[userId]?.email || '',
    avatar_url: userMap[userId]?.avatar_url || null,
    orders: stats.orders,
    total_spent: stats.total,
  }));
}

/**
 * Top products by sales count in date range.
 * Two-step query: fetch valid order IDs first, then aggregate order_items.
 * (Supabase JS SDK does not support .gte/.lte filters on related table columns.)
 */
export async function getTopProducts(fromDate: string, toDate: string, limit = 5) {
  const { data: orders, error: ordersError } = await sb()
    .from('orders')
    .select('id')
    .eq('is_deleted', false)
    .not('status', 'in', '("cancelled","returned","return_requested")')
    .gte('created_at', `${fromDate}T00:00:00.000Z`)
    .lte('created_at', `${toDate}T23:59:59.999Z`);

  if (ordersError || !orders || orders.length === 0) return [];

  const orderIds = orders.map((o: any) => o.id);

  const { data: items, error } = await sb()
    .from('order_items')
    .select('quantity, total_price, product_name')
    .in('order_id', orderIds);

  if (error || !items) return [];

  const productMap: Record<string, { sales: number; revenue: number }> = {};
  for (const item of items) {
    const key = item.product_name;
    if (!productMap[key]) productMap[key] = { sales: 0, revenue: 0 };
    productMap[key].sales += item.quantity;
    productMap[key].revenue += Number(item.total_price);
  }

  const sorted = Object.entries(productMap)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);

  const totalSales = sorted.reduce((sum, p) => sum + p.sales, 0);

  return sorted.map(p => ({
    name: p.name,
    sales: p.sales,
    revenue: p.revenue,
    ratio: totalSales > 0 ? Math.round((p.sales / totalSales) * 100) : 0,
  }));
}

// ============================================
// ADMIN CUSTOMERS
// ============================================

export async function findCustomers(filters: {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  sort_by: string;
  sort_dir: string;
}): Promise<{ data: any[]; total: number }> {
  let query = sb()
    .from('users')
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, last_login_at, created_at', { count: 'exact' })
    .eq('is_deleted', false);

  if (filters.search) {
    const s = filters.search;
    query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`);
  }

  if (filters.role) {
    query = query.eq('role', filters.role);
  }

  if (filters.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  // Sort
  const ascending = filters.sort_dir === 'asc';
  if (filters.sort_by === 'created_at') {
    query = query.order('created_at', { ascending });
  } else {
    query = query.order('created_at', { ascending: false }); // fallback
  }

  const from = (filters.page - 1) * filters.limit;
  const to = from + filters.limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    logger.error('admin.model.findCustomers error:', error);
    throw new Error(error.message);
  }

  return { data: data || [], total: count || 0 };
}

export async function findCustomerById(id: string) {
  const { data: user, error } = await sb()
    .from('users')
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, last_login_at, created_at')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  // Fetch order summary for this customer
  const { data: orders, count: orderCount } = await sb()
    .from('orders')
    .select('total_amount, status, created_at, order_number', { count: 'exact' })
    .eq('user_id', id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(5);

  const totalSpent = (orders || [])
    .filter(o => !['cancelled', 'returned'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return {
    ...user,
    order_count: orderCount || 0,
    total_spent: totalSpent,
    recent_orders: orders || [],
  };
}

export async function updateCustomer(
  id: string,
  data: { full_name?: string; phone?: string | null; is_active?: boolean; role?: string }
) {
  const { data: updated, error } = await sb()
    .from('users')
    .update(data)
    .eq('id', id)
    .eq('is_deleted', false)
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, created_at')
    .single();

  if (error) throw new Error(error.message);
  return updated;
}

export async function softDeleteCustomer(id: string) {
  const { error } = await sb()
    .from('users')
    .update({ is_deleted: true, is_active: false })
    .eq('id', id);

  if (error) throw new Error(error.message);
}
