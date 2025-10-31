'use client';

import { Suspense } from 'react';
import OrdersContent from './OrdersContent';

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Memuat pesanan...</p>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}

