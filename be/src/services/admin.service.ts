import * as AdminModel from '../models/admin.model';
import { ApiError } from '../utils/ApiError';
import { DateRangeInput, AdminCustomerQueryInput, UpdateCustomerInput } from '../validators/admin.validator';

// Default date range: last 7 days
function getDefaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export async function getDashboard() {
  const [stats, revenue7days, recentOrders] = await Promise.all([
    AdminModel.getDashboardStats(),
    AdminModel.getRevenueLast7Days(),
    AdminModel.getRecentOrders(),
  ]);

  return {
    ...stats,
    revenue_last_7days: revenue7days,
    recent_orders: recentOrders,
  };
}

export async function getReports(input: DateRangeInput) {
  const { from, to } = {
    from: input.from_date || getDefaultRange().from,
    to: input.to_date || getDefaultRange().to,
  };

  const [summary, ordersChart, revenueChart, topCustomers, topProducts] = await Promise.all([
    AdminModel.getReportSummary(from, to),
    AdminModel.getOrdersChart(from, to),
    AdminModel.getRevenueChart(from, to),
    AdminModel.getTopCustomers(from, to, 5),
    AdminModel.getTopProducts(from, to, 5),
  ]);

  return {
    date_range: { from, to },
    summary,
    orders_chart: ordersChart,
    revenue_chart: revenueChart,
    top_customers: topCustomers,
    top_products: topProducts,
  };
}

export async function getCustomers(filters: AdminCustomerQueryInput) {
  return AdminModel.findCustomers(filters);
}

export async function getCustomerById(id: string) {
  const customer = await AdminModel.findCustomerById(id);
  if (!customer) throw ApiError.notFound(`Không tìm thấy khách hàng với ID: ${id}`);
  return customer;
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const existing = await AdminModel.findCustomerById(id);
  if (!existing) throw ApiError.notFound(`Không tìm thấy khách hàng với ID: ${id}`);

  // Prevent downgrading super_admin (cast to string for type-safe comparison)
  if (existing.role === 'super_admin' && input.role && (input.role as string) !== 'super_admin') {
    throw ApiError.forbidden('Không thể thay đổi quyền của Super Admin');
  }

  return AdminModel.updateCustomer(id, input);
}

export async function deleteCustomer(id: string) {
  const existing = await AdminModel.findCustomerById(id);
  if (!existing) throw ApiError.notFound(`Không tìm thấy khách hàng với ID: ${id}`);

  if (existing.role === 'super_admin') {
    throw ApiError.forbidden('Không thể xóa tài khoản Super Admin');
  }

  await AdminModel.softDeleteCustomer(id);
}
