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

    // Check if user has roles property (User/Staff), Customer doesn't have roles
    if (!('roles' in req.user)) {
      res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin/staff yang dapat mengakses resource ini.',
      });
      return;
    }

    const hasRole = req.user.roles.some((role: UserRole) => roles.includes(role));

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

// Export requireRole as alias for authorize
export const requireRole = authorize;

// Shorthand helpers
export const adminOnly = authorize('admin');
export const apotekerOnly = authorize('apoteker');
export const adminOrApoteker = authorize('admin', 'apoteker');

