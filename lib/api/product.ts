import { apiClient } from './client';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  mainImage: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  manufacturer?: string;
  expiryDate?: Date;
  requiresPrescription: boolean;
  dosageForm?: string;
  strength?: string;
  packageSize?: string;
  activeIngredients?: string[];
  sideEffects?: string[];
  usageInstructions?: string;
  warnings?: string;
  storageInstructions?: string;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  requiresPrescription?: boolean;
  tags?: string[];
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

// Get all products with filters
export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }

  const response = await apiClient.get<ProductsResponse>(
    `/api/products?${params.toString()}`
  );
  return response.data;
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<ProductResponse> => {
  const response = await apiClient.get<ProductResponse>(`/api/products/${slug}`);
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async (): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/api/products/featured');
  return response.data;
};

// Get best sellers
export const getBestSellers = async (): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/api/products/best-sellers');
  return response.data;
};

// Get new arrivals
export const getNewArrivals = async (): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/api/products/new-arrivals');
  return response.data;
};
