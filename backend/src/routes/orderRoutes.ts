import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  verifyPrescription,
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Customer routes (requires customer auth)
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/cancel', authenticate, cancelOrder);

// Admin routes
router.get('/', authenticate, requireRole('admin', 'apoteker'), getAllOrders);
router.patch('/:id/status', authenticate, requireRole('admin', 'apoteker'), updateOrderStatus);
router.patch('/:id/prescription', authenticate, requireRole('admin', 'apoteker'), verifyPrescription);

export default router;
