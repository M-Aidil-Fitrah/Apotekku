'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  Package,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Navbar } from '@/components/shared/Navbar';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Paracetamol 500mg',
  slug: 'paracetamol-500mg',
  category: 'Obat Bebas',
  price: 15000,
  originalPrice: 20000,
  rating: 4.8,
  reviews: 124,
  soldCount: 450,
  stock: 150,
  images: ['💊', '💊', '💊', '💊'],
  description:
    'Paracetamol 500mg adalah obat pereda nyeri dan penurun demam yang efektif. Cocok untuk mengatasi sakit kepala, sakit gigi, dan demam.',
  indication: 'Meredakan nyeri ringan hingga sedang dan menurunkan demam',
  dosage: '1-2 tablet setiap 4-6 jam, maksimal 8 tablet per hari',
  composition: 'Paracetamol 500mg per tablet',
  sideEffects: 'Jarang terjadi, namun dapat menyebabkan mual, ruam kulit',
  contraindication: 'Gangguan fungsi hati berat',
  manufacturer: 'PT Farmasi Indonesia',
  bpom: 'DBL1234567890',
  expired: '2026-12-31',
};

const relatedProducts = [
  {
    id: '2',
    name: 'Ibuprofen 400mg',
    slug: 'ibuprofen-400mg',
    price: 18000,
    originalPrice: 25000,
    rating: 4.7,
    image: '💊',
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    slug: 'vitamin-c-1000mg',
    price: 85000,
    rating: 4.9,
    image: '🌿',
  },
  {
    id: '4',
    name: 'Antasida Tablet',
    slug: 'antasida-tablet',
    price: 12000,
    rating: 4.6,
    image: '💊',
  },
  {
    id: '5',
    name: 'Betadine Solution',
    slug: 'betadine-solution',
    price: 28000,
    rating: 4.8,
    image: '🧴',
  },
];

const reviews = [
  {
    id: '1',
    user: 'Budi Santoso',
    rating: 5,
    date: '2 hari yang lalu',
    comment: 'Produk original dan cepat sampai. Packaging rapi. Recommended!',
    helpful: 12,
  },
  {
    id: '2',
    user: 'Siti Rahayu',
    rating: 4,
    date: '1 minggu yang lalu',
    comment: 'Harga terjangkau, kualitas bagus. Pengiriman cepat.',
    helpful: 8,
  },
  {
    id: '3',
    user: 'Ahmad Wijaya',
    rating: 5,
    date: '2 minggu yang lalu',
    comment: 'Sudah berulang kali order di sini. Selalu puas!',
    helpful: 15,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const productRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate product details
    if (productRef.current) {
      gsap.from(productRef.current.querySelectorAll('.animate-item'), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    // Animate related products
    imagesRef.current.forEach((el, index) => {
      if (el) {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          delay: index * 0.1,
          duration: 0.6,
          ease: 'power3.out',
        });
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

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= mockProduct.stock) {
      setQuantity(newQty);
    }
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-900 min-h-screen">
      <ScrollProgress />
      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-24 pb-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/marketplace" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600">
              Marketplace
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/marketplace/products" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600">
              Produk
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">{mockProduct.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4" ref={productRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div className="animate-item">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                {/* Main Image */}
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-96 bg-slate-100 dark:bg-slate-700 rounded-xl mb-6 flex items-center justify-center overflow-hidden group"
                >
                  <div className="text-9xl">{mockProduct.images[selectedImage]}</div>

                  {/* Zoom hint */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-semibold">🔍 Klik untuk zoom</p>
                  </div>
                </motion.div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                  {mockProduct.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-3xl transition-all ${
                        selectedImage === index
                          ? 'ring-4 ring-emerald-500 scale-105'
                          : 'hover:scale-105'
                      }`}
                    >
                      {img}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="animate-item">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    {mockProduct.category}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    SKU: {mockProduct.bpom}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {mockProduct.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= mockProduct.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {mockProduct.rating}
                    </span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    ({mockProduct.reviews} ulasan)
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    • {mockProduct.soldCount} terjual
                  </span>
                </div>
              </div>

              <div className="animate-item">
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(mockProduct.price)}
                  </p>
                  {mockProduct.originalPrice && (
                    <>
                      <p className="text-xl text-slate-500 dark:text-slate-400 line-through">
                        {formatPrice(mockProduct.originalPrice)}
                      </p>
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
                        -
                        {Math.round(
                          ((mockProduct.originalPrice - mockProduct.price) /
                            mockProduct.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Stok: <span className="font-semibold text-emerald-600">{mockProduct.stock} tersedia</span>
                </p>
              </div>

              <div className="animate-item border-t border-b border-slate-200 dark:border-slate-700 py-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {mockProduct.description}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="animate-item space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Jumlah:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center text-lg font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= mockProduct.stock}
                      className="w-10 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Wishlist
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </div>

                <Button variant="primary" size="lg" className="w-full bg-emerald-700 hover:bg-emerald-800">
                  Beli Sekarang
                </Button>

                <button className="w-full py-3 text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Bagikan Produk
                </button>
              </div>

              {/* Guarantees */}
              <div className="animate-item grid grid-cols-3 gap-4 p-6 bg-emerald-50 dark:bg-emerald-950 rounded-xl">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">100% Original</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Gratis Ongkir</p>
                </div>
                <div className="text-center">
                  <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Garansi Uang Kembali</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-12">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {[
                { id: 'description', label: 'Deskripsi' },
                { id: 'info', label: 'Informasi Produk' },
                { id: 'reviews', label: `Ulasan (${reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Deskripsi Produk</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {mockProduct.description}
                  </p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Indikasi</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {mockProduct.indication}
                  </p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dosis</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {mockProduct.dosage}
                  </p>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Komposisi</h4>
                    <p className="text-slate-700 dark:text-slate-300">{mockProduct.composition}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Efek Samping</h4>
                    <p className="text-slate-700 dark:text-slate-300">{mockProduct.sideEffects}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Kontraindikasi</h4>
                    <p className="text-slate-700 dark:text-slate-300">{mockProduct.contraindication}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Produsen</h4>
                    <p className="text-slate-700 dark:text-slate-300">{mockProduct.manufacturer}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">No. BPOM</h4>
                    <p className="text-slate-700 dark:text-slate-300">{mockProduct.bpom}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Tanggal Kadaluarsa</h4>
                    <p className="text-slate-700 dark:text-slate-300">{mockProduct.expired}</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-emerald-600 mb-2">{mockProduct.rating}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= mockProduct.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {mockProduct.reviews} ulasan
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-slate-600 dark:text-slate-400 w-12">
                            {rating} ⭐
                          </span>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400"
                              style={{ width: `${rating >= 4 ? 80 : 20}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400 w-12 text-right">
                            {rating >= 4 ? 80 : 20}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{review.user}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                          {review.comment}
                        </p>
                        <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600">
                          👍 Membantu ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  ref={(el) => {
                    imagesRef.current[index] = el;
                  }}
                >
                  <Link href={`/marketplace/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                    >
                      <div className="relative h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-5xl">
                        {product.image}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {product.rating}
                          </span>
                        </div>
                        {product.originalPrice && (
                          <p className="text-xs text-slate-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-emerald-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
