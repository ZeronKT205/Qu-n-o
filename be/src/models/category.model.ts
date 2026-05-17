import { getSupabase } from '../config/supabase';
import { Category } from '../types/category.types';
import { CategoryQueryInput, CreateCategoryInput } from '../validators/category.validator';
import { logger } from '../utils/logger';

const supabase = () => getSupabase();

export async function findAll(filters: CategoryQueryInput): Promise<Category[]> {
  let query = supabase()
    .from('categories')
    .select('*')
    .eq('is_deleted', false)
    .order('sort_order', { ascending: true });

  if (filters.activeOnly) {
    query = query.eq('is_active', true);
  }
  
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    logger.error('category.model.findAll error:', error);
    throw new Error(error.message);
  }

  return (data as Category[]) || [];
}

export async function findById(id: string): Promise<Category | null> {
  const { data, error } = await supabase()
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Category;
}

export async function findBySlugRaw(slug: string): Promise<{ id: string } | null> {
  const { data } = await supabase()
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .eq('is_deleted', false)
    .maybeSingle();

  return data;
}

export async function create(input: CreateCategoryInput & { slug: string }): Promise<Category> {
  const { data, error } = await supabase()
    .from('categories')
    .insert(input)
    .select()
    .single();

  if (error) {
    logger.error('category.model.create error:', error);
    throw new Error(error.message);
  }

  return data as Category;
}

export async function update(id: string, input: Partial<CreateCategoryInput>): Promise<Category> {
  const { data, error } = await supabase()
    .from('categories')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('category.model.update error:', error);
    throw new Error(error.message);
  }

  return data as Category;
}

export async function softDelete(id: string): Promise<void> {
  const { error } = await supabase()
    .from('categories')
    .update({ is_deleted: true, is_active: false })
    .eq('id', id);

  if (error) {
    logger.error('category.model.softDelete error:', error);
    throw new Error(error.message);
  }
}
