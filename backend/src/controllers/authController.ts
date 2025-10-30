import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AppError } from '../middleware/errorHandler';

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email dan password wajib diisi', 400);
  }

  // Find user with password field
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !user.isActive) {
    throw new AppError('Email atau password salah', 401);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Email atau password salah', 401);
  }

  const userId = user._id as mongoose.Types.ObjectId;
  const token = generateToken(userId.toString());

  res.json({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      user: {
        _id: userId.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        branchId: user.branchId,
      },
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User tidak terautentikasi', 401);
  }

  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles,
      branchId: req.user.branchId,
      isActive: req.user.isActive,
    },
  });
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, roles, branchId } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email sudah terdaftar', 400);
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    roles: roles || ['kasir'],
    branchId,
  });

  res.status(201).json({
    success: true,
    message: 'User berhasil didaftarkan',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  });
};
