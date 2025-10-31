'use client';

import { useEffect } from 'react';
import { usePaymentStore } from '@/lib/store/payment';
import { Payment } from '@/lib/types';
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentStatusProps {
  orderId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const PaymentStatus = ({ 
  orderId, 
  autoRefresh = false, 
  refreshInterval = 5000 
}: PaymentStatusProps) => {
  const { currentPayment, isLoading, fetchPaymentByOrderId } = usePaymentStore();

  useEffect(() => {
    fetchPaymentByOrderId(orderId);

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchPaymentByOrderId(orderId);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [orderId, autoRefresh, refreshInterval]);

  if (isLoading && !currentPayment) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentPayment) {
    return null;
  }

  const getStatusConfig = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Payment Successful',
          description: 'Your payment has been confirmed',
        };
      case 'pending':
      case 'processing':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Pending',
          description: 'Waiting for payment confirmation',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Payment Failed',
          description: 'Your payment could not be processed',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Payment Cancelled',
          description: 'Payment has been cancelled',
        };
      case 'expired':
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Payment Expired',
          description: 'Payment link has expired',
        };
      case 'refunded':
        return {
          icon: AlertCircle,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          title: 'Payment Refunded',
          description: 'Payment has been refunded',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Unknown Status',
          description: 'Payment status unknown',
        };
    }
  };

  const config = getStatusConfig(currentPayment.status);
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-6`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${config.bgColor}`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.color} mb-1`}>
            {config.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {config.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">
                Rp {currentPayment.amount.toLocaleString('id-ID')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">
                {currentPayment.paymentMethod.replace('_', ' ')}
              </span>
            </div>
            
            {currentPayment.gatewayTransactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">
                  {currentPayment.gatewayTransactionId}
                </span>
              </div>
            )}
            
            {currentPayment.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Paid At:</span>
                <span className="font-medium">
                  {new Date(currentPayment.paidAt).toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
