import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { uploadSingle, handleUploadError } from '../middleware/upload';

const router = Router();

// General upload endpoint with optional folder parameter
router.post('/', authenticate, handleUploadError(uploadSingle), uploadFile);

export default router;
