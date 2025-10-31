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

// Create category with image upload (Admin only)
export const createCategory = async (formData: FormData): Promise<CategoryResponse> => {
  const response = await apiClient.post<CategoryResponse>('/api/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update category with image upload (Admin only)
export const updateCategory = async (id: string, formData: FormData): Promise<CategoryResponse> => {
  const response = await apiClient.put<CategoryResponse>(`/api/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete category (Admin only)
export const deleteCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/api/categories/${id}`);
  return response.data;
};
