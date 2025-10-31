import { apiClient } from './client';

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
}

// Get all users (Admin only)
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.role) queryParams.append('role', params.role);

  const response = await apiClient.get(`/users?${queryParams.toString()}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// Create user (uses existing register endpoint)
export const createUser = async (data: CreateUserData): Promise<UserResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

// Update user
export const updateUser = async (id: string, data: UpdateUserData): Promise<UserResponse> => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

// Toggle user status
export const toggleUserStatus = async (id: string): Promise<UserResponse> => {
  const response = await apiClient.patch(`/users/${id}/toggle-status`);
  return response.data;
};
