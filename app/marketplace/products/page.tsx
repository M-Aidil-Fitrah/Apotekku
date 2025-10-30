'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Grid3x3,
  LayoutList,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Navbar } from '@/components/shared/Navbar';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

// Mock products data - akan diganti dengan API
const mockProducts = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    slug: 'paracetamol-500mg',
    category: 'Obat Bebas',
    price: 15000,
    originalPrice: 20000,
    rating: 4.8,
    reviews: 124,
    image: '💊',
    inStock: true,
    soldCount: 450,
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
    image: '🌿',
    inStock: true,
    soldCount: 780,
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
    image: '😷',
    inStock: true,
    soldCount: 320,
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
    image: '🧴',
    inStock: true,
    soldCount: 560,
  },
  {
    id: '5',
    name: 'Vitamin D3 1000 IU',
    slug: 'vitamin-d3-1000-iu',
    category: 'Vitamin & Suplemen',
    price: 95000,
    originalPrice: null,
    rating: 4.9,
    reviews: 167,
    image: '☀️',
    inStock: true,
    soldCount: 290,
  },
  {
    id: '6',
    name: 'Ibuprofen 400mg',
    slug: 'ibuprofen-400mg',
    category: 'Obat Bebas',
    price: 18000,
    originalPrice: 25000,
    rating: 4.7,
    reviews: 143,
    image: '💊',
    inStock: true,
    soldCount: 410,
  },
  {
    id: '7',
    name: 'Multivitamin Complete',
    slug: 'multivitamin-complete',
    category: 'Vitamin & Suplemen',
    price: 120000,
    originalPrice: 150000,
    rating: 4.8,
    reviews: 201,
    image: '💪',
    inStock: true,
    soldCount: 670,
  },
  {
    id: '8',
    name: 'Thermometer Digital',
    slug: 'thermometer-digital',
    category: 'Alat Kesehatan',
    price: 75000,
    originalPrice: null,
    rating: 4.6,
    reviews: 92,
    image: '🌡️',
    inStock: true,
    soldCount: 180,
  },
];

const categories = [
  'Semua Kategori',
  'Obat Bebas',
  'Obat Resep',
  'Vitamin & Suplemen',
  'Alat Kesehatan',
  'Perawatan Kulit',
  'Ibu & Anak',
];

const sortOptions = [
  { value: 'popular', label: 'Paling Populer' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-low', label: 'Harga Terendah' },
  { value: 'price-high', label: 'Harga Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate product cards on mount
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.05,
            ease: 'power3.out',
          }
        );
      }
    });
  }, [viewMode, selectedCategory, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = mockProducts.filter((product) => {
    if (selectedCategory !== 'Semua Kategori' && product.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="relative bg-slate-50 dark:bg-slate-900 min-h-screen">
      <ScrollProgress />
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Katalog Produk
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Temukan produk kesehatan yang Anda butuhkan
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-2xl opacity-50 blur-lg group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(to right, #10b981, #14b8a6)',
                }}
              />
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="flex-1 px-6 py-4 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white"
                />
                <Button
                  variant="primary"
                  className="m-2"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
                  }}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-64 shrink-0"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filter
                </h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Kategori
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                          selectedCategory === category
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Rentang Harga
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                      <span className="text-slate-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Terapkan
                    </Button>
                  </div>
                </div>

                {/* Reset Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Reset Filter
                </Button>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{filteredProducts.length}</span> produk
                </p>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              <AnimatePresence mode="wait">
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      ref={(el) => {
                        cardsRef.current[index] = el;
                      }}
                    >
                      <Link href={`/marketplace/products/${product.slug}`}>
                        <motion.div
                          layout
                          whileHover={{ y: -8, scale: 1.02 }}
                          className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 h-full ${
                            viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
                          }`}
                        >
                          {/* Image */}
                          <div
                            className={`relative bg-slate-100 dark:bg-slate-700 overflow-hidden ${
                              viewMode === 'list' ? 'w-48 h-48' : 'h-56'
                            }`}
                          >
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              {product.image}
                            </div>

                            {product.originalPrice && (
                              <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                                  -
                                  {Math.round(
                                    ((product.originalPrice - product.price) /
                                      product.originalPrice) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                              {product.category}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {product.name}
                            </h3>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {product.rating}
                                </span>
                              </div>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                ({product.reviews})
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                • {product.soldCount} terjual
                              </span>
                            </div>

                            <div className="mt-auto">
                              {product.originalPrice && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </p>
                              )}
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                                {formatPrice(product.price)}
                              </p>

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
                      </Link>
                    </div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <div className="flex gap-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={`w-10 h-10 rounded-lg font-semibold ${
                        page === 1
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
