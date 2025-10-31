import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', authenticate, requireRole('admin', 'apoteker'), createCategory);
router.put('/:id', authenticate, requireRole('admin', 'apoteker'), updateCategory);
router.delete('/:id', authenticate, requireRole('admin', 'apoteker'), deleteCategory);

export default router;
