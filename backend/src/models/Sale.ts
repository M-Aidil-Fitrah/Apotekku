import mongoose, { Schema, Document, Model } from 'mongoose';

export type SaleStatus = 'PAID' | 'VOID';
export type PaymentMethod = 'CASH' | 'DEBIT' | 'CREDIT' | 'QRIS' | 'TRANSFER';

export interface ISale extends Document {
  invoiceNo: string;
  date: Date;
  cashierId: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  prescriptionId?: mongoose.Types.ObjectId;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    cashierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    prescriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal tidak boleh negatif'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Diskon tidak boleh negatif'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Pajak tidak boleh negatif'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total tidak boleh negatif'],
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'DEBIT', 'CREDIT', 'QRIS', 'TRANSFER'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PAID', 'VOID'],
      default: 'PAID',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes (invoiceNo sudah unique di schema, tidak perlu index lagi)
SaleSchema.index({ date: -1 });
SaleSchema.index({ cashierId: 1 });
SaleSchema.index({ status: 1 });
SaleSchema.index({ prescriptionId: 1 });

export const Sale: Model<ISale> = mongoose.model<ISale>('Sale', SaleSchema);
