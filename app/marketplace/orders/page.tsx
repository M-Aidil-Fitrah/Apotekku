'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/landing/Footer';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'APO-X7K9M2P1Q',
    date: '2024-01-20',
    status: 'delivered' as const,
    items: [
      { name: 'Paracetamol 500mg', quantity: 2, price: 15000, image: '💊' },
      { name: 'Vitamin C 1000mg', quantity: 1, price: 85000, image: '🌿' },
    ],
    total: 115000,
    shippingAddress: 'Jl. Sudirman No. 123, Jakarta Selatan',
  },
  {
    id: '2',
    orderNumber: 'APO-B3N8L5V2W',
    date: '2024-01-18',
    status: 'shipped' as const,
    items: [
      { name: 'Antasida Tablet', quantity: 3, price: 12000, image: '💊' },
    ],
    total: 36000,
    shippingAddress: 'Jl. Gatot Subroto No. 45, Jakarta Pusat',
  },
  {
    id: '3',
    orderNumber: 'APO-F9R4T6Y8U',
    date: '2024-01-15',
    status: 'processing' as const,
    items: [
      { name: 'Betadine Solution', quantity: 1, price: 28000, image: '🧴' },
      { name: 'Plester Luka', quantity: 2, price: 15000, image: '🩹' },
    ],
    total: 58000,
    shippingAddress: 'Jl. Thamrin No. 78, Jakarta Pusat',
  },
  {
    id: '4',
    orderNumber: 'APO-C5M7N2K9L',
    date: '2024-01-10',
    status: 'cancelled' as const,
    items: [
      { name: 'Ibuprofen 400mg', quantity: 1, price: 18000, image: '💊' },
    ],
    total: 18000,
    shippingAddress: 'Jl. Kuningan No. 90, Jakarta Selatan',
  },
];

const statusConfig = {
  pending: {
    label: 'Menunggu Konfirmasi',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100 dark:bg-yellow-900',
  },
  processing: {
    label: 'Diproses',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900',
  },
  shipped: {
    label: 'Dikirim',
    icon: Truck,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900',
  },
  delivered: {
    label: 'Selesai',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900',
  },
  cancelled: {
    label: 'Dibatalkan',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900',
  },
};

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filteredOrders =
    selectedStatus === 'all'
      ? mockOrders
      : mockOrders.filter((order) => order.status === selectedStatus);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <CartDrawer />

      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Pesanan Saya
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Kelola dan lacak semua pesanan Anda
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedStatus === 'all'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Semua
            </button>
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    selectedStatus === key
                      ? `${config.bg} ${config.color} shadow-lg`
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Tidak Ada Pesanan
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Belum ada pesanan dengan status ini
            </p>
            <Link href="/marketplace/products">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Mulai Belanja
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const config = statusConfig[order.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {order.orderNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          Dipesan pada {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">Total Belanja</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-2xl">
                            {item.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-white dark:bg-slate-800 rounded-lg">
                      <Package className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                          Alamat Pengiriman
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="p-6 flex flex-wrap gap-3 justify-end">
                    <Link href={`/marketplace/orders/${order.id}`}>
                      <button className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Detail Pesanan
                      </button>
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                        Beli Lagi
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
