import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

router.post('/', authenticate, upload.single('file'), uploadFile);

export default router;
