import mongoose, { Schema, Document, Model } from 'mongoose';

export type PrescriptionStatus = 'NEW' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'DISPENSED';

export interface IPrescriptionLine {
  medicineId: mongoose.Types.ObjectId;
  dose: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface IPrescription extends Document {
  patientName: string;
  patientDOB?: Date;
  patientPhone?: string;
  doctorName: string;
  doctorLicense?: string;
  imageUrl?: string;
  lines: IPrescriptionLine[];
  status: PrescriptionStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  reviewedAt?: Date;
  dispensedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionLineSchema = new Schema<IPrescriptionLine>(
  {
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    dose: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    notes: String,
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    patientName: {
      type: String,
      required: [true, 'Nama pasien wajib diisi'],
      trim: true,
    },
    patientDOB: Date,
    patientPhone: {
      type: String,
      trim: true,
    },
    doctorName: {
      type: String,
      required: [true, 'Nama dokter wajib diisi'],
      trim: true,
    },
    doctorLicense: {
      type: String,
      trim: true,
    },
    imageUrl: String,
    lines: {
      type: [PrescriptionLineSchema],
      validate: {
        validator: function (lines: IPrescriptionLine[]) {
          return lines && lines.length > 0;
        },
        message: 'Minimal harus ada 1 obat',
      },
    },
    status: {
      type: String,
      enum: ['NEW', 'REVIEWED', 'APPROVED', 'REJECTED', 'DISPENSED'],
      default: 'NEW',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewNotes: String,
    reviewedAt: Date,
    dispensedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
PrescriptionSchema.index({ status: 1 });
PrescriptionSchema.index({ createdAt: -1 });
PrescriptionSchema.index({ reviewedBy: 1 });

export const Prescription: Model<IPrescription> = mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
