import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Purchase } from '../models/Purchase';
import { Batch } from '../models/Batch';
import { StockMovement } from '../models/StockMovement';
import { AppError } from '../middleware/errorHandler';
import { createAuditLog } from '../utils/audit';

export const createPurchase = async (req: AuthRequest, res: Response): Promise<void> => {
  const purchase = await Purchase.create({
    ...req.body,
    createdBy: req.userId,
  });

  const purchaseId = purchase._id as mongoose.Types.ObjectId;
  await createAuditLog('purchase', purchaseId.toString(), 'CREATE', req.userId!, undefined, purchase.toObject());

  res.status(201).json({
    success: true,
    message: 'Purchase order berhasil dibuat',
    data: purchase,
  });
};

export const receivePurchase = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchase = await Purchase.findById(id).session(session);

    if (!purchase) {
      throw new AppError('Purchase order tidak ditemukan', 404);
    }

    if (purchase.status === 'RECEIVED' || purchase.status === 'CLOSED') {
      throw new AppError('Purchase order sudah diterima', 400);
    }

    // Process each item
    for (const item of purchase.items) {
      if (!item.receivedQty || !item.batchNo || !item.expDate) {
        throw new AppError('receivedQty, batchNo, dan expDate wajib diisi untuk setiap item', 400);
      }

      // Find or create batch
      let batch = await Batch.findOne({
        medicineId: item.medicineId,
        batchNo: item.batchNo,
      }).session(session);

      if (batch) {
        // Update existing batch
        batch.qtyOnHand += item.receivedQty;
        await batch.save({ session });
      } else {
        // Create new batch
        const newBatch = await Batch.create(
          [
            {
              medicineId: item.medicineId,
              batchNo: item.batchNo,
              expDate: item.expDate,
              qtyOnHand: item.receivedQty,
              buyPrice: item.buyPrice,
              receivedAt: new Date(),
              supplierId: purchase.supplierId,
            },
          ],
          { session }
        );
        batch = Array.isArray(newBatch) ? newBatch[0] : newBatch;
      }

      // Create stock movement
      await StockMovement.create(
        [
          {
            type: 'PURCHASE',
            medicineId: item.medicineId,
            batchId: batch._id,
            qty: item.receivedQty,
            refId: purchase._id,
            createdBy: req.userId,
          },
        ],
        { session }
      );
    }

    // Update purchase status
    purchase.status = 'RECEIVED';
    purchase.receivedBy = new mongoose.Types.ObjectId(req.userId!);
    purchase.receivedAt = new Date();
    await purchase.save({ session });

    await createAuditLog('purchase', id, 'STATUS_CHANGE', req.userId!, 'ORDERED', 'RECEIVED');

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Purchase order berhasil diterima',
      data: purchase,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getPurchases = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, supplierId } = req.query;

  const filter: any = {};
  if (status) filter.status = status;
  if (supplierId) filter.supplierId = supplierId;

  const purchases = await Purchase.find(filter)
    .populate('supplierId', 'name')
    .populate('createdBy', 'name')
    .populate('items.medicineId', 'name sku')
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: purchases,
  });
};

export const getPurchaseById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const purchase = await Purchase.findById(id)
    .populate('supplierId')
    .populate('createdBy', 'name email')
    .populate('receivedBy', 'name email')
    .populate('items.medicineId')
    .lean();

  if (!purchase) {
    throw new AppError('Purchase order tidak ditemukan', 404);
  }

  res.json({
    success: true,
    data: purchase,
  });
};
