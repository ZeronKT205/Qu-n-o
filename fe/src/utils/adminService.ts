// ============================================
// ADMIN API SERVICE
// Kết nối tới backend /api/v1/admin/* và /api/v1/orders
// ============================================

import { tokenStorage } from './authService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const json = await res.json();

  if (!res.ok) {
    const detail = json.errors?.[0]?.message;
    throw new Error(detail || json.message || 'Có lỗi xảy ra');
  }

  return json as T;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RevenuePoint {
  date: string;
  label: string;
  revenue: number;
}

export interface DashboardRecentOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_name: string;
  payment_method: string;
}

export interface DashboardData {
  revenue_today: number;
  revenue_yesterday: number;
  orders_today: number;
  orders_yesterday: number;
  new_customers_today: number;
  new_customers_yesterday: number;
  total_products: number;
  pending_orders: number;
  revenue_last_7days: RevenuePoint[];
  recent_orders: DashboardRecentOrder[];
}

export interface PaymentBreakdown {
  method: string;
  label: string;
  count: number;
  percent: number;
}

export interface PaymentRevenueBreakdown {
  method: string;
  label: string;
  revenue: number;
  percent: number;
}

export interface ReportSummary {
  total_orders: number;
  prev_total_orders: number;
  transfer_orders: number;
  cash_orders: number;
  pending_orders: number;
  total_revenue: number;
  prev_total_revenue: number;
  payment_orders_breakdown: PaymentBreakdown[];
  payment_revenue_breakdown: PaymentRevenueBreakdown[];
}

export interface OrderChartPoint {
  date: string;
  label: string;
  orders: number;
}

export interface RevenueChartPoint {
  date: string;
  label: string;
  current: number;
  prev: number;
}

export interface TopCustomer {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  orders: number;
  total_spent: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  ratio: number;
}

export interface ReportsData {
  date_range: { from: string; to: string };
  summary: ReportSummary;
  orders_chart: OrderChartPoint[];
  revenue_chart: RevenueChartPoint[];
  top_customers: TopCustomer[];
  top_products: TopProduct[];
}

export interface AdminOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
}

export interface OrdersResponse {
  success: boolean;
  data: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AdminCustomer {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface AdminCustomerDetail extends AdminCustomer {
  order_count: number;
  total_spent: number;
  recent_orders: Array<{
    total_amount: number;
    status: string;
    created_at: string;
    order_number: string;
  }>;
}

export interface CustomersResponse {
  success: boolean;
  data: AdminCustomer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ── API Calls ─────────────────────────────────────────────────────────────────

export async function apiGetDashboard(): Promise<DashboardData> {
  const res = await adminRequest<{ data: DashboardData }>('/admin/dashboard');
  return res.data;
}

export async function apiGetReports(fromDate?: string, toDate?: string): Promise<ReportsData> {
  const params = new URLSearchParams();
  if (fromDate) params.set('from_date', fromDate);
  if (toDate) params.set('to_date', toDate);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await adminRequest<{ data: ReportsData }>(`/admin/reports${qs}`);
  return res.data;
}

export async function apiGetOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  payment_method?: string;
  sort_by?: string;
  sort_dir?: string;
}): Promise<OrdersResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  if (params.payment_method) qs.set('payment_method', params.payment_method);
  if (params.sort_by) qs.set('sort_by', params.sort_by);
  if (params.sort_dir) qs.set('sort_dir', params.sort_dir);
  return adminRequest<OrdersResponse>(`/orders?${qs.toString()}`);
}

export async function apiUpdateOrderStatus(id: string, status: string): Promise<void> {
  await adminRequest<void>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiGetCustomers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_dir?: string;
}): Promise<CustomersResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  if (params.role) qs.set('role', params.role);
  if (params.is_active !== undefined) qs.set('is_active', String(params.is_active));
  if (params.sort_by) qs.set('sort_by', params.sort_by);
  if (params.sort_dir) qs.set('sort_dir', params.sort_dir);
  return adminRequest<CustomersResponse>(`/admin/customers?${qs.toString()}`);
}

export async function apiGetCustomerDetail(id: string): Promise<AdminCustomerDetail> {
  const res = await adminRequest<{ data: AdminCustomerDetail }>(`/admin/customers/${id}`);
  return res.data;
}

export async function apiUpdateAdminCustomer(
  id: string,
  data: { full_name?: string; phone?: string | null; is_active?: boolean; role?: string }
): Promise<AdminCustomer> {
  const res = await adminRequest<{ data: AdminCustomer }>(`/admin/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiDeleteAdminCustomer(id: string): Promise<void> {
  await adminRequest<void>(`/admin/customers/${id}`, { method: 'DELETE' });
}

// ── Formatters ─────────────────────────────────────────────────────────────────

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function formatPercent(current: number, previous: number): { value: string; type: 'up' | 'down' | 'neutral' } {
  if (previous === 0) {
    return current > 0 ? { value: '↑ Mới', type: 'up' } : { value: '— Không đổi', type: 'neutral' };
  }
  const pct = ((current - previous) / previous) * 100;
  if (pct > 0) return { value: `↑ ${pct.toFixed(1)}% so với hôm qua`, type: 'up' };
  if (pct < 0) return { value: `↓ ${Math.abs(pct).toFixed(1)}% so với hôm qua`, type: 'down' };
  return { value: '— Không đổi', type: 'neutral' };
}

export function formatReportPercent(current: number, previous: number): { value: string; type: 'up' | 'down' | 'neutral' } {
  if (previous === 0) {
    return current > 0 ? { value: '↑ Mới', type: 'up' } : { value: '— Không đổi', type: 'neutral' };
  }
  const pct = ((current - previous) / previous) * 100;
  if (pct > 0) return { value: `↑ ${pct.toFixed(0)}%`, type: 'up' };
  if (pct < 0) return { value: `↓ ${Math.abs(pct).toFixed(0)}%`, type: 'down' };
  return { value: '— Không đổi', type: 'neutral' };
}

const ORDER_STATUS_MAP: Record<string, { label: string; style: string }> = {
  pending_payment: { label: 'Chờ thanh toán', style: 'pending_payment' },
  confirmed:       { label: 'Đã xác nhận',    style: 'confirmed' },
  processing:      { label: 'Đang xử lý',     style: 'processing' },
  shipping:        { label: 'Đang giao hàng', style: 'shipping' },
  delivered:       { label: 'Đã giao hàng',   style: 'delivered' },
  completed:       { label: 'Hoàn thành',     style: 'completed' },
  cancelled:       { label: 'Đã hủy',         style: 'cancelled' },
  return_requested:{ label: 'Yêu cầu hoàn',  style: 'return_requested' },
  returned:        { label: 'Đã hoàn hàng',  style: 'returned' },
};

export function getOrderStatus(status: string) {
  return ORDER_STATUS_MAP[status] ?? { label: status, style: 'pending' };
}

const PAYMENT_METHOD_MAP: Record<string, string> = {
  bank_transfer: 'Chuyển khoản',
  cod: 'Tiền mặt',
  vnpay: 'VNPay',
  momo: 'MoMo',
};

export function getPaymentMethod(method: string): string {
  return PAYMENT_METHOD_MAP[method] ?? method;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
