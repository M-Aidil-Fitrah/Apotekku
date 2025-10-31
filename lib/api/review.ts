import { apiClient } from './client';

export interface Review {
  _id: string;
  productId: string;
  customerId: {
    _id: string;
    name: string;
  };
  orderId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: Date;
  };
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  orderId?: string;
}

// Get reviews for a product
export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10
): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ReviewsResponse>(
    `/api/reviews/product/${productId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Create review
export const createReview = async (reviewData: CreateReviewData): Promise<ReviewResponse> => {
  const response = await apiClient.post<ReviewResponse>('/api/reviews', reviewData);
  return response.data;
};

// Mark review as helpful
export const markReviewHelpful = async (reviewId: string): Promise<ReviewResponse> => {
  const response = await apiClient.post<ReviewResponse>(`/api/reviews/${reviewId}/helpful`);
  return response.data;
};

// Mark review as not helpful
export const markReviewNotHelpful = async (reviewId: string): Promise<ReviewResponse> => {
  const response = await apiClient.post<ReviewResponse>(`/api/reviews/${reviewId}/not-helpful`);
  return response.data;
};
