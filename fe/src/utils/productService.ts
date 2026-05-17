const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ApiProductVariant {
  id: string;
  size: string;
  color_name: string;
  color_hex: string;
  sku: string;
  stock_quantity: number;
  additional_price: number;
  is_active: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  discount_percent: number | null;
  badge: string | null;
  sold_count: number;
  avg_rating: number;
  review_count: number;
  material: string | null;
  description: string | null;
  is_featured: boolean;
  categories: { id: string; name: string; slug: string } | null;
  product_images: ApiProductImage[];
}

export interface ApiProductDetail extends ApiProduct {
  product_variants: ApiProductVariant[];
}

export async function fetchProducts(params?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ApiProduct[]; total: number }> {
  try {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    qs.set('page', String(params?.page ?? 1));
    qs.set('limit', String(params?.limit ?? 50));

    const res = await fetch(`${API_BASE}/products?${qs.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { data: [], total: 0 };
    const json = await res.json();
    return { data: json.data || [], total: json.pagination?.total || 0 };
  } catch {
    return { data: [], total: 0 };
  }
}

export async function fetchProductBySlug(slug: string): Promise<ApiProductDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export function mapApiProduct(p: ApiProduct): import('@/types').Product {
  const primaryImage =
    p.product_images?.find(img => img.is_primary)?.image_url ||
    p.product_images?.[0]?.image_url ||
    '/images/products/product-1.png';

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.sale_price ?? p.base_price,
    originalPrice: p.sale_price ? p.base_price : undefined,
    image: primaryImage,
    badge: (p.badge === 'sale' || p.badge === 'new' || p.badge === 'hot' || p.badge === 'bestseller')
      ? (p.badge as any)
      : undefined,
    discountPercent: p.discount_percent ?? undefined,
    category: p.categories?.slug ?? '',
    description: p.description ?? '',
    soldCount: p.sold_count,
  };
}
