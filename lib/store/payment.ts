import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Payment, Transaction } from '../types';
import { paymentApi } from '../api/payment';

interface PaymentState {
  currentPayment: Payment | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createPayment: (orderId: string) => Promise<{ token: string; redirect_url: string } | null>;
  fetchPaymentByOrderId: (orderId: string) => Promise<void>;
  fetchPaymentStatus: (paymentId: string) => Promise<void>;
  fetchTransactionHistory: (orderId: string) => Promise<void>;
  clearPayment: () => void;
  setError: (error: string | null) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      currentPayment: null,
      transactions: [],
      isLoading: false,
      error: null,

      createPayment: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentApi.createPayment(orderId);
          if (response.success) {
            return {
              token: response.data.token,
              redirect_url: response.data.redirect_url,
            };
          }
          set({ error: 'Failed to create payment' });
          return null;
        } catch (error: any) {
          set({ error: error.message || 'Failed to create payment' });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchPaymentByOrderId: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentApi.getPaymentByOrderId(orderId);
          if (response.success) {
            set({ currentPayment: response.data });
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch payment' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchPaymentStatus: async (paymentId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentApi.getPaymentStatus(paymentId);
          if (response.success) {
            set({ currentPayment: response.data });
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch payment status' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchTransactionHistory: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentApi.getTransactionHistory(orderId);
          if (response.success) {
            set({ transactions: response.data });
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch transaction history' });
        } finally {
          set({ isLoading: false });
        }
      },

      clearPayment: () => {
        set({ currentPayment: null, transactions: [], error: null });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'payment-storage',
      partialize: (state) => ({
        currentPayment: state.currentPayment,
      }),
    }
  )
);
