import apiClient from './client';
import { LoginCredentials, AuthResponse, User, ApiResponse } from '../types';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
}

export interface Address {
  label: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CustomerAuthResponse {
  success: boolean;
  data: {
    token: string;
    customer: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      addresses?: Address[];
      isActive: boolean;
      totalOrders: number;
      totalSpent: number;
      createdAt: Date;
    };
  };
  message?: string;
}

export const authService = {
  /**
   * Login user (Staff/Admin)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    
    if (response.data.success) {
      // Store token and user in localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  /**
   * Register customer
   */
  async registerCustomer(data: RegisterData): Promise<CustomerAuthResponse> {
    const response = await apiClient.post<CustomerAuthResponse>('/api/auth/register/customer', data);
    
    if (response.data.success) {
      // Store token and customer in localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.customer));
      localStorage.setItem('userType', 'customer');
    }
    
    return response.data;
  },

  /**
   * Login customer
   */
  async loginCustomer(credentials: LoginCredentials): Promise<CustomerAuthResponse> {
    const response = await apiClient.post<CustomerAuthResponse>('/api/auth/login/customer', credentials);
    
    if (response.data.success) {
      // Store token and customer in localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.customer));
      localStorage.setItem('userType', 'customer');
    }
    
    return response.data;
  },

  /**
   * Get current user
   */
  async me(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/api/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Get stored user
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get user type
   */
  getUserType(): 'customer' | 'staff' | null {
    return localStorage.getItem('userType') as 'customer' | 'staff' | null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if user is customer
   */
  isCustomer(): boolean {
    return this.getUserType() === 'customer';
  },

  /**
   * Check if user is staff
   */
  isStaff(): boolean {
    return this.getUserType() === 'staff' || !this.getUserType(); // backward compatibility
  },
};

