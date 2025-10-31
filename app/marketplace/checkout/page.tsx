'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { Footer } from '@/components/landing/Footer';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { useCart } from '@/lib/store/marketplaceCart';
import { useAuthStore } from '@/lib/store/auth';
import { usePaymentStore } from '@/lib/store/payment';
import { Button } from '@/components/shared/Button';
import { MapPin, Phone, User, MessageSquare, CreditCard, Package, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createOrder, CreateOrderData } from '@/lib/api/order';
import { getCustomerProfile } from '@/lib/api/customer';

declare global {
  interface Window {
    snap?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuthStore();
  const { createPayment } = usePaymentStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [shippingCost] = useState(15000);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'credit_card' as 'cod' | 'transfer' | 'ewallet' | 'credit_card',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login?redirect=/marketplace/checkout');
      return;
    }
    loadCustomerData();
  }, [isAuthenticated]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadCustomerData = async () => {
    try {
      const response = await getCustomerProfile();
      const customer = response.data;
      const defaultAddress = customer.addresses?.find(addr => addr.isDefault) || customer.addresses?.[0];
      
      setFormData(prev => ({
        ...prev,
        recipientName: customer.name || '',
        phone: customer.phone || '',
        addressLine1: defaultAddress?.addressLine1 || '',
        addressLine2: defaultAddress?.addressLine2 || '',
        city: defaultAddress?.city || '',
        province: defaultAddress?.province || '',
        postalCode: defaultAddress?.postalCode || '',
      }));
    } catch (error) {
      console.error('Failed to load customer data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getSubtotal();
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData: CreateOrderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          recipientName: formData.recipientName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          notes: formData.notes,
        },
        paymentMethod: formData.paymentMethod,
        shippingCost,
        customerNotes: formData.notes,
      };

      const orderResponse = await createOrder(orderData);
      const order = orderResponse.data;

      toast.success('Pesanan berhasil dibuat!');

      if (formData.paymentMethod !== 'cod') {
        const paymentResponse = await createPayment(order._id);
        
        if (paymentResponse && paymentResponse.token && window.snap) {
          window.snap.pay(paymentResponse.token, {
            onSuccess: function(result: any) {
              clearCart();
              toast.success('Pembayaran berhasil!');
              router.push(`/marketplace/orders?orderId=${order._id}`);
            },
            onPending: function(result: any) {
              clearCart();
              toast.success('Menunggu pembayaran...');
              router.push(`/marketplace/orders?orderId=${order._id}`);
            },
            onError: function(result: any) {
              toast.error('Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: function() {
              toast.info('Pembayaran dibatalkan');
              router.push(`/marketplace/orders?orderId=${order._id}`);
            }
          });
        } else if (paymentResponse && paymentResponse.redirect_url) {
          clearCart();
          window.location.href = paymentResponse.redirect_url;
        }
      } else {
        clearCart();
        router.push(`/marketplace/orders?orderId=${order._id}`);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Gagal memproses pesanan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <MarketplaceNavbar />
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Keranjang Kosong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Tambahkan produk ke keranjang terlebih dahulu
            </p>
            <Link href="/marketplace/products">
              <Button variant="primary">Mulai Belanja</Button>
            </Link>
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
          <Link href="/marketplace/products" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali Belanja</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Checkout
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Lengkapi data pengiriman dan metode pembayaran
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Alamat Pengiriman
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nama Penerima <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                        required
                        disabled={loadingProfile}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                        required
                        disabled={loadingProfile}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                      required
                      disabled={loadingProfile}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Jalan, nomor rumah, RT/RW"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                      required
                      disabled={loadingProfile}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Detail Alamat (Opsional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Patokan, blok, dll"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                      disabled={loadingProfile}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Kota/Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                      required
                      disabled={loadingProfile}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                      required
                      disabled={loadingProfile}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Catatan Pengiriman (Opsional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Contoh: Tolong kirim pagi hari"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Metode Pembayaran
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { value: 'credit_card', label: 'Kartu Kredit/Debit', desc: 'Visa, Mastercard, JCB' },
                    { value: 'ewallet', label: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay' },
                    { value: 'transfer', label: 'Transfer Bank', desc: 'BCA, BNI, Mandiri, BRI' },
                    { value: 'cod', label: 'Bayar di Tempat (COD)', desc: 'Bayar saat produk diterima' },
                  ].map((method) => (
                    <label key={method.value} className="flex items-center p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-slate-900 dark:text-white">{method.label}</div>
                        <div className="text-sm text-slate-500">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              {items.some(item => item.requiresPrescription) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-900 dark:text-amber-200 mb-1">
                        Resep Dokter Diperlukan
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Beberapa produk memerlukan resep dokter. Tim kami akan menghubungi Anda untuk verifikasi.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                      <div className="font-medium text-slate-900 dark:text-white">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({items.length} produk)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Ongkir</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>PPN (11%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isProcessing || loadingProfile} size="lg">
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    `Bayar ${formatPrice(total)}`
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Pembayaran aman dengan Midtrans</span>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
