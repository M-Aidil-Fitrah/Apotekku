'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/Button';
import { usePaymentStore } from '@/lib/store/payment';
import { Loader2, CreditCard, Wallet, QrCode, Banknote, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
}

export const PaymentModal = ({ isOpen, onClose, orderId, amount }: PaymentModalProps) => {
  const { createPayment, isLoading, error } = usePaymentStore();

  if (!isOpen) return null;

  const handlePayment = async () => {
    const result = await createPayment(orderId);
    if (result) {
      // Redirect to Midtrans Snap payment page
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else if (result.token) {
        // Alternative: Use Snap.js if embedded
        // @ts-ignore
        if (window.snap) {
          // @ts-ignore
          window.snap.pay(result.token, {
            onSuccess: function(result: any) {
              console.log('Payment success:', result);
              window.location.href = `/marketplace/orders/success?order_id=${orderId}`;
            },
            onPending: function(result: any) {
              console.log('Payment pending:', result);
              window.location.href = `/marketplace/orders/${orderId}`;
            },
            onError: function(result: any) {
              console.log('Payment error:', result);
              alert('Payment failed. Please try again.');
            },
            onClose: function() {
              console.log('Payment popup closed');
            }
          });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Complete Your Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 py-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Order Total</span>
              <span className="text-2xl font-bold text-gray-900">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You will be redirected to a secure payment page where you can choose your preferred payment method:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Credit Card</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="text-sm">E-Wallet</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                <Banknote className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Bank Transfer</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                <QrCode className="w-5 h-5 text-orange-600" />
                <span className="text-sm">QRIS</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
