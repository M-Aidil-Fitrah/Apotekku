import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentMethod = 'cod' | 'transfer' | 'ewallet' | 'credit_card' | 'qris';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'expired';
export type PaymentGateway = 'midtrans' | 'manual' | 'cod';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  
  // Payment Details
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentGateway: PaymentGateway;
  status: PaymentStatus;
  
  // Gateway Details
  gatewayTransactionId?: string; // transaction_id from Midtrans
  gatewayOrderId?: string; // order_id sent to gateway
  snapToken?: string; // Midtrans Snap token
  redirectUrl?: string; // Payment page URL
  
  // Response Data
  gatewayResponse?: any; // Full response from gateway
  notificationPayload?: any; // Webhook/notification data
  
  // Verification
  signatureVerified?: boolean;
  fraudStatus?: string; // Midtrans fraud detection
  
  // Timestamps
  paidAt?: Date;
  expiredAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  
  // Metadata
  metadata?: Record<string, any>;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    
    // Payment Details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'IDR',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'transfer', 'ewallet', 'credit_card', 'qris'],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ['midtrans', 'manual', 'cod'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded', 'expired'],
      default: 'pending',
    },
    
    // Gateway Details
    gatewayTransactionId: {
      type: String,
      sparse: true,
      index: true,
    },
    gatewayOrderId: String,
    snapToken: String,
    redirectUrl: String,
    
    // Response Data
    gatewayResponse: Schema.Types.Mixed,
    notificationPayload: Schema.Types.Mixed,
    
    // Verification
    signatureVerified: Boolean,
    fraudStatus: String,
    
    // Timestamps
    paidAt: Date,
    expiredAt: Date,
    cancelledAt: Date,
    refundedAt: Date,
    
    // Metadata
    metadata: Schema.Types.Mixed,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes - Remove duplicates, keep compound indexes only
PaymentSchema.index({ orderId: 1, status: 1 });
PaymentSchema.index({ customerId: 1, createdAt: -1 });

export const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', PaymentSchema);
