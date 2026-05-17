// ============================================
// COMMON TYPES — Shared across all modules
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductQueryFilters {
  page?: number;
  limit?: number;
  category?: string;       // category slug
  badge?: string;          // new | sale | hot | bestseller
  min_price?: number;
  max_price?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller';
  search?: string;
  featured?: boolean;
}
