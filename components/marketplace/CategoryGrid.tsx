'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pill, Heart, Baby, Sparkles, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'obat-resep',
    name: 'Obat Resep',
    icon: Pill,
    description: 'Obat dengan resep dokter',
    color: 'emerald',
    count: 120,
  },
  {
    id: 'obat-bebas',
    name: 'Obat Bebas',
    icon: Shield,
    description: 'Obat tanpa resep',
    color: 'teal',
    count: 85,
  },
  {
    id: 'vitamin',
    name: 'Vitamin & Suplemen',
    icon: Sparkles,
    description: 'Kesehatan optimal',
    color: 'amber',
    count: 95,
  },
  {
    id: 'alat-kesehatan',
    name: 'Alat Kesehatan',
    icon: Activity,
    description: 'Peralatan medis',
    color: 'cyan',
    count: 60,
  },
  {
    id: 'perawatan',
    name: 'Perawatan Kulit',
    icon: Heart,
    description: 'Kecantikan & perawatan',
    color: 'pink',
    count: 75,
  },
  {
    id: 'ibu-anak',
    name: 'Ibu & Anak',
    icon: Baby,
    description: 'Produk ibu dan bayi',
    color: 'purple',
    count: 65,
  },
];

export const CategoryGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate cards on scroll
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, #10b981, transparent)',
            filter: 'blur(60px)',
          }}
        />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, #14b8a6, transparent)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6 px-6 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #10b98122, #14b8a622)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
              Kategori Produk
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Temukan Yang Anda Butuhkan
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Jelajahi berbagai kategori produk kesehatan berkualitas dengan harga terjangkau
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <Link href={`/marketplace/products?category=${category.id}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-full"
                  >
                    {/* Glow Effect */}
                    <div
                      className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, var(--${category.color}-400), var(--${category.color}-600))`,
                      }}
                    />

                    {/* Card */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full">
                      {/* Icon */}
                      <div className="mb-6">
                        <div
                          className="inline-block p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                          style={{
                            background: `linear-gradient(135deg, var(--${category.color}-50), var(--${category.color}-100))`,
                          }}
                        >
                          <Icon className={`w-8 h-8 text-${category.color}-600`} />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {category.description}
                      </p>

                      {/* Count Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {category.count}+ Produk
                        </span>
                        <motion.div
                          className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-2 transition-transform"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </motion.div>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div
                          className="absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                          style={{
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/marketplace/products">
            <Button
              variant="primary"
              size="lg"
              className="group"
              style={{
                backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
              }}
            >
              <span>Lihat Semua Produk</span>
              <motion.svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
