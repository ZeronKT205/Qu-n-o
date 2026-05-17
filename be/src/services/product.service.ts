import * as ProductModel from '../models/product.model';
import { ApiError } from '../utils/ApiError';
import { slugify, uniqueSlug } from '../utils/slugify';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryInput,
} from '../validators/product.validator';
import { Product, ProductDetail } from '../types/product.types';

// ============================================
// GET LIST — with filter, sort, pagination
// ============================================
export async function getProducts(
  filters: ProductQueryInput
): Promise<{ data: Product[]; total: number }> {
  return ProductModel.findAll(filters);
}

// ============================================
// GET DETAIL BY SLUG
// ============================================
export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const product = await ProductModel.findBySlug(slug);

  if (!product) {
    throw ApiError.notFound(`Không tìm thấy sản phẩm với slug: "${slug}"`);
  }

  return product;
}

// ============================================
// CREATE PRODUCT
// ============================================
export async function createProduct(input: CreateProductInput): Promise<Product> {
  // 1. Generate slug from name if not provided
  let slug = input.slug ?? slugify(input.name);

  // 2. Ensure slug is unique
  const existing = await ProductModel.findBySlugRaw(slug);
  if (existing) {
    slug = uniqueSlug(input.name); // Append timestamp to avoid conflict
  }

  // 3. Create
  const product = await ProductModel.create({ ...input, slug });
  return product;
}

// ============================================
// UPDATE PRODUCT
// ============================================
export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  // 1. Verify product exists
  const existing = await ProductModel.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Không tìm thấy sản phẩm với ID: "${id}"`);
  }

  // 2. If name changes, regenerate slug (unless slug explicitly provided)
  let updateData = { ...input };
  if (input.name && !input.slug) {
    const newSlug = slugify(input.name);
    const conflicting = await ProductModel.findBySlugRaw(newSlug);
    // Only update slug if there's no conflict or it's the same product
    if (!conflicting || conflicting.id === id) {
      updateData.slug = newSlug;
    }
  }

  return ProductModel.update(id, updateData);
}

// ============================================
// DELETE PRODUCT (soft)
// ============================================
export async function deleteProduct(id: string): Promise<void> {
  const existing = await ProductModel.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Không tìm thấy sản phẩm với ID: "${id}"`);
  }

  await ProductModel.softDelete(id);
}
