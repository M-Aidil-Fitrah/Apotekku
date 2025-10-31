import { apiClient } from './client';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'transfer' | 'ewallet' | 'credit_card';

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  prescriptionRequired: boolean;
  prescriptionImageUrl?: string;
  prescriptionVerified?: boolean;
  prescriptionVerifiedBy?: string;
  prescriptionVerifiedAt?: Date;
  customerNotes?: string;
  adminNotes?: string;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingCost?: number;
  customerNotes?: string;
  prescriptionImageUrl?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

// Create new order
export const createOrder = async (orderData: CreateOrderData): Promise<OrderResponse> => {
  const response = await apiClient.post<OrderResponse>('/api/orders', orderData);
  return response.data;
};

// Get my orders (customer)
export const getMyOrders = async (page = 1, limit = 10): Promise<OrdersResponse> => {
  const response = await apiClient.get<OrdersResponse>(
    `/api/orders/my-orders?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const response = await apiClient.get<OrderResponse>(`/api/orders/${orderId}`);
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId: string, reason?: string): Promise<OrderResponse> => {
  const response = await apiClient.patch<OrderResponse>(`/api/orders/${orderId}/cancel`, {
    reason,
  });
  return response.data;
};
