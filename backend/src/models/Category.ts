import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Nama kategori wajib diisi'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Single index definition
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (remove duplicate slug - already defined above)
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ parentId: 1 });

export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);
