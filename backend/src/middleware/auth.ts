import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { Customer, ICustomer } from '../models/Customer';

export interface AuthRequest extends Request {
  user?: IUser | ICustomer;
  userId?: string;
  userType?: 'admin' | 'customer';
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false,
        message: 'Token tidak ditemukan. Harap login terlebih dahulu.' 
      });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET tidak terkonfigurasi');
    }

    const decoded = jwt.verify(token, secret) as { 
      id?: string; 
      userId?: string; 
      type?: string;
      userType?: string;
    };
    
    // Support both old and new token formats
    const userId = decoded.id || decoded.userId;
    const userType = decoded.userType || decoded.type || 'user';

    if (userType === 'customer') {
      const customer = await Customer.findById(userId);

      if (!customer || !customer.isActive) {
        res.status(401).json({ 
          success: false,
          message: 'Customer tidak ditemukan atau tidak aktif.' 
        });
        return;
      }

      req.user = customer;
      req.userId = (customer._id as mongoose.Types.ObjectId).toString();
      req.userType = 'customer';
    } else {
      const user = await User.findById(userId);

      if (!user || !user.isActive) {
        res.status(401).json({ 
          success: false,
          message: 'User tidak ditemukan atau tidak aktif.' 
        });
        return;
      }

      req.user = user;
      req.userId = (user._id as mongoose.Types.ObjectId).toString();
      req.userType = 'admin';
    }
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false,
        message: 'Token tidak valid.' 
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: 'Token telah kadaluarsa. Harap login kembali.' 
      });
      return;
    }

    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat memverifikasi token.' 
    });
  }
};
