'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { Footer } from '@/components/landing/Footer';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMyOrders, Order } from '@/lib/api/order';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login?redirect=/marketplace/orders');
      return;
    }

    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getMyOrders(1, 20);
      setOrders(response.data);

      if (orderId) {
        const order = response.data.find(o => o._id === orderId);
        if (order) setSelectedOrder(order);
      }
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'Menunggu Konfirmasi', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20', icon: Clock },
      confirmed: { label: 'Dikonfirmasi', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20', icon: CheckCircle },
      processing: { label: 'Diproses', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20', icon: Package },
      shipped: { label: 'Dikirim', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20', icon: Truck },
      delivered: { label: 'Selesai', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20', icon: CheckCircle },
      cancelled: { label: 'Dibatalkan', color: 'text-red-600 bg-red-100 dark:bg-red-900/20', icon: XCircle },
      refunded: { label: 'Dikembalikan', color: 'text-slate-600 bg-slate-100 dark:bg-slate-900/20', icon: RefreshCw },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      pending: { label: 'Menunggu Pembayaran', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20' },
      paid: { label: 'Lunas', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20' },
      failed: { label: 'Gagal', color: 'text-red-600 bg-red-100 dark:bg-red-900/20' },
      refunded: { label: 'Dikembalikan', color: 'text-slate-600 bg-slate-100 dark:bg-slate-900/20' },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <MarketplaceNavbar />
        <div className="container mx-auto px-4 py-32">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Memuat pesanan...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <MarketplaceNavbar />
      <CartDrawer />
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Pesanan Saya</h1>
          <p className="text-slate-600 dark:text-slate-400">Lacak dan kelola pesanan Anda</p>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-md mx-auto text-center py-12"
          >
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Belum Ada Pesanan</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Mulai belanja dan pesanan Anda akan muncul di sini
            </p>
            <Link href="/marketplace/products">
              <Button>Mulai Belanja</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Order #{order.orderNumber}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatPrice(order.total)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${paymentConfig.color} mt-1`}>
                        {paymentConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Alamat Pengiriman:
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {order.shippingAddress.recipientName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Item ({order.items.length} produk):
                        </p>
                        <ul className="text-sm text-slate-900 dark:text-white space-y-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <li key={idx}>
                              {item.name} x{item.quantity}
                            </li>
                          ))}
                          {order.items.length > 2 && (
                            <li className="text-slate-500">
                              +{order.items.length - 2} produk lainnya
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>
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
