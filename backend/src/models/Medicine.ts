import mongoose, { Schema, Document, Model } from 'mongoose';

export type MedicineCategory = 'OTC' | 'Etikal' | 'Herbal';
export type DosageForm = 'tablet' | 'kapsul' | 'sirup' | 'krim' | 'salep' | 'injeksi' | 'tetes' | 'suppositoria' | 'inhaler' | 'lainnya';

export interface IMedicine extends Document {
  name: string;
  sku: string;
  category: MedicineCategory;
  dosageForm: DosageForm;
  sellingPrice: number;
  minStock: number;
  isPrescriptionOnly: boolean;
  description?: string;
  composition?: string;
  indication?: string;
  dosage?: string;
  sideEffects?: string;
  contraindication?: string;
  manufacturer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: [true, 'Nama obat wajib diisi'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU wajib diisi'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['OTC', 'Etikal', 'Herbal'],
      required: [true, 'Kategori wajib diisi'],
    },
    dosageForm: {
      type: String,
      enum: ['tablet', 'kapsul', 'sirup', 'krim', 'salep', 'injeksi', 'tetes', 'suppositoria', 'inhaler', 'lainnya'],
      required: [true, 'Bentuk sediaan wajib diisi'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Harga jual wajib diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
    minStock: {
      type: Number,
      default: 10,
      min: [0, 'Stok minimum tidak boleh negatif'],
    },
    isPrescriptionOnly: {
      type: Boolean,
      default: false,
    },
    description: String,
    composition: String,
    indication: String,
    dosage: String,
    sideEffects: String,
    contraindication: String,
    manufacturer: String,
  },
  {
    timestamps: true,
  }
);

// Indexes (sku sudah unique di schema, tidak perlu index lagi)
MedicineSchema.index({ name: 1 });
MedicineSchema.index({ category: 1 });
MedicineSchema.index({ isPrescriptionOnly: 1 });
MedicineSchema.index({ name: 'text', description: 'text' }); // Text search

export const Medicine: Model<IMedicine> = mongoose.model<IMedicine>('Medicine', MedicineSchema);
