import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'ready_to_ship' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'transfer' | 'ewallet' | 'credit_card';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface IShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  
  items: IOrderItem[];
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  
  // Shipping
  shippingAddress: IShippingAddress;
  shippingMethod?: string;
  trackingNumber?: string;
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
  
  // Prescription
  prescriptionRequired: boolean;
  prescriptionImage?: string;
  prescriptionVerified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  
  // Status
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
  
  // Notes
  customerNotes?: string;
  adminNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID wajib diisi'],
    },
    
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      sku: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      image: String,
    }],
    
    // Pricing
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Shipping
    shippingAddress: {
      recipientName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      notes: String,
    },
    shippingMethod: String,
    trackingNumber: String,
    
    // Payment
    paymentMethod: {
      type: String,
      enum: ['cod', 'transfer', 'ewallet', 'credit_card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paidAt: Date,
    
    // Prescription
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    prescriptionImage: String,
    prescriptionVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [{
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      note: String,
    }],
    
    // Notes
    customerNotes: String,
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Auto-generate order number
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const orderNum = (count + 1).toString().padStart(5, '0');
    this.orderNumber = `ORD${year}${month}${orderNum}`;
  }
  
  // Add status to history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  
  next();
});

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);
