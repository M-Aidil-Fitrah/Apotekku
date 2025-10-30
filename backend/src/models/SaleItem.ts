import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISaleItem extends Document {
  saleId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;
  batchId: mongoose.Types.ObjectId;
  qty: number;
  price: number;
  lineTotal: number;
  createdAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>(
  {
    saleId: {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
      required: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: [1, 'Jumlah minimal 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Harga tidak boleh negatif'],
    },
    lineTotal: {
      type: Number,
      required: true,
      min: [0, 'Total tidak boleh negatif'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
SaleItemSchema.index({ saleId: 1 });
SaleItemSchema.index({ medicineId: 1 });
SaleItemSchema.index({ batchId: 1 });

export const SaleItem: Model<ISaleItem> = mongoose.model<ISaleItem>('SaleItem', SaleItemSchema);
