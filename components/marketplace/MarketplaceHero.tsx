'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { Search, ShoppingBag, Package, Shield, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';

export const MarketplaceHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  useEffect(() => {
    if (!heroRef.current) return;

    // Floating animation for decorative elements only
    const floatingElements = heroRef.current.querySelectorAll('.floating-icon');
    floatingElements.forEach((el, index) => {
      gsap.to(el, {
        y: `${(index + 1) * 15}`,
        rotation: index % 2 === 0 ? 10 : -10,
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { icon: Package, value: '500+', label: 'Produk Tersedia', color: 'emerald' },
    { icon: Shield, value: '100%', label: 'Produk Original', color: 'teal' },
    { icon: Star, value: '4.9', label: 'Rating Toko', color: 'amber' },
    { icon: TrendingUp, value: '10K+', label: 'Pelanggan Puas', color: 'cyan' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950 pt-20"
    >
      {/* Animated Background */}
      <motion.div
        style={{
          y,
          opacity,
          backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6, #06b6d4)',
          backgroundSize: '200% 100%',
        }}
        className="absolute inset-0 opacity-20"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="floating-icon absolute top-20 left-[10%] p-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #10b98144, #14b8a644)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <motion.div
          className="floating-icon absolute top-40 right-[15%] p-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #14b8a644, #06b6d444)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </motion.div>
        <motion.div
          className="floating-icon absolute bottom-40 left-[20%] p-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #f59e0b44, #f97316 44)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Star className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </motion.div>
        <motion.div
          className="floating-icon absolute bottom-32 right-[10%] p-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #06b6d444, #3b82f644)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ShoppingBag className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10" ref={heroRef}>
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #10b98122, #14b8a622)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Marketplace Produk Kesehatan
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-slate-900 dark:text-white mb-2">
                Belanja Obat &
              </span>
              <span className="block text-white drop-shadow-lg">
                Produk Kesehatan
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Dapatkan produk kesehatan original dengan harga terbaik. Konsultasi gratis dengan apoteker profesional.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-2xl opacity-50 blur-lg group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(to right, #10b981, #14b8a6, #06b6d4)',
                }}
              />
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari obat, vitamin, atau produk kesehatan..."
                  className="flex-1 px-8 py-5 text-lg bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="m-2 flex items-center gap-2"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
                  }}
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Cari</span>
                </Button>
              </div>
            </div>
          </motion.form>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.5 + index * 0.1,
                  ease: 'easeOut'
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div
                  className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, var(--${stat.color}-500), var(--${stat.color}-600))`,
                  }}
                />
                <div className="relative bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="p-3 rounded-lg mb-3"
                      style={{
                        background: `linear-gradient(135deg, var(--${stat.color}-50), var(--${stat.color}-100))`,
                      }}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            className="fill-white dark:fill-slate-900"
          />
        </svg>
      </div>
    </section>
  );
};
