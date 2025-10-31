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
import { uploadSingle, handleUploadError } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes with image upload
router.post('/', authenticate, requireRole('admin', 'apoteker'), handleUploadError(uploadSingle), createCategory);
router.put('/:id', authenticate, requireRole('admin', 'apoteker'), handleUploadError(uploadSingle), updateCategory);
router.delete('/:id', authenticate, requireRole('admin', 'apoteker'), deleteCategory);

export default router;
