import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import {
  getSalesSummary,
  getExpiryReport,
  getLowStockReport,
  getTopSellingReport,
} from '../controllers/reportController';

const router = Router();

// All report routes require authentication
router.use(authenticate);

// Sales summary - accessible by admin & kasir
router.get('/sales-summary', authorize('admin', 'kasir', 'apoteker'), getSalesSummary);

// Expiry report - accessible by admin & apoteker
router.get('/expiry', authorize('admin', 'apoteker'), getExpiryReport);

// Low stock report - accessible by admin & apoteker
router.get('/low-stock', authorize('admin', 'apoteker'), getLowStockReport);

// Top selling report - accessible by admin
router.get('/top-selling', authorize('admin', 'kasir', 'apoteker'), getTopSellingReport);

export default router;
