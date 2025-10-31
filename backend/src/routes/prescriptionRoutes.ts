import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  getAllPrescriptions,
  reviewPrescription,
  dispensePrescription,
  updatePrescription,
  deletePrescription,
} from '../controllers/prescriptionController';

const router = Router();

// Customer routes - upload dan manage resep
router.post('/', authenticate, uploadPrescription);
router.get('/my', authenticate, getMyPrescriptions);
router.get('/:id', authenticate, getPrescriptionById);
router.put('/:id', authenticate, updatePrescription);
router.delete('/:id', authenticate, deletePrescription);

// Apoteker routes - review dan manage semua resep
router.get('/', authenticate, requireRole('apoteker', 'admin'), getAllPrescriptions);
router.patch('/:id/review', authenticate, requireRole('apoteker'), reviewPrescription);
router.patch('/:id/dispense', authenticate, requireRole('apoteker'), dispensePrescription);

export default router;
