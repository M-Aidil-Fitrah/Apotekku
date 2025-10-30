import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  allergies: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Nama customer wajib diisi'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Nomor telepon wajib diisi'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
    },
    address: {
      type: String,
      trim: true,
    },
    allergies: {
      type: [String],
      default: [],
    },
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ name: 1 });
CustomerSchema.index({ isActive: 1 });

export const Customer: Model<ICustomer> = mongoose.model<ICustomer>('Customer', CustomerSchema);
