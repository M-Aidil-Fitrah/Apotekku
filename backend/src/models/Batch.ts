import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBatch extends Document {
  medicineId: mongoose.Types.ObjectId;
  batchNo: string;
  expDate: Date;
  qtyOnHand: number;
  buyPrice: number;
  receivedAt: Date;
  supplierId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: [true, 'Medicine ID wajib diisi'],
    },
    batchNo: {
      type: String,
      required: [true, 'Nomor batch wajib diisi'],
      uppercase: true,
      trim: true,
    },
    expDate: {
      type: Date,
      required: [true, 'Tanggal kadaluarsa wajib diisi'],
    },
    qtyOnHand: {
      type: Number,
      required: [true, 'Jumlah wajib diisi'],
      min: [0, 'Jumlah tidak boleh negatif'],
      default: 0,
    },
    buyPrice: {
      type: Number,
      required: [true, 'Harga beli wajib diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
    receivedAt: {
      type: Date,
      required: [true, 'Tanggal penerimaan wajib diisi'],
      default: Date.now,
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index untuk mencari batch unik
BatchSchema.index({ medicineId: 1, batchNo: 1 }, { unique: true });
BatchSchema.index({ medicineId: 1, expDate: 1 });
BatchSchema.index({ expDate: 1 });
BatchSchema.index({ qtyOnHand: 1 });

export const Batch: Model<IBatch> = mongoose.model<IBatch>('Batch', BatchSchema);
