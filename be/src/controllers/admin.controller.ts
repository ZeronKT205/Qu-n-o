import { Request, Response } from 'express';
import * as AdminService from '../services/admin.service';
import { ResponseHelper } from '../utils/ApiResponse';
import { DateRangeInput, AdminCustomerQueryInput, UpdateCustomerInput } from '../validators/admin.validator';

// GET /api/v1/admin/dashboard
export async function dashboard(req: Request, res: Response): Promise<void> {
  const data = await AdminService.getDashboard();
  ResponseHelper.success(res, data, 'Lấy dữ liệu tổng quan thành công');
}

// GET /api/v1/admin/reports
export async function reports(req: Request, res: Response): Promise<void> {
  const input = req.query as unknown as DateRangeInput;
  const data = await AdminService.getReports(input);
  ResponseHelper.success(res, data, 'Lấy báo cáo thành công');
}

// GET /api/v1/admin/customers
export async function listCustomers(req: Request, res: Response): Promise<void> {
  const filters = req.query as unknown as AdminCustomerQueryInput;
  const { data, total } = await AdminService.getCustomers(filters);
  ResponseHelper.paginated(res, data, {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    total,
  }, 'Lấy danh sách khách hàng thành công');
}

// GET /api/v1/admin/customers/:id
export async function getCustomer(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const customer = await AdminService.getCustomerById(id);
  ResponseHelper.success(res, customer, 'Lấy thông tin khách hàng thành công');
}

// PATCH /api/v1/admin/customers/:id
export async function updateCustomer(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const input = req.body as UpdateCustomerInput;
  const customer = await AdminService.updateCustomer(id, input);
  ResponseHelper.success(res, customer, 'Cập nhật khách hàng thành công');
}

// DELETE /api/v1/admin/customers/:id
export async function deleteCustomer(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  await AdminService.deleteCustomer(id);
  ResponseHelper.noContent(res);
}
