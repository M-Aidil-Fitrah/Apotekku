import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { uploadMultiple, handleUploadError } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:slug', getProductBySlug);

// Admin routes with image upload
router.post('/', authenticate, requireRole('admin', 'apoteker'), handleUploadError(uploadMultiple), createProduct);
router.put('/:id', authenticate, requireRole('admin', 'apoteker'), handleUploadError(uploadMultiple), updateProduct);
router.delete('/:id', authenticate, requireRole('admin', 'apoteker'), deleteProduct);
router.patch('/:id/stock', authenticate, requireRole('admin', 'apoteker'), updateStock);

export default router;
