import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
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

    const decoded = jwt.verify(token, secret) as { userId: string };
    
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401).json({ 
        success: false,
        message: 'User tidak ditemukan atau tidak aktif.' 
      });
      return;
    }

    const userId = user._id as mongoose.Types.ObjectId;
    req.user = user;
    req.userId = userId.toString();
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
