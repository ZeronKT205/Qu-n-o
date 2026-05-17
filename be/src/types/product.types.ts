import { ProductBadge, ProductSize } from './enums';

// ============================================
// PRODUCT TYPES
// ============================================

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: ProductSize;
  color_name: string;
  color_hex: string;
  sku: string;
  stock_quantity: number;
  additional_price: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  sale_price: number | null;
  discount_percent: number | null;
  badge: ProductBadge | null;
  sold_count: number;
  avg_rating: number;
  review_count: number;
  sku_prefix: string | null;
  material: string | null;
  care_instructions: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// DTO for creating a new product
export interface CreateProductDTO {
  category_id: string;
  name: string;
  slug?: string;           // Auto-generated if not provided
  description?: string;
  base_price: number;
  sale_price?: number;
  discount_percent?: number;
  badge?: ProductBadge;
  sku_prefix?: string;
  material?: string;
  care_instructions?: string;
  is_featured?: boolean;
  images?: {
    image_url: string;
    alt_text?: string;
    sort_order?: number;
    is_primary?: boolean;
  }[];
  variants?: {
    size: ProductSize;
    color_name: string;
    color_hex?: string;
    sku: string;
    stock_quantity: number;
    additional_price?: number;
  }[];
}

// DTO for updating a product (all fields optional)
export type UpdateProductDTO = Partial<Omit<CreateProductDTO, 'images' | 'variants'>>;
