import multer from 'multer';
import { Request } from 'express';

// Configure multer for memory storage (buffer)
const storage = multer.memoryStorage();

// File filter for images only
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer upload instances
export const uploadSingle = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('image');

export const uploadMultiple = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
}).array('images', 5); // Max 5 images

export const uploadFields = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

// Wrapper middleware to handle multer errors
export const handleUploadError = (uploadMiddleware: any) => {
  return (req: Request, res: any, next: any) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB',
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum is 5 files',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
};
