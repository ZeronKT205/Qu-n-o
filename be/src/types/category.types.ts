export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  icon_url?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
