import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Customer } from '../models/Customer';

// Customer: Create order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id; // From auth middleware
    const {
      items,
      shippingAddress,
      paymentMethod,
      shippingCost = 0,
      customerNotes,
    } = req.body;

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    let prescriptionRequired = false;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;

        if (product.requiresPrescription) {
          prescriptionRequired = true;
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
          image: product.mainImage,
        });
      }
    }

    const tax = subtotal * 0.11; // 11% PPN
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      customerId,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      prescriptionRequired,
      customerNotes,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    // Update product stock and sold count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stockQuantity: -item.quantity,
          soldCount: item.quantity,
        },
      });
    }

    // Update customer stats
    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalOrders: 1,
        totalSpent: total,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

// Customer: Get my orders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    const query: any = { customerId };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// Customer: Get order detail
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    const order = await Order.findOne({ _id: id, customerId }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

// Customer: Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    const order = await Order.findOne({ _id: id, customerId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stockQuantity: item.quantity,
          soldCount: -item.quantity,
        },
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message,
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.recipientName': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customerId', 'name email phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, trackingNumber } = req.body;

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            note,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

// Admin: Verify prescription
export const verifyPrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const userId = req.user?.id;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        prescriptionVerified: verified,
        verifiedBy: verified ? userId : undefined,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: `Prescription ${verified ? 'verified' : 'rejected'} successfully`,
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error verifying prescription',
      error: error.message,
    });
  }
};
