'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Mock data - akan diganti dengan API call
const featuredProducts = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    slug: 'paracetamol-500mg',
    category: 'Obat Bebas',
    price: 15000,
    originalPrice: 20000,
    rating: 4.8,
    reviews: 124,
    image: '/assets/products/paracetamol.jpg',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    slug: 'vitamin-c-1000mg',
    category: 'Vitamin & Suplemen',
    price: 85000,
    originalPrice: 100000,
    rating: 4.9,
    reviews: 256,
    image: '/assets/products/vitamin-c.jpg',
    badge: 'Popular',
    inStock: true,
  },
  {
    id: '3',
    name: 'Masker Medis 3 Ply',
    slug: 'masker-medis-3-ply',
    category: 'Alat Kesehatan',
    price: 45000,
    originalPrice: null,
    rating: 4.7,
    reviews: 89,
    image: '/assets/products/masker.jpg',
    badge: null,
    inStock: true,
  },
  {
    id: '4',
    name: 'Hand Sanitizer 100ml',
    slug: 'hand-sanitizer-100ml',
    category: 'Alat Kesehatan',
    price: 25000,
    originalPrice: 30000,
    rating: 4.6,
    reviews: 78,
    image: '/assets/products/sanitizer.jpg',
    badge: 'Promo',
    inStock: true,
  },
];

export const FeaturedProducts = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate cards on scroll with 3D effect
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            rotationX: -30,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.15,
          }
        );
      }
    });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-slate-50 dark:bg-slate-800 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)',
            backgroundSize: '40px 40px',
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
            className="inline-block mb-4 px-6 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #10b98122, #14b8a622)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
              Produk Unggulan
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Produk Terlaris Kami
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Dipilih dengan cermat oleh apoteker profesional kami
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 h-full flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {/* Placeholder for image */}
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    💊
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                        }}
                      >
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg"
                    >
                      <Eye className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full shadow-lg text-white"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                    {product.category}
                  </div>

                  <Link href={`/marketplace/products/${product.slug}`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="mb-3">
                      {product.originalPrice && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/marketplace/products">
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-400 dark:hover:text-slate-900"
            >
              <span>Jelajahi Semua Produk</span>
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
