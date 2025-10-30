import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  
  // Helpful votes
  helpfulCount: number;
  
  // Verification
  isVerifiedPurchase: boolean;
  
  // Admin moderation
  isApproved: boolean;
  moderatedBy?: mongoose.Types.ObjectId;
  moderationNote?: string;
  
  // Reply
  reply?: {
    message: string;
    repliedBy: mongoose.Types.ObjectId;
    repliedAt: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID wajib diisi'],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID wajib diisi'],
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    
    rating: {
      type: Number,
      required: [true, 'Rating wajib diisi'],
      min: [1, 'Rating minimal 1'],
      max: [5, 'Rating maksimal 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Judul maksimal 100 karakter'],
    },
    comment: {
      type: String,
      required: [true, 'Komentar wajib diisi'],
      trim: true,
      maxlength: [1000, 'Komentar maksimal 1000 karakter'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 5;
        },
        message: 'Maksimal 5 gambar',
      },
    },
    
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    
    isApproved: {
      type: Boolean,
      default: false,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    moderationNote: String,
    
    reply: {
      message: String,
      repliedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      repliedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ customerId: 1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ rating: 1 });

// Ensure one review per customer per product
ReviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
