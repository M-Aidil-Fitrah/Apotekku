import { Response } from 'express';
import { Prescription, PrescriptionStatus } from '../models/Prescription';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { uploadBuffer } from '../utils/cloudinary';

// Customer: Upload resep baru
export const uploadPrescription = async (req: AuthRequest, res: Response) => {
  const { patientName, patientDOB, patientPhone, doctorName, doctorLicense, lines } = req.body;
  
  let imageUrl = req.body.imageUrl;

  // Handle image upload if file is provided
  // @ts-ignore
  if (req.file) {
    // @ts-ignore
    const imageResult = await uploadBuffer(req.file.buffer, { 
      folder: 'apotekku/prescriptions',
      transformation: [
        { width: 1200, height: 1600, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    imageUrl = imageResult.secure_url;
  }

  // Validasi semua productId exist
  const productIds = lines.map((line: any) => line.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    throw new AppError('Beberapa produk tidak ditemukan', 400);
  }

  const prescription = await Prescription.create({
    patientName,
    patientDOB,
    patientPhone,
    doctorName,
    doctorLicense,
    imageUrl,
    lines,
    status: 'NEW',
  });

  res.status(201).json({
    success: true,
    data: prescription,
  });
};

// Customer: Lihat resep sendiri
export const getMyPrescriptions = async (req: AuthRequest, res: Response) => {
  const { status } = req.query;
  
  const filter: any = {};
  if (status) {
    filter.status = status;
  }

  const prescriptions = await Prescription.find(filter)
    .populate('lines.productId', 'name price mainImage')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: prescriptions,
  });
};

// Customer: Lihat detail resep
export const getPrescriptionById = async (req: AuthRequest, res: Response) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('lines.productId', 'name price mainImage stockQuantity')
    .populate('reviewedBy', 'name email');

  if (!prescription) {
    throw new AppError('Resep tidak ditemukan', 404);
  }

  res.json({
    success: true,
    data: prescription,
  });
};

// Apoteker: Lihat semua resep (dengan filter)
export const getAllPrescriptions = async (req: AuthRequest, res: Response) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter: any = {};
  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [prescriptions, total] = await Promise.all([
    Prescription.find(filter)
      .populate('lines.productId', 'name price mainImage')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Prescription.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: prescriptions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

// Apoteker: Review resep (approve/reject)
export const reviewPrescription = async (req: AuthRequest, res: Response) => {
  const { status, reviewNotes } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new AppError('Status harus APPROVED atau REJECTED', 400);
  }

  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new AppError('Resep tidak ditemukan', 404);
  }

  if (prescription.status !== 'NEW') {
    throw new AppError('Resep sudah direview', 400);
  }

  prescription.status = status as PrescriptionStatus;
  prescription.reviewedBy = req.user!.id;
  prescription.reviewNotes = reviewNotes;
  prescription.reviewedAt = new Date();

  await prescription.save();

  await prescription.populate([
    { path: 'lines.productId', select: 'name price mainImage' },
    { path: 'reviewedBy', select: 'name email' },
  ]);

  res.json({
    success: true,
    data: prescription,
  });
};

// Apoteker: Mark resep as dispensed (obat sudah diberikan)
export const dispensePrescription = async (req: AuthRequest, res: Response) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new AppError('Resep tidak ditemukan', 404);
  }

  if (prescription.status !== 'APPROVED') {
    throw new AppError('Hanya resep yang sudah APPROVED yang bisa di-dispense', 400);
  }

  prescription.status = 'DISPENSED';
  prescription.dispensedAt = new Date();

  await prescription.save();

  await prescription.populate([
    { path: 'lines.productId', select: 'name price mainImage' },
    { path: 'reviewedBy', select: 'name email' },
  ]);

  res.json({
    success: true,
    data: prescription,
  });
};

// Customer: Update resep yang masih NEW
export const updatePrescription = async (req: AuthRequest, res: Response) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new AppError('Resep tidak ditemukan', 404);
  }

  if (prescription.status !== 'NEW') {
    throw new AppError('Hanya resep dengan status NEW yang bisa diupdate', 400);
  }

  const { patientName, patientDOB, patientPhone, doctorName, doctorLicense, imageUrl, lines } = req.body;

  // Validasi semua productId exist jika ada lines baru
  if (lines) {
    const productIds = lines.map((line: any) => line.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (products.length !== productIds.length) {
      throw new AppError('Beberapa produk tidak ditemukan', 400);
    }
  }

  Object.assign(prescription, {
    patientName: patientName || prescription.patientName,
    patientDOB: patientDOB || prescription.patientDOB,
    patientPhone: patientPhone || prescription.patientPhone,
    doctorName: doctorName || prescription.doctorName,
    doctorLicense: doctorLicense || prescription.doctorLicense,
    imageUrl: imageUrl || prescription.imageUrl,
    lines: lines || prescription.lines,
  });

  await prescription.save();

  await prescription.populate('lines.productId', 'name price mainImage');

  res.json({
    success: true,
    data: prescription,
  });
};

// Customer: Hapus resep yang masih NEW
export const deletePrescription = async (req: AuthRequest, res: Response) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new AppError('Resep tidak ditemukan', 404);
  }

  if (prescription.status !== 'NEW') {
    throw new AppError('Hanya resep dengan status NEW yang bisa dihapus', 400);
  }

  await prescription.deleteOne();

  res.json({
    success: true,
    message: 'Resep berhasil dihapus',
  });
};
