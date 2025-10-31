import { apiClient } from './client';
import { ApiResponse, Payment, Transaction, CreatePaymentResponse } from '../types';

export const paymentApi = {
  // Create payment for an order
  createPayment: async (orderId: string): Promise<ApiResponse<CreatePaymentResponse>> => {
    const response = await apiClient.post('/payments/create', { orderId });
    return response.data;
  },

  // Get payment by order ID
  getPaymentByOrderId: async (orderId: string): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.get(`/payments/order/${orderId}`);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.get(`/payments/${paymentId}/status`);
    return response.data;
  },

  // Get transaction history for an order
  getTransactionHistory: async (orderId: string): Promise<ApiResponse<Transaction[]>> => {
    const response = await apiClient.get(`/payments/order/${orderId}/transactions`);
    return response.data;
  },
};

export default paymentApi;
