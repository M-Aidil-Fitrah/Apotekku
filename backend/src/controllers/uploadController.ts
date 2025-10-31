import { Request, Response } from 'express';
import { uploadBuffer } from '../utils/cloudinary';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    // multer with memoryStorage should set req.file
    // @ts-ignore
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file provided' });

    // Get folder from query param or use default
    const folder = (req.query.folder as string) || 'apotekku/general';

    const result = await uploadBuffer(file.buffer, { 
      folder,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    return res.json({ 
      success: true, 
      data: { 
        url: result.secure_url, 
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      } 
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

export default { uploadFile };
