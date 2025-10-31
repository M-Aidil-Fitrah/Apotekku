import { apiClient } from './client';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

// Get all categories
export const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await apiClient.get<CategoriesResponse>('/api/categories');
  return response.data;
};

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<CategoryResponse> => {
  const response = await apiClient.get<CategoryResponse>(`/api/categories/${slug}`);
  return response.data;
};
