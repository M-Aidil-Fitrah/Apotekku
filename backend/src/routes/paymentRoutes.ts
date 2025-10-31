import { Router } from 'express';
import { createPayment } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create payment (protected)
router.post('/create', authenticate, createPayment);

export default router;
