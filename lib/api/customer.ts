import { apiClient } from './client';

export interface Customer {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  addresses: Array<{
    label: string;
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

// Get customer profile
export const getCustomerProfile = async (): Promise<CustomerResponse> => {
  const response = await apiClient.get<CustomerResponse>('/api/customers/profile');
  return response.data;
};

// Update customer profile (with optional profile image)
export const updateCustomerProfile = async (
  data: UpdateProfileData,
  profileImage?: File
): Promise<CustomerResponse> => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  const response = await apiClient.put<CustomerResponse>(
    '/api/customers/profile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Add address
export const addCustomerAddress = async (address: {
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}): Promise<CustomerResponse> => {
  const response = await apiClient.post<CustomerResponse>('/api/customers/addresses', address);
  return response.data;
};

// Update address
export const updateCustomerAddress = async (
  addressId: string,
  address: Partial<{
    label: string;
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
  }>
): Promise<CustomerResponse> => {
  const response = await apiClient.put<CustomerResponse>(
    `/api/customers/addresses/${addressId}`,
    address
  );
  return response.data;
};

// Delete address
export const deleteCustomerAddress = async (addressId: string): Promise<CustomerResponse> => {
  const response = await apiClient.delete<CustomerResponse>(
    `/api/customers/addresses/${addressId}`
  );
  return response.data;
};
