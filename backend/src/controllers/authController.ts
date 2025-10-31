import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AppError } from '../middleware/errorHandler';

// Staff/Admin login
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
      },
    },
  });
};

// Customer registration
export const registerCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password || !phone) {
    throw new AppError('Nama, email, password, dan phone wajib diisi', 400);
  }

  // Check if email already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    throw new AppError('Email sudah terdaftar', 400);
  }

  const passwordHash = await hashPassword(password);

  // Prepare addresses array if address provided
  const addresses = address ? [{
    label: 'Alamat Utama',
    recipientName: name,
    phone: phone,
    address: address.street || '',
    city: address.city || '',
    province: address.province || '',
    postalCode: address.postalCode || '',
    isDefault: true,
  }] : [];

  const customer = await Customer.create({
    name,
    email,
    passwordHash,
    phone,
    addresses,
    isActive: true,
  });

  const customerId = customer._id as mongoose.Types.ObjectId;
  const token = generateToken(customerId.toString(), 'customer');

  res.status(201).json({
    success: true,
    message: 'Registrasi berhasil',
    data: {
      token,
      customer: {
        _id: customerId.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses,
        isActive: customer.isActive,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        createdAt: customer.createdAt,
      },
    },
  });
};

// Customer login
export const loginCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email dan password wajib diisi', 400);
  }

  // Find customer with password field
  const customer = await Customer.findOne({ email }).select('+passwordHash');

  if (!customer || !customer.isActive) {
    throw new AppError('Email atau password salah', 401);
  }

  const isPasswordValid = await comparePassword(password, customer.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Email atau password salah', 401);
  }

  const customerId = customer._id as mongoose.Types.ObjectId;
  const token = generateToken(customerId.toString(), 'customer');

  res.json({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      customer: {
        _id: customerId.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses,
        isActive: customer.isActive,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        createdAt: customer.createdAt,
      },
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User tidak terautentikasi', 401);
  }

  // Check if it's a User (staff) - has roles property
  if ('roles' in req.user) {
    res.json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles,
        isActive: req.user.isActive,
      },
    });
  } else {
    // Customer
    res.json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: 'buyer',
        isActive: req.user.isActive,
      },
    });
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, roles } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email sudah terdaftar', 400);
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    roles: roles || ['apoteker'],
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
