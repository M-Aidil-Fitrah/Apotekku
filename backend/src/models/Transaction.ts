import mongoose, { Schema, Document, Model } from 'mongoose';

export type TransactionType = 'payment' | 'refund' | 'adjustment' | 'fee';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface ITransaction extends Document {
  orderId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  
  // Transaction Details
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  
  // Description
  description: string;
  reference?: string; // External reference number
  
  // Related Data
  metadata?: Record<string, any>;
  notes?: string;
  
  // Processing
  processedAt?: Date;
  failedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    
    // Transaction Details
    type: {
      type: String,
      enum: ['payment', 'refund', 'adjustment', 'fee'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'IDR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    
    // Description
    description: {
      type: String,
      required: true,
    },
    reference: String,
    
    // Related Data
    metadata: Schema.Types.Mixed,
    notes: String,
    
    // Processing
    processedAt: Date,
    failedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes - Compound indexes only to avoid duplicates
TransactionSchema.index({ orderId: 1, createdAt: -1 });
TransactionSchema.index({ customerId: 1, type: 1, createdAt: -1 });
TransactionSchema.index({ paymentId: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
