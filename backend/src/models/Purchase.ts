import mongoose, { Schema, Document, Model } from 'mongoose';

export type PurchaseStatus = 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CLOSED';

export interface IPurchaseItem {
  medicineId: mongoose.Types.ObjectId;
  orderedQty: number;
  receivedQty?: number;
  buyPrice: number;
  expDate?: Date;
  batchNo?: string;
}

export interface IPurchase extends Document {
  supplierId: mongoose.Types.ObjectId;
  status: PurchaseStatus;
  items: IPurchaseItem[];
  notes?: string;
  totalAmount?: number;
  createdBy: mongoose.Types.ObjectId;
  receivedBy?: mongoose.Types.ObjectId;
  receivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseItemSchema = new Schema<IPurchaseItem>(
  {
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    orderedQty: {
      type: Number,
      required: true,
      min: [1, 'Jumlah pesanan minimal 1'],
    },
    receivedQty: {
      type: Number,
      min: [0, 'Jumlah penerimaan tidak boleh negatif'],
    },
    buyPrice: {
      type: Number,
      required: true,
      min: [0, 'Harga tidak boleh negatif'],
    },
    expDate: Date,
    batchNo: {
      type: String,
      uppercase: true,
      trim: true,
    },
  },
  { _id: false }
);

const PurchaseSchema = new Schema<IPurchase>(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier wajib dipilih'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ORDERED', 'RECEIVED', 'CLOSED'],
      default: 'DRAFT',
    },
    items: {
      type: [PurchaseItemSchema],
      validate: {
        validator: function (items: IPurchaseItem[]) {
          return items && items.length > 0;
        },
        message: 'Minimal harus ada 1 item',
      },
    },
    notes: String,
    totalAmount: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receivedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
PurchaseSchema.index({ supplierId: 1 });
PurchaseSchema.index({ status: 1 });
PurchaseSchema.index({ createdAt: -1 });
PurchaseSchema.index({ createdBy: 1 });

export const Purchase: Model<IPurchase> = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
