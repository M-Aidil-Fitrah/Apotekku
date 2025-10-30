import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Sale } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { Batch } from '../models/Batch';
import { Medicine } from '../models/Medicine';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/reports/sales-summary?range=day|week|month&date=YYYY-MM-DD
 * Ringkasan penjualan berdasarkan periode
 */
export const getSalesSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  const { range = 'day', date } = req.query;
  
  const targetDate = date ? new Date(date as string) : new Date();
  let startDate: Date;
  let endDate: Date = new Date(targetDate);
  endDate.setHours(23, 59, 59, 999);

  switch (range) {
    case 'day':
      startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(targetDate);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      throw new AppError('Range tidak valid. Gunakan: day, week, atau month', 400);
  }

  const sales = await Sale.find({
    date: { $gte: startDate, $lte: endDate },
    status: 'PAID',
  });

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDiscount = sales.reduce((sum, sale) => sum + (sale.discount || 0), 0);
  const totalTax = sales.reduce((sum, sale) => sum + (sale.tax || 0), 0);

  // Breakdown by payment method
  const paymentMethodBreakdown = sales.reduce((acc: any, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      range,
      startDate,
      endDate,
      totalSales,
      totalRevenue,
      totalDiscount,
      totalTax,
      paymentMethodBreakdown,
    },
  });
};

/**
 * GET /api/reports/expiry?days=30
 * Daftar batch yang akan kadaluarsa dalam X hari
 */
export const getExpiryReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const days = parseInt(req.query.days as string) || 30;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + days);

  const batches = await Batch.find({
    expDate: { $gte: today, $lte: futureDate },
    qtyOnHand: { $gt: 0 },
  })
    .populate('medicineId', 'name sku category sellingPrice')
    .populate('supplierId', 'name')
    .sort({ expDate: 1 })
    .lean();

  const totalValue = batches.reduce((sum, batch) => {
    return sum + (batch.buyPrice * batch.qtyOnHand);
  }, 0);

  res.json({
    success: true,
    data: {
      days,
      totalBatches: batches.length,
      totalValue,
      batches,
    },
  });
};

/**
 * GET /api/reports/low-stock
 * Obat dengan stok di bawah minimum
 */
export const getLowStockReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const medicines = await Medicine.find().lean();

  const lowStockItems = [];

  for (const medicine of medicines) {
    const batches = await Batch.find({
      medicineId: medicine._id,
      qtyOnHand: { $gt: 0 },
    }).lean();

    const totalStock = batches.reduce((sum, batch) => sum + batch.qtyOnHand, 0);

    if (totalStock < medicine.minStock) {
      lowStockItems.push({
        medicine: {
          _id: medicine._id,
          name: medicine.name,
          sku: medicine.sku,
          category: medicine.category,
          minStock: medicine.minStock,
        },
        currentStock: totalStock,
        difference: medicine.minStock - totalStock,
        batches,
      });
    }
  }

  // Sort by most critical (largest difference)
  lowStockItems.sort((a, b) => b.difference - a.difference);

  res.json({
    success: true,
    data: {
      totalItems: lowStockItems.length,
      items: lowStockItems,
    },
  });
};

/**
 * GET /api/reports/top-selling?limit=10&startDate=&endDate=
 * Obat terlaris berdasarkan periode
 */
export const getTopSellingReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string) || 10;
  const startDate = req.query.startDate 
    ? new Date(req.query.startDate as string)
    : new Date(new Date().setDate(new Date().getDate() - 30)); // Default 30 hari terakhir
  
  const endDate = req.query.endDate 
    ? new Date(req.query.endDate as string)
    : new Date();

  // Get sales in date range
  const sales = await Sale.find({
    date: { $gte: startDate, $lte: endDate },
    status: 'PAID',
  }).select('_id');

  const saleIds = sales.map(s => s._id);

  // Aggregate sale items
  const topSelling = await SaleItem.aggregate([
    {
      $match: {
        saleId: { $in: saleIds },
      },
    },
    {
      $group: {
        _id: '$medicineId',
        totalQty: { $sum: '$qty' },
        totalRevenue: { $sum: '$lineTotal' },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalQty: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'medicines',
        localField: '_id',
        foreignField: '_id',
        as: 'medicine',
      },
    },
    {
      $unwind: '$medicine',
    },
    {
      $project: {
        _id: 0,
        medicineId: '$_id',
        name: '$medicine.name',
        sku: '$medicine.sku',
        category: '$medicine.category',
        totalQty: 1,
        totalRevenue: 1,
        transactionCount: 1,
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      startDate,
      endDate,
      limit,
      items: topSelling,
    },
  });
};
