import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Customer Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if customer exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await Customer.create({
      name,
      email,
      passwordHash,
      phone,
    });

    // Generate token
    const token = jwt.sign(
      { id: customer._id, type: 'customer', role: 'buyer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: 'buyer',
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error during registration',
      error: error.message,
    });
  }
};

// Customer Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find customer
    const customer = await Customer.findOne({ email, isActive: true }).select('+passwordHash');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, customer.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: customer._id, type: 'customer', role: 'buyer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: 'buyer',
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

// Get Customer Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;

    const customer = await Customer.findById(customerId).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// Update Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { name, phone, allergies, chronicDiseases } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: { name, phone, allergies, chronicDiseases } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// Add Address
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $push: { addresses: req.body } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Address added successfully',
      data: customer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error adding address',
      error: error.message,
    });
  }
};

// Update Address
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { addressId } = req.params;

    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, 'addresses._id': addressId },
      { $set: { 'addresses.$': req.body } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer or address not found',
      });
    }

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: customer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating address',
      error: error.message,
    });
  }
};

// Delete Address
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { addressId } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: customer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message,
    });
  }
};

// Toggle Wishlist
export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { productId } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const index = customer.wishlist.indexOf(productId);

    if (index > -1) {
      customer.wishlist.splice(index, 1);
    } else {
      customer.wishlist.push(productId);
    }

    await customer.save();

    res.json({
      success: true,
      message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist',
      data: customer.wishlist,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist',
      error: error.message,
    });
  }
};
