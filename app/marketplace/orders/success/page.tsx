'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/landing/Footer';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <CartDrawer />

      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-32 h-32 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <CheckCircle className="w-20 h-20 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Pesanan Berhasil Dibuat!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Terima kasih telah berbelanja di Apotekku. Pesanan Anda sedang diproses dan akan segera dikirim.
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Package className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nomor Pesanan</h2>
              </div>
              <p className="text-3xl font-bold text-emerald-600 tracking-wider">
                #APO-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Simpan nomor ini untuk tracking pesanan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/marketplace/orders" className="block">
                <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>Lihat Pesanan Saya</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/marketplace/products" className="block">
                <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>Kembali Belanja</span>
                </Button>
              </Link>
            </div>

            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Apa Selanjutnya?</h3>
              <ul className="text-left space-y-2 text-sm text-blue-800 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Kami akan mengirimkan konfirmasi pesanan via email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Pesanan akan diproses dalam 1-2 hari kerja</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Estimasi pengiriman 2-5 hari kerja</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Anda dapat melacak status pesanan di halaman "Pesanan Saya"</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

