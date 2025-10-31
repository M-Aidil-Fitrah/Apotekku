import { Router } from 'express';
import { login, getMe, register, registerCustomer, loginCustomer } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/rbac';

const router = Router();

// Staff/Admin routes
router.post('/login', login);
router.post('/register', authenticate, adminOnly, register);

// Customer routes
router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);

// Common routes
router.get('/me', authenticate, getMe);

export default router;
