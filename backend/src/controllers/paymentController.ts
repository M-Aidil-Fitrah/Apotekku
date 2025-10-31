import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { Payment } from '../models/Payment';
import { Transaction } from '../models/Transaction';
import { createSnapTransaction, verifyMidtransSignature } from '../utils/midtrans';
import { AuthRequest } from '../middleware/auth';

// Create Snap token for an order
export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const customerId = req.user?.id;
    
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Verify order belongs to customer
    if (customerId && order.customerId.toString() !== customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
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
    
    // Create Payment record
    const payment = await Payment.create({
      orderId: order._id,
      customerId: order.customerId,
      amount: order.total,
      currency: 'IDR',
      paymentMethod: order.paymentMethod,
      paymentGateway: 'midtrans',
      status: 'pending',
      gatewayOrderId: order._id.toString(),
      snapToken: snapResponse.token,
      redirectUrl: snapResponse.redirect_url,
      gatewayResponse: snapResponse,
    });
    
    // Update order with payment reference
    await Order.findByIdAndUpdate(orderId, { paymentId: payment._id });
    
    // Create initial transaction record
    const transaction = await Transaction.create({
      orderId: order._id,
      paymentId: payment._id,
      customerId: order.customerId,
      type: 'payment',
      amount: order.total,
      currency: 'IDR',
      status: 'pending',
      description: `Payment for order ${order.orderNumber}`,
    });
    
    // Add transaction to order
    await Order.findByIdAndUpdate(orderId, { 
      $push: { transactionIds: transaction._id } 
    });

    return res.json({ 
      success: true, 
      data: {
        token: snapResponse.token,
        redirect_url: snapResponse.redirect_url,
        paymentId: payment._id,
        transactionId: transaction._id,
      }
    });
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
    
    // Find payment record
    const payment = await Payment.findOne({ orderId: order._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const transactionStatus = notification.transaction_status || notification.transactionStatus || notification.status;
    const transactionId = notification.transaction_id;
    const fraudStatus = notification.fraud_status;

    // Update Payment record
    payment.gatewayTransactionId = transactionId;
    payment.notificationPayload = notification;
    payment.signatureVerified = true;
    payment.fraudStatus = fraudStatus;

    // Map Midtrans transaction status to payment status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      payment.status = 'paid';
      payment.paidAt = new Date();
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
      order.status = order.status === 'pending' ? 'confirmed' : order.status;
      
      // Update transaction to completed
      await Transaction.findOneAndUpdate(
        { paymentId: payment._id },
        { 
          status: 'completed', 
          processedAt: new Date(),
          reference: transactionId,
        }
      );
    } else if (transactionStatus === 'pending') {
      payment.status = 'pending';
      order.paymentStatus = 'pending';
    } else if (['deny', 'cancel', 'expire'].includes(transactionStatus)) {
      payment.status = transactionStatus === 'expire' ? 'expired' : 'cancelled';
      payment.cancelledAt = new Date();
      if (transactionStatus === 'expire') {
        payment.expiredAt = new Date();
      }
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      
      // Update transaction to failed
      await Transaction.findOneAndUpdate(
        { paymentId: payment._id },
        { 
          status: 'failed', 
          failedAt: new Date(),
          reference: transactionId,
        }
      );
    } else if (transactionStatus === 'failure') {
      payment.status = 'failed';
      order.paymentStatus = 'failed';
      
      // Update transaction to failed
      await Transaction.findOneAndUpdate(
        { paymentId: payment._id },
        { 
          status: 'failed', 
          failedAt: new Date(),
          reference: transactionId,
        }
      );
    }

    await payment.save();
    await order.save();

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error processing notification', error: error.message });
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user?.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Verify ownership for customers
    if (customerId && order.customerId.toString() !== customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const payment = await Payment.findOne({ orderId }).lean();
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    return res.json({ success: true, data: payment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching payment', error: error.message });
  }
};

// Get payment status
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;
    const customerId = req.user?.id;

    const payment = await Payment.findById(paymentId).populate('orderId').lean();
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    // Verify ownership for customers
    if (customerId && payment.customerId.toString() !== customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({ success: true, data: payment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching payment status', error: error.message });
  }
};

// Get transaction history for an order
export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user?.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Verify ownership for customers
    if (customerId && order.customerId.toString() !== customerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const transactions = await Transaction.find({ orderId })
      .sort('-createdAt')
      .lean();

    return res.json({ success: true, data: transactions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching transactions', error: error.message });
  }
};

export default { createPayment, midtransNotification, getPaymentByOrderId, getPaymentStatus, getTransactionHistory };
