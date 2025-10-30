import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Medicine } from '../models/Medicine';
import { Batch } from '../models/Batch';
import { AppError } from '../middleware/errorHandler';
import { parsePagination, createPaginationResponse } from '../utils/helpers';
import { calculateTotalStock } from '../utils/stock';
import { createAuditLog } from '../utils/audit';

export const getMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  const { search, category, isPrescriptionOnly, dosageForm } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) filter.category = category;
  if (isPrescriptionOnly !== undefined) filter.isPrescriptionOnly = isPrescriptionOnly === 'true';
  if (dosageForm) filter.dosageForm = dosageForm;

  const [medicines, total] = await Promise.all([
    Medicine.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Medicine.countDocuments(filter),
  ]);

  res.json({
    success: true,
    ...createPaginationResponse(medicines, total, page, limit),
  });
};

export const getMedicineById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id).lean();

  if (!medicine) {
    throw new AppError('Obat tidak ditemukan', 404);
  }

  // Get total stock
  const totalStock = await calculateTotalStock(id);

  // Get batches info
  const batches = await Batch.find({ medicineId: id, qtyOnHand: { $gt: 0 } })
    .sort({ expDate: 1 })
    .lean();

  res.json({
    success: true,
    data: {
      ...medicine,
      totalStock,
      batches: batches.length,
      nearestExpiry: batches[0]?.expDate,
    },
  });
};

export const createMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  const medicine = await Medicine.create(req.body);
  const medicineId = medicine._id as mongoose.Types.ObjectId;

  await createAuditLog('medicine', medicineId.toString(), 'CREATE', req.userId!, undefined, medicine.toObject());

  res.status(201).json({
    success: true,
    message: 'Obat berhasil ditambahkan',
    data: medicine,
  });
};

export const updateMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const oldMedicine = await Medicine.findById(id).lean();

  if (!oldMedicine) {
    throw new AppError('Obat tidak ditemukan', 404);
  }

  const medicine = await Medicine.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  await createAuditLog('medicine', id, 'UPDATE', req.userId!, oldMedicine, medicine);

  res.json({
    success: true,
    message: 'Obat berhasil diupdate',
    data: medicine,
  });
};

export const deleteMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id).lean();

  if (!medicine) {
    throw new AppError('Obat tidak ditemukan', 404);
  }

  // Check if medicine has stock
  const totalStock = await calculateTotalStock(id);

  if (totalStock > 0) {
    throw new AppError('Tidak dapat menghapus obat yang masih memiliki stok', 400);
  }

  await Medicine.findByIdAndDelete(id);

  await createAuditLog('medicine', id, 'DELETE', req.userId!, medicine, undefined);

  res.json({
    success: true,
    message: 'Obat berhasil dihapus',
  });
};

export const getMedicineBatches = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    throw new AppError('Obat tidak ditemukan', 404);
  }

  const batches = await Batch.find({ medicineId: id })
    .populate('supplierId', 'name')
    .sort({ expDate: 1 })
    .lean();

  res.json({
    success: true,
    data: batches,
  });
};
