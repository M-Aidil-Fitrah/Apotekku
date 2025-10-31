import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { createSnapTransaction, verifyMidtransSignature } from '../utils/midtrans';

// Create Snap token for an order
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const customer = await Customer.findById(order.customerId).lean();

    const item_details = (order.items || []).map((it: any) => ({
      id: it.productId?.toString() || it.sku || 'item',
      price: Math.round(it.price || 0),
      quantity: Number(it.quantity || 1),
      name: it.name || 'Item',
    }));

    const payload = {
      transaction_details: {
        order_id: order._id.toString(),
        gross_amount: Math.round(order.total || 0),
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: customer?.name || 'Customer',
        email: customer?.email || undefined,
        phone: customer?.phone || undefined,
      },
      item_details,
    };

    const snapResponse: any = await createSnapTransaction(payload);

    return res.json({ success: true, data: snapResponse });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
  }
};

// Midtrans Notification (Webhook)
export const midtransNotification = async (req: Request, res: Response) => {
  try {
    const notification = req.body;
    const orderId = notification.order_id || notification.orderId || notification.transaction_id;
    const statusCode = notification.status_code || notification.statusCode || notification.status;
    const grossAmount = notification.gross_amount || notification.grossAmount || notification.amount;
    const signatureKey = notification.signature_key || notification.signatureKey;

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      // still accept but log
      return res.status(400).json({ success: false, message: 'Invalid notification payload' });
    }

    const verified = verifyMidtransSignature(orderId, String(statusCode), String(grossAmount), signatureKey);
    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const transactionStatus = notification.transaction_status || notification.transactionStatus || notification.status;

    // Map Midtrans transaction status to order payment status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      order.paymentStatus = 'paid';
      order.status = order.status === 'pending' ? 'confirmed' : order.status;
    } else if (transactionStatus === 'pending') {
      order.paymentStatus = 'pending';
    } else if (['deny', 'cancel', 'expire', 'failure'].includes(transactionStatus)) {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
    }

    // Save notification details lightly
    order.paymentNotification = notification;
    await order.save();

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error processing notification', error: error.message });
  }
};

export default { createPayment, midtransNotification };
