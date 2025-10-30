import { Router } from 'express';
import { login, getMe, register } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/rbac';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/register', authenticate, adminOnly, register);

export default router;
