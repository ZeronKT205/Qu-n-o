import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';
import { ResponseHelper } from '../utils/ApiResponse';
import { ProductQueryInput, CreateProductInput, UpdateProductInput } from '../validators/product.validator';

// ============================================
// GET /products — List with filters & pagination
// ============================================
export async function list(req: Request, res: Response): Promise<void> {
  const filters = req.query as unknown as ProductQueryInput;
  const { data, total } = await ProductService.getProducts(filters);

  ResponseHelper.paginated(res, data, {
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
    total,
  }, 'Lấy danh sách sản phẩm thành công');
}

// ============================================
// GET /products/:slug — Get single product detail
// ============================================
export async function getBySlug(req: Request, res: Response): Promise<void> {
  const slug = req.params['slug'] as string;
  const product = await ProductService.getProductBySlug(slug);

  ResponseHelper.success(res, product, 'Lấy thông tin sản phẩm thành công');
}

// ============================================
// POST /products — Create new product
// ============================================
export async function create(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateProductInput;
  const product = await ProductService.createProduct(input);

  ResponseHelper.created(res, product, 'Tạo sản phẩm thành công');
}

// ============================================
// PUT /products/:id — Update product
// ============================================
export async function update(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const input = req.body as UpdateProductInput;
  const product = await ProductService.updateProduct(id, input);

  ResponseHelper.success(res, product, 'Cập nhật sản phẩm thành công');
}

// ============================================
// DELETE /products/:id — Soft delete product
// ============================================
export async function remove(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  await ProductService.deleteProduct(id);

  ResponseHelper.success(res, null, 'Xóa sản phẩm thành công');
}
