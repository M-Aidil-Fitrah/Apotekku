import apiClient from './client';
import { Medicine, Batch, ApiResponse, PaginatedResponse } from '../types';

export interface MedicineQueryParams {
  search?: string;
  category?: string;
  isPrescriptionOnly?: boolean;
  dosageForm?: string;
  page?: number;
  limit?: number;
}

export const medicineService = {
  /**
   * Get all medicines with filters
   */
  async getAll(params?: MedicineQueryParams): Promise<PaginatedResponse<Medicine>> {
    const response = await apiClient.get<PaginatedResponse<Medicine>>('/api/medicines', { params });
    return response.data;
  },

  /**
   * Get medicine by ID
   */
  async getById(id: string): Promise<ApiResponse<Medicine>> {
    const response = await apiClient.get<ApiResponse<Medicine>>(`/api/medicines/${id}`);
    return response.data;
  },

  /**
   * Get batches for a medicine
   */
  async getBatches(medicineId: string): Promise<ApiResponse<Batch[]>> {
    const response = await apiClient.get<ApiResponse<Batch[]>>(`/api/medicines/${medicineId}/batches`);
    return response.data;
  },

  /**
   * Create new medicine
   */
  async create(data: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    const response = await apiClient.post<ApiResponse<Medicine>>('/api/medicines', data);
    return response.data;
  },

  /**
   * Update medicine
   */
  async update(id: string, data: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    const response = await apiClient.put<ApiResponse<Medicine>>(`/api/medicines/${id}`, data);
    return response.data;
  },

  /**
   * Delete medicine
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/medicines/${id}`);
    return response.data;
  },
};
