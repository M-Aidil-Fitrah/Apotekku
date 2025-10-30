import { Batch, IBatch } from '../models/Batch';
import mongoose from 'mongoose';

/**
 * FEFO (First Expired First Out) - Pilih batch dengan tanggal kadaluarsa terdekat
 */
export const selectBatchesFEFO = async (
  medicineId: string | mongoose.Types.ObjectId,
  requiredQty: number
): Promise<{ batchId: mongoose.Types.ObjectId; qty: number; expDate: Date }[]> => {
  // Cari batch yang masih ada stok, urutkan berdasarkan expDate (ascending)
  const availableBatches = await Batch.find({
    medicineId,
    qtyOnHand: { $gt: 0 },
    expDate: { $gt: new Date() }, // Tidak ambil yang sudah expired
  })
    .sort({ expDate: 1 }) // FEFO: kadaluarsa terdekat dulu
    .lean();

  if (availableBatches.length === 0) {
    throw new Error('Stok tidak tersedia atau batch sudah expired');
  }

  const selectedBatches: { batchId: mongoose.Types.ObjectId; qty: number; expDate: Date }[] = [];
  let remaining = requiredQty;

  for (const batch of availableBatches) {
    if (remaining <= 0) break;

    const takeQty = Math.min(batch.qtyOnHand, remaining);
    selectedBatches.push({
      batchId: batch._id as mongoose.Types.ObjectId,
      qty: takeQty,
      expDate: batch.expDate,
    });

    remaining -= takeQty;
  }

  if (remaining > 0) {
    throw new Error(`Stok tidak cukup. Tersedia: ${requiredQty - remaining}, Dibutuhkan: ${requiredQty}`);
  }

  return selectedBatches;
};

/**
 * Hitung total stok untuk medicine tertentu
 */
export const calculateTotalStock = async (
  medicineId: string | mongoose.Types.ObjectId
): Promise<number> => {
  const result = await Batch.aggregate([
    {
      $match: {
        medicineId: new mongoose.Types.ObjectId(medicineId as string),
        qtyOnHand: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        totalQty: { $sum: '$qtyOnHand' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalQty : 0;
};

/**
 * Cari batch yang akan kadaluarsa dalam X hari
 */
export const findExpiringSoonBatches = async (days: number = 30) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);

  return Batch.find({
    expDate: { $lte: targetDate, $gt: new Date() },
    qtyOnHand: { $gt: 0 },
  })
    .populate('medicineId', 'name sku')
    .sort({ expDate: 1 })
    .lean();
};

/**
 * Cari batch yang sudah expired
 */
export const findExpiredBatches = async () => {
  return Batch.find({
    expDate: { $lte: new Date() },
    qtyOnHand: { $gt: 0 },
  })
    .populate('medicineId', 'name sku')
    .sort({ expDate: 1 })
    .lean();
};
