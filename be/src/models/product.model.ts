import { getSupabase } from '../config/supabase';
import { Product, ProductDetail } from '../types/product.types';
import { ProductQueryInput, CreateProductInput } from '../validators/product.validator';
import { logger } from '../utils/logger';

const supabase = () => getSupabase();

// ============================================
// FIND ALL — with filter, sort, pagination
// ============================================
export async function findAll(
  filters: ProductQueryInput
): Promise<{ data: Product[]; total: number }> {
  const { page, limit, category, badge, min_price, max_price, sort, search, featured } = filters;

  let query = supabase()
    .from('products')
    .select(
      `
      *,
      categories!inner(id, name, slug),
      product_images(id, image_url, alt_text, sort_order, is_primary)
    `,
      { count: 'exact' }
    )
    .eq('is_deleted', false)
    .eq('is_active', true);

  // ── Filters ──────────────────────────────
  if (category) {
    query = query.eq('categories.slug', category);
  }
  if (badge) {
    query = query.eq('badge', badge);
  }
  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }
  if (min_price !== undefined) {
    query = query.gte('base_price', min_price);
  }
  if (max_price !== undefined) {
    query = query.lte('base_price', max_price);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // ── Sorting ──────────────────────────────
  switch (sort) {
    case 'price_asc':
      query = query.order('base_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('base_price', { ascending: false });
      break;
    case 'bestseller':
      query = query.order('sold_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  // ── Pagination ───────────────────────────
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    logger.error('product.model.findAll error:', error);
    throw new Error(error.message);
  }

  return { data: (data as Product[]) || [], total: count || 0 };
}

// ============================================
// FIND BY SLUG — with images + variants
// ============================================
export async function findBySlug(slug: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase()
    .from('products')
    .select(
      `
      *,
      categories(id, name, slug),
      product_images(id, image_url, alt_text, sort_order, is_primary),
      product_variants(id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active)
    `
    )
    .eq('slug', slug)
    .eq('is_deleted', false)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    logger.error('product.model.findBySlug error:', error);
    throw new Error(error.message);
  }

  return data as ProductDetail;
}

// ============================================
// FIND BY ID — for update/delete operations
// ============================================
export async function findById(id: string): Promise<Product | null> {
  const { data, error } = await supabase()
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Product;
}

// ============================================
// FIND BY SLUG (raw) — for slug uniqueness check
// ============================================
export async function findBySlugRaw(slug: string): Promise<{ id: string } | null> {
  const { data } = await supabase()
    .from('products')
    .select('id')
    .eq('slug', slug)
    .eq('is_deleted', false)
    .maybeSingle();

  return data;
}

// ============================================
// CREATE — insert product + images + variants
// ============================================
export async function create(input: CreateProductInput & { slug: string }): Promise<Product> {
  const { images, variants, ...productData } = input;

  // 1. Insert product
  const { data: product, error: productError } = await supabase()
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (productError) {
    logger.error('product.model.create product error:', productError);
    throw new Error(productError.message);
  }

  const productId = (product as Product).id;

  // 2. Insert images (if provided)
  if (images && images.length > 0) {
    const imageRows = images.map((img, idx) => ({
      product_id: productId,
      image_url: img.image_url,
      alt_text: img.alt_text ?? null,
      sort_order: img.sort_order ?? idx,
      is_primary: img.is_primary ?? idx === 0,
    }));

    const { error: imgError } = await supabase().from('product_images').insert(imageRows);
    if (imgError) {
      logger.error('product.model.create images error:', imgError);
      // Don't throw — product was created, log and continue
    }
  }

  // 3. Insert variants (if provided)
  if (variants && variants.length > 0) {
    const variantRows = variants.map((v) => ({
      product_id: productId,
      size: v.size,
      color_name: v.color_name,
      color_hex: v.color_hex ?? '#000000',
      sku: v.sku,
      stock_quantity: v.stock_quantity ?? 0,
      additional_price: v.additional_price ?? 0,
    }));

    const { error: varError } = await supabase().from('product_variants').insert(variantRows);
    if (varError) {
      logger.error('product.model.create variants error:', varError);
    }
  }

  return product as Product;
}

// ============================================
// UPDATE — partial update by ID
// ============================================
export async function update(
  id: string,
  data: Partial<Omit<CreateProductInput, 'images' | 'variants'>>
): Promise<Product> {
  const { data: updated, error } = await supabase()
    .from('products')
    .update(data)
    .eq('id', id)
    .eq('is_deleted', false)
    .select()
    .single();

  if (error) {
    logger.error('product.model.update error:', error);
    throw new Error(error.message);
  }

  return updated as Product;
}

// ============================================
// SOFT DELETE — set is_deleted = true
// ============================================
export async function softDelete(id: string): Promise<void> {
  const { error } = await supabase()
    .from('products')
    .update({ is_deleted: true, is_active: false })
    .eq('id', id);

  if (error) {
    logger.error('product.model.softDelete error:', error);
    throw new Error(error.message);
  }
}
