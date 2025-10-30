import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'apoteker';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
      select: false, // Don't return password by default
    },
    roles: {
      type: [String],
      enum: ['admin', 'apoteker'],
      default: ['apoteker'],
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

// Index for faster queries (email sudah unique di schema, tidak perlu index lagi)
UserSchema.index({ isActive: 1 });

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
