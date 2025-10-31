import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { hashPassword } from '../utils/auth';
import { AppError } from '../middleware/errorHandler';

// Get all users (Admin only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 10, search = '', role = '' } = req.query;

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.roles = role;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

// Get user by ID (Admin only)
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('ID user tidak valid', 400);
  }

  const user = await User.findById(id).select('-passwordHash');

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  res.json({
    success: true,
    data: user,
  });
};

// Update user (Admin only)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, roles, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('ID user tidak valid', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email sudah digunakan oleh user lain', 400);
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (roles) user.roles = roles;

  // Update password if provided
  if (password) {
    user.passwordHash = await hashPassword(password);
  }

  await user.save();

  res.json({
    success: true,
    message: 'User berhasil diupdate',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
    },
  });
};

// Delete user (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('ID user tidak valid', 400);
  }

  // Prevent admin from deleting themselves
  const userId = req.user && '_id' in req.user ? (req.user._id as mongoose.Types.ObjectId).toString() : '';
  if (userId === id) {
    throw new AppError('Tidak dapat menghapus akun sendiri', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User berhasil dihapus',
  });
};

// Toggle user active status (Admin only)
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('ID user tidak valid', 400);
  }

  // Prevent admin from deactivating themselves
  const userId = req.user && '_id' in req.user ? (req.user._id as mongoose.Types.ObjectId).toString() : '';
  if (userId === id) {
    throw new AppError('Tidak dapat mengubah status akun sendiri', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User berhasil ${user.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
    },
  });
};
