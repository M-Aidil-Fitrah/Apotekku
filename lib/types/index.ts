// User & Auth
export type UserRole = 'admin' | 'apoteker' | 'kasir';

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: UserRole[];
  branchId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// Medicine
export type MedicineCategory = 'OTC' | 'Etikal' | 'Herbal';
export type DosageForm = 'tablet' | 'kapsul' | 'sirup' | 'krim' | 'salep' | 'injeksi' | 'tetes' | 'suppositoria' | 'inhaler' | 'lainnya';

export interface Medicine {
  _id: string;
  name: string;
  sku: string;
  category: MedicineCategory;
  dosageForm: DosageForm;
  sellingPrice: number;
  minStock: number;
  isPrescriptionOnly: boolean;
  description?: string;
  composition?: string;
  indication?: string;
  dosage?: string;
  sideEffects?: string;
  contraindication?: string;
  manufacturer?: string;
  createdAt: string;
  updatedAt: string;
}

// Batch
export interface Batch {
  _id: string;
  medicineId: string;
  batchNo: string;
  expDate: string;
  qtyOnHand: number;
  buyPrice: number;
  receivedAt: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

// Sale
export type SaleStatus = 'PAID' | 'VOID';
export type PaymentMethod = 'CASH' | 'DEBIT' | 'CREDIT' | 'QRIS' | 'TRANSFER';

export interface Sale {
  _id: string;
  invoiceNo: string;
  date: string;
  cashierId: string;
  customerId?: string;
  prescriptionId?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  _id: string;
  saleId: string;
  medicineId: string;
  batchId: string;
  qty: number;
  price: number;
  lineTotal: number;
  createdAt: string;
}

// Cart Item (for POS)
export interface CartItem {
  medicine: Medicine;
  batch: Batch;
  qty: number;
  price: number;
  lineTotal: number;
}

// Prescription
export type PrescriptionStatus = 'NEW' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'DISPENSED';

export interface PrescriptionLine {
  medicineId: string;
  dose: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Prescription {
  _id: string;
  patientName: string;
  patientDOB?: string;
  patientPhone?: string;
  doctorName: string;
  doctorLicense?: string;
  imageUrl?: string;
  lines: PrescriptionLine[];
  status: PrescriptionStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  dispensedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Payment & Transaction Types
export type PaymentMethodType = 'cod' | 'transfer' | 'ewallet' | 'credit_card' | 'qris';
export type PaymentStatusType = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'expired';
export type PaymentGatewayType = 'midtrans' | 'manual' | 'cod';
export type TransactionType = 'payment' | 'refund' | 'adjustment' | 'fee';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Payment {
  _id: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  paymentGateway: PaymentGatewayType;
  status: PaymentStatusType;
  gatewayTransactionId?: string;
  gatewayOrderId?: string;
  snapToken?: string;
  redirectUrl?: string;
  gatewayResponse?: any;
  notificationPayload?: any;
  signatureVerified?: boolean;
  fraudStatus?: string;
  paidAt?: string;
  expiredAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  metadata?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  orderId: string;
  paymentId?: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  reference?: string;
  metadata?: Record<string, any>;
  notes?: string;
  processedAt?: string;
  failedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResponse {
  token: string;
  redirect_url: string;
  paymentId: string;
  transactionId: string;
}
