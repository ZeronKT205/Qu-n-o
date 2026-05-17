import * as CategoryModel from '../models/category.model';
import { ApiError } from '../utils/ApiError';
import { slugify, uniqueSlug } from '../utils/slugify';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryInput,
} from '../validators/category.validator';
import { Category } from '../types/category.types';

export async function getCategories(filters: CategoryQueryInput): Promise<Category[]> {
  return CategoryModel.findAll(filters);
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  let slug = input.slug ?? slugify(input.name);

  const existing = await CategoryModel.findBySlugRaw(slug);
  if (existing) {
    slug = uniqueSlug(input.name);
  }

  return CategoryModel.create({ ...input, slug });
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const existing = await CategoryModel.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Không tìm thấy danh mục với ID: "${id}"`);
  }

  let updateData = { ...input };
  if (input.name && !input.slug) {
    const newSlug = slugify(input.name);
    const conflicting = await CategoryModel.findBySlugRaw(newSlug);
    if (!conflicting || conflicting.id === id) {
      updateData.slug = newSlug;
    }
  }

  return CategoryModel.update(id, updateData);
}

export async function deleteCategory(id: string): Promise<void> {
  const existing = await CategoryModel.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Không tìm thấy danh mục với ID: "${id}"`);
  }

  await CategoryModel.softDelete(id);
}
