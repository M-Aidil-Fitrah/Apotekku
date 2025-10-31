import { Router } from 'express';
import { 
  createPayment, 
  getPaymentByOrderId, 
  getPaymentStatus,
  getTransactionHistory 
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create payment (protected)
router.post('/create', authenticate, createPayment);

// Get payment by order ID
router.get('/order/:orderId', authenticate, getPaymentByOrderId);

// Get payment status
router.get('/:paymentId/status', authenticate, getPaymentStatus);

// Get transaction history for an order
router.get('/order/:orderId/transactions', authenticate, getTransactionHistory);

export default router;
