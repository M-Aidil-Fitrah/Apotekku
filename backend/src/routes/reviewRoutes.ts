import { Router } from 'express';
import {
  createReview,
  getProductReviews,
  replyToReview,
  moderateReview,
} from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Customer routes
router.post('/', authenticate, createReview);

// Admin routes
router.post('/:id/reply', authenticate, requireRole('admin', 'apoteker'), replyToReview);
router.patch('/:id/moderate', authenticate, requireRole('admin', 'apoteker'), moderateReview);

export default router;
