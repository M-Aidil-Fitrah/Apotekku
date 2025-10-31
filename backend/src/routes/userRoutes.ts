import { Router } from 'express';
import { 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus 
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/rbac';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(adminOnly);

// User management routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
