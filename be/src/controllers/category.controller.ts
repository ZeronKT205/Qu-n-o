import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';
import { ResponseHelper } from '../utils/ApiResponse';
import { CategoryQueryInput, CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export async function list(req: Request, res: Response): Promise<void> {
  const filters = req.query as unknown as CategoryQueryInput;
  const categories = await CategoryService.getCategories(filters);

  ResponseHelper.success(res, categories, 'Lấy danh sách danh mục thành công');
}

export async function create(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateCategoryInput;
  const category = await CategoryService.createCategory(input);

  ResponseHelper.created(res, category, 'Tạo danh mục thành công');
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const input = req.body as UpdateCategoryInput;
  const category = await CategoryService.updateCategory(id, input);

  ResponseHelper.success(res, category, 'Cập nhật danh mục thành công');
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  await CategoryService.deleteCategory(id);

  ResponseHelper.success(res, null, 'Xóa danh mục thành công');
}
