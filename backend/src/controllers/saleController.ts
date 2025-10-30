import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { Batch } from '../models/Batch';
import { StockMovement } from '../models/StockMovement';
import { Medicine } from '../models/Medicine';
import { Prescription } from '../models/Prescription';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';
import { selectBatchesFEFO } from '../utils/stock';
import { generateInvoiceNo } from '../utils/helpers';
import { createAuditLog } from '../utils/audit';

interface CartItem {
  medicineId: string;
  qty: number;
  price: number;
}

export const createSale = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    items,
    discount = 0,
    tax = 0,
    paymentMethod,
    prescriptionId,
    notes,
  }: {
    items: CartItem[];
    discount?: number;
    tax?: number;
    paymentMethod: string;
    prescriptionId?: string;
    notes?: string;
  } = req.body;

  if (!items || items.length === 0) {
    throw new AppError('Items tidak boleh kosong', 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let subtotal = 0;
    const saleItems: any[] = [];

    // Process each item with FEFO
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId).session(session);

      if (!medicine) {
        throw new AppError(`Obat dengan ID ${item.medicineId} tidak ditemukan`, 404);
      }

      // Check if prescription required
      if (medicine.isPrescriptionOnly && !prescriptionId) {
        throw new AppError(`Obat ${medicine.name} memerlukan resep dokter`, 400);
      }

      // Select batches using FEFO
      const selectedBatches = await selectBatchesFEFO(item.medicineId, item.qty);

      // Reduce stock and create sale items
      for (const batchSelection of selectedBatches) {
        // Update batch qty
        await Batch.findByIdAndUpdate(
          batchSelection.batchId,
          { $inc: { qtyOnHand: -batchSelection.qty } },
          { session }
        );

        // Create stock movement
        await StockMovement.create(
          [
            {
              type: 'SALE',
              medicineId: item.medicineId,
              batchId: batchSelection.batchId,
              qty: -batchSelection.qty,
              createdBy: req.userId,
            },
          ],
          { session }
        );

        const lineTotal = batchSelection.qty * item.price;
        subtotal += lineTotal;

        saleItems.push({
          medicineId: item.medicineId,
          batchId: batchSelection.batchId,
          qty: batchSelection.qty,
          price: item.price,
          lineTotal,
        });
      }
    }

    const total = subtotal - discount + tax;
    const invoiceNo = await generateInvoiceNo();

    // Create sale
    const sale = await Sale.create(
      [
        {
          invoiceNo,
          date: new Date(),
          cashierId: new mongoose.Types.ObjectId(req.userId!),
          prescriptionId: prescriptionId ? new mongoose.Types.ObjectId(prescriptionId) : undefined,
          subtotal,
          discount,
          tax,
          total,
          paymentMethod,
          status: 'PAID',
          notes,
        },
      ],
      { session }
    );

    const saleDoc = Array.isArray(sale) ? sale[0] : sale;

    // Create sale items
    const createdSaleItems = await SaleItem.create(
      saleItems.map(item => ({
        ...item,
        saleId: saleDoc._id,
      })),
      { session }
    );

    // Update prescription status if exists
    if (prescriptionId) {
      await Prescription.findByIdAndUpdate(
        new mongoose.Types.ObjectId(prescriptionId),
        { status: 'DISPENSED', dispensedAt: new Date() },
        { session }
      );
    }

    await createAuditLog('sale', (saleDoc._id as mongoose.Types.ObjectId).toString(), 'CREATE', req.userId!, undefined, saleDoc.toObject());

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Penjualan berhasil',
      data: {
        sale: saleDoc,
        items: createdSaleItems,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getSales = async (req: AuthRequest, res: Response): Promise<void> => {
  const { dateFrom, dateTo, status, cashierId } = req.query;

  const filter: any = {};

  if (dateFrom && dateTo) {
    filter.date = {
      $gte: new Date(dateFrom as string),
      $lte: new Date(dateTo as string),
    };
  }

  if (status) filter.status = status;
  if (cashierId) filter.cashierId = cashierId;

  const sales = await Sale.find(filter)
    .populate('cashierId', 'name')
    .sort({ date: -1 })
    .lean();

  res.json({
    success: true,
    data: sales,
  });
};

export const getSaleById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const [sale, items] = await Promise.all([
    Sale.findById(id).populate('cashierId', 'name email').lean(),
    SaleItem.find({ saleId: id }).populate('medicineId', 'name sku').lean(),
  ]);

  if (!sale) {
    throw new AppError('Penjualan tidak ditemukan', 404);
  }

  res.json({
    success: true,
    data: {
      ...sale,
      items,
    },
  });
};
