'use client';

import { motion } from 'framer-motion';
import { Pill, Clock, Shield, Zap, Heart, Users } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

const features = [
  {
    icon: Pill,
    title: 'Obat Lengkap',
    description: 'Lebih dari 5000+ jenis obat dan produk kesehatan tersedia dengan stok terjamin',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  {
    icon: Clock,
    title: 'Layanan 24/7',
    description: 'Apotek buka setiap hari dengan sistem otomatis untuk kemudahan akses',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    icon: Shield,
    title: 'Terjamin BPOM',
    description: 'Semua produk terdaftar resmi dan memiliki sertifikat dari BPOM Indonesia',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50 dark:bg-violet-950',
  },
  {
    icon: Zap,
    title: 'Proses Cepat',
    description: 'Sistem kasir dan inventori terintegrasi untuk pelayanan super cepat',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
  },
  {
    icon: Heart,
    title: 'Konsultasi Gratis',
    description: 'Apoteker profesional siap membantu konsultasi obat tanpa biaya tambahan',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
  },
  {
    icon: Users,
    title: 'Manajemen Modern',
    description: 'Dashboard lengkap untuk mengelola stok, penjualan, dan laporan keuangan',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const FeaturesSection = () => {
  return (
    <section className="relative py-24 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle
          subtitle="Fitur Unggulan"
          title="Kenapa Memilih Apotekku?"
          description="Platform manajemen apotek modern yang dirancang khusus untuk meningkatkan efisiensi dan kualitas pelayanan kesehatan"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Gradient Background on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div className={`relative w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 rounded-xl`} />
                  <feature.icon className={`w-8 h-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full blur-2xl`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.4} className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <span>Lihat Semua Fitur</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
