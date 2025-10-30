import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
  label: string; // 'Rumah', 'Kantor', etc
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface ICustomer extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  
  // Addresses
  addresses: IAddress[];
  
  // Health Info
  allergies: string[];
  chronicDiseases: string[];
  
  // Preferences
  wishlist: mongoose.Types.ObjectId[]; // Product IDs
  
  // Stats
  totalOrders: number;
  totalSpent: number;
  
  // Verification
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password wajib diisi'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Nomor telepon wajib diisi'],
      trim: true,
    },
    
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    
    allergies: {
      type: [String],
      default: [],
    },
    chronicDiseases: {
      type: [String],
      default: [],
    },
    
    wishlist: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    
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
