import mongoose, { Schema, Document, Model } from 'mongoose';

export type MovementType = 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'EXPIRE' | 'RETURN' | 'TRANSFER';

export interface IStockMovement extends Document {
  type: MovementType;
  medicineId: mongoose.Types.ObjectId;
  batchId: mongoose.Types.ObjectId;
  qty: number; // Positive for IN, Negative for OUT
  refId?: mongoose.Types.ObjectId; // Reference to Purchase/Sale/etc
  reason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    type: {
      type: String,
      enum: ['PURCHASE', 'SALE', 'ADJUSTMENT', 'EXPIRE', 'RETURN', 'TRANSFER'],
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
    },
    refId: {
      type: Schema.Types.ObjectId,
    },
    reason: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
StockMovementSchema.index({ medicineId: 1, createdAt: -1 });
StockMovementSchema.index({ batchId: 1 });
StockMovementSchema.index({ type: 1 });
StockMovementSchema.index({ createdAt: -1 });

export const StockMovement: Model<IStockMovement> = mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
