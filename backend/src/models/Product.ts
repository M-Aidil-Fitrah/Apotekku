import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  categoryId: mongoose.Types.ObjectId;
  
  // Pricing
  price: number;
  comparePrice?: number; // Original price for discount display
  costPrice?: number; // Cost for profit calculation
  
  // Inventory
  stockQuantity: number;
  lowStockThreshold: number;
  inStock: boolean;
  
  // Product Details
  images: string[];
  mainImage: string;
  
  // Medicine specific
  requiresPrescription: boolean;
  activeIngredient?: string;
  dosageForm?: string; // tablet, capsule, syrup, etc
  strength?: string; // 500mg, 10mg, etc
  manufacturer?: string;
  expiryDate?: Date;
  batchNumber?: string;
  
  // SEO & Marketing
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  
  // Stats
  viewCount: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU wajib diisi'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Deskripsi wajib diisi'],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategori wajib diisi'],
    },
    
    // Pricing
    price: {
      type: Number,
      required: [true, 'Harga wajib diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Harga pembanding tidak boleh negatif'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Harga modal tidak boleh negatif'],
    },
    
    // Inventory
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stok tidak boleh negatif'],
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    
    // Product Details
    images: {
      type: [String],
      default: [],
    },
    mainImage: {
      type: String,
      required: [true, 'Gambar utama wajib diisi'],
    },
    
    // Medicine specific
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    activeIngredient: {
      type: String,
      trim: true,
    },
    dosageForm: {
      type: String,
      trim: true,
    },
    strength: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    
    // SEO & Marketing
    metaTitle: String,
    metaDescription: String,
    tags: {
      type: [String],
      default: [],
    },
    
    // Stats
    viewCount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Auto-update inStock based on stockQuantity
ProductSchema.pre('save', function (next) {
  this.inStock = this.stockQuantity > 0;
  next();
});

export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);
