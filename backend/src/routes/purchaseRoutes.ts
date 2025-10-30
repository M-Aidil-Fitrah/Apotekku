import { Router } from 'express';
import {
  createPurchase,
  receivePurchase,
  getPurchases,
  getPurchaseById,
} from '../controllers/purchaseController';
import { authenticate } from '../middleware/auth';
import { adminOrApoteker } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getPurchases);
router.get('/:id', getPurchaseById);
router.post('/', adminOrApoteker, createPurchase);
router.post('/:id/receive', adminOrApoteker, receivePurchase);

export default router;
