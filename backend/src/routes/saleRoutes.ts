import { Router } from 'express';
import { createSale, getSales, getSaleById } from '../controllers/saleController';
import { authenticate } from '../middleware/auth';
import { allStaff } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(allStaff);

router.get('/', getSales);
router.get('/:id', getSaleById);
router.post('/', createSale);

export default router;
