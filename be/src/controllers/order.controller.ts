import { Request, Response } from 'express';
import * as OrderService from '../services/order.service';
import { ResponseHelper } from '../utils/ApiResponse';
import { OrderQueryInput, CreateOrderInput, UpdateOrderStatusInput } from '../validators/order.validator';

export async function list(req: Request, res: Response): Promise<void> {
  const filters = req.query as unknown as OrderQueryInput;
  const { data, total } = await OrderService.getOrders(filters);

  ResponseHelper.paginated(res, data, {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    total,
  }, 'Lấy danh sách đơn hàng thành công');
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const order = await OrderService.getOrderById(id);

  ResponseHelper.success(res, order, 'Lấy chi tiết đơn hàng thành công');
}

export async function getByNumber(req: Request, res: Response): Promise<void> {
  const orderNumber = req.params['orderNumber'] as string;
  const order = await OrderService.getOrderByNumber(orderNumber);

  ResponseHelper.success(res, order, 'Lấy chi tiết đơn hàng thành công');
}

export async function create(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateOrderInput;
  const order = await OrderService.createOrder(input);

  ResponseHelper.created(res, order, 'Tạo đơn hàng thành công');
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const input = req.body as UpdateOrderStatusInput;
  const adminUserId = req.user?.sub;
  const order = await OrderService.updateOrderStatus(id, input, adminUserId);

  ResponseHelper.success(res, order, 'Cập nhật trạng thái đơn hàng thành công');
}
