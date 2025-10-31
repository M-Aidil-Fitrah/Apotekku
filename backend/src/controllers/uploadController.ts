import { Request, Response } from 'express';
import { uploadBuffer } from '../utils/cloudinary';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    // multer with memoryStorage should set req.file
    // @ts-ignore
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file provided' });

    const result = await uploadBuffer(file.buffer, { folder: 'apotekku/uploads' });

    return res.json({ success: true, data: { url: result.secure_url, public_id: result.public_id, raw: result } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

export default { uploadFile };
