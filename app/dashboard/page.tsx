'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/lib/store/auth';
import { ShoppingCart, Package, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuthStore();

  const stats = [
    {
      icon: ShoppingCart,
      label: 'Penjualan Hari Ini',
      value: 'Rp 0',
      color: 'bg-blue-500',
    },
    {
      icon: Package,
      label: 'Total Obat',
      value: '5',
      color: 'bg-green-500',
    },
    {
      icon: TrendingUp,
      label: 'Transaksi',
      value: '0',
      color: 'bg-purple-500',
    },
    {
      icon: AlertTriangle,
      label: 'Stok Rendah',
      value: '0',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat datang, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Ini adalah dashboard Apotekku Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/pos"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">POS</p>
            <p className="text-sm text-gray-500">Transaksi penjualan</p>
          </a>
          <a
            href="/medicines"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Kelola Obat</p>
            <p className="text-sm text-gray-500">Tambah & edit obat</p>
          </a>
          <a
            href="/reports"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Laporan</p>
            <p className="text-sm text-gray-500">Lihat laporan</p>
          </a>
        </div>
      </div>
    </div>
  );
}
