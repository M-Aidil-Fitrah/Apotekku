'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { medicineService } from '@/lib/api/medicine';
import { saleService } from '@/lib/api/sale';
import { Medicine, Batch, PaymentMethod } from '@/lib/types';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
  Check,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function POSPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'kasir']}>
      <DashboardLayout>
        <POSContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function POSContent() {
  const { user } = useAuthStore();
  const {
    items,
    subtotal,
    discount,
    tax,
    total,
    paymentMethod,
    addItem,
    removeItem,
    updateQty,
    setDiscount,
    setTax,
    setPaymentMethod,
    clearCart,
  } = useCartStore();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastInvoiceNo, setLastInvoiceNo] = useState('');

  // Search medicines
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMedicines([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await medicineService.getAll({
        search: searchQuery,
        limit: 10,
      });
      setMedicines(response.data);
    } catch (error) {
      console.error('Error searching medicines:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Select medicine and load batches
  const handleSelectMedicine = async (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsLoadingBatches(true);

    try {
      const response = await medicineService.getBatches(medicine._id);
      // Sort by expiry date (FEFO)
      const sortedBatches = response.data.sort(
        (a, b) => new Date(a.expDate).getTime() - new Date(b.expDate).getTime()
      );
      setBatches(sortedBatches.filter((b) => b.qtyOnHand > 0));
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setIsLoadingBatches(false);
    }
  };

  // Add to cart
  const handleAddToCart = (batch: Batch) => {
    if (!selectedMedicine) return;

    addItem(selectedMedicine, batch, 1);
    setSelectedMedicine(null);
    setBatches([]);
    setSearchQuery('');
    setMedicines([]);
  };

  // Process payment
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const saleData = {
        items: items.map((item) => ({
          medicineId: item.medicine._id,
          qty: item.qty,
        })),
        discount,
        tax,
        paymentMethod,
      };

      const response = await saleService.create(saleData);
      
      setLastInvoiceNo(response.data.invoiceNo);
      setShowSuccess(true);
      clearCart();

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal memproses transaksi');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods: { value: PaymentMethod; label: string; icon: any }[] = [
    { value: 'CASH', label: 'Tunai', icon: Banknote },
    { value: 'DEBIT', label: 'Debit', icon: CreditCard },
    { value: 'CREDIT', label: 'Credit', icon: CreditCard },
    { value: 'QRIS', label: 'QRIS', icon: QrCode },
    { value: 'TRANSFER', label: 'Transfer', icon: CreditCard },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Left Side - Product Selection */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cari Obat</h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari obat berdasarkan nama atau SKU..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Medicine List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {isSearching ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            </div>
          ) : medicines.length > 0 ? (
            medicines.map((medicine) => (
              <button
                key={medicine._id}
                onClick={() => handleSelectMedicine(medicine)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {medicine.sku}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                        {medicine.category}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {medicine.dosageForm}
                      </span>
                      {medicine.isPrescriptionOnly && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                          Resep
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      Rp {medicine.sellingPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada obat ditemukan</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>Ketik untuk mencari obat</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Keranjang ({items.length})
          </h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Kosongkan
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.medicine._id}-${item.batch._id}`} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.medicine.name}</h4>
                    <p className="text-xs text-gray-500">Batch: {item.batch.batchNo}</p>
                    <p className="text-xs text-gray-500">
                      Exp: {format(new Date(item.batch.expDate), 'dd MMM yyyy', { locale: id })}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.medicine._id, item.batch._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQty(item.medicine._id, item.batch._id, Math.max(1, item.qty - 1))}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.qty}</span>
                    <button
                      onClick={() =>
                        updateQty(
                          item.medicine._id,
                          item.batch._id,
                          Math.min(item.batch.qtyOnHand, item.qty + 1)
                        )
                      }
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                      disabled={item.qty >= item.batch.qtyOnHand}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-semibold text-blue-600">
                    Rp {item.lineTotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Diskon</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                min="0"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Pajak</span>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                min="0"
              />
            </div>

            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-3 border rounded-lg flex flex-col items-center justify-center transition ${
                        paymentMethod === method.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Bayar Sekarang
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Batch Selection Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedMedicine.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Pilih batch yang akan dijual (FEFO)</p>
              </div>
              <button
                onClick={() => {
                  setSelectedMedicine(null);
                  setBatches([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoadingBatches ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                </div>
              ) : batches.length > 0 ? (
                <div className="space-y-3">
                  {batches.map((batch, index) => {
                    const daysToExpiry = Math.ceil(
                      (new Date(batch.expDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isNearExpiry = daysToExpiry <= 60;

                    return (
                      <button
                        key={batch._id}
                        onClick={() => handleAddToCart(batch)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">Batch: {batch.batchNo}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Exp: {format(new Date(batch.expDate), 'dd MMMM yyyy', { locale: id })}
                            </p>
                            {isNearExpiry && (
                              <div className="flex items-center mt-1 text-orange-600 text-sm">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                <span>Mendekati kadaluarsa ({daysToExpiry} hari)</span>
                              </div>
                            )}
                            {index === 0 && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                Recommended (FEFO)
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Stok tersedia</p>
                            <p className="text-lg font-bold text-blue-600">{batch.qtyOnHand}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Tidak ada stok tersedia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Transaksi Berhasil!</h3>
            <p className="text-gray-600 mb-4">
              Invoice: <span className="font-semibold">{lastInvoiceNo}</span>
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
