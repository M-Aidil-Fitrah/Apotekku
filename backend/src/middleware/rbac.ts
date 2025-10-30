import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '../models/User';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. User tidak terautentikasi.',
      });
      return;
    }

    const hasRole = req.user.roles.some(role => roles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak. Role yang diizinkan: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

// Shorthand helpers
export const adminOnly = authorize('admin');
export const apotekerOnly = authorize('apoteker');
export const adminOrApoteker = authorize('admin', 'apoteker');
export const allStaff = authorize('admin', 'apoteker', 'kasir');
