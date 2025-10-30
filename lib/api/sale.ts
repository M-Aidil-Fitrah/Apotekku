import apiClient from './client';
import { Sale, ApiResponse, PaginatedResponse, PaymentMethod } from '../types';

export interface CreateSaleData {
  items: {
    medicineId: string;
    qty: number;
  }[];
  discount?: number;
  tax?: number;
  paymentMethod: PaymentMethod;
  prescriptionId?: string;
  notes?: string;
}

export interface SaleQueryParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const saleService = {
  /**
   * Create new sale (POS transaction)
   */
  async create(data: CreateSaleData): Promise<ApiResponse<Sale>> {
    const response = await apiClient.post<ApiResponse<Sale>>('/api/sales', data);
    return response.data;
  },

  /**
   * Get all sales with filters
   */
  async getAll(params?: SaleQueryParams): Promise<PaginatedResponse<Sale>> {
    const response = await apiClient.get<PaginatedResponse<Sale>>('/api/sales', { params });
    return response.data;
  },

  /**
   * Get sale by ID
   */
  async getById(id: string): Promise<ApiResponse<Sale>> {
    const response = await apiClient.get<ApiResponse<Sale>>(`/api/sales/${id}`);
    return response.data;
  },
};
