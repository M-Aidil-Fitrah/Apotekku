import { Router } from 'express';
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineBatches,
} from '../controllers/medicineController';
import { authenticate } from '../middleware/auth';
import { adminOrApoteker } from '../middleware/rbac';

const router = Router();

// Public routes (read-only)
router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.get('/:id/batches', getMedicineBatches);

// Protected routes (admin or apoteker)
router.post('/', authenticate, adminOrApoteker, createMedicine);
router.put('/:id', authenticate, adminOrApoteker, updateMedicine);
router.delete('/:id', authenticate, adminOrApoteker, deleteMedicine);

export default router;
