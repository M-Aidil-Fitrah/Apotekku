'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api/product';
import { getCategories } from '@/lib/api/category';
import { Product } from '@/lib/api/product';
import { Category } from '@/lib/api/category';
import { useCart } from '@/lib/store/marketplaceCart';
import { 
  Search, Filter, Grid, List, ChevronDown, ShoppingCart, 
  Star, TrendingUp, Package, Heart, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { CartDrawer } from '@/components/marketplace/CartDrawer';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { formatCurrency } from '@/lib/utils';

const sortOptions = [
  { value: 'popular', label: 'Paling Populer' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_asc', label: 'Harga Terendah' },
  { value: 'price_desc', label: 'Harga Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
];

export default function ProductsPage() {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500000]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts({
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
            sort: sortBy as any,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            inStock: true,
          }),
          getCategories(),
        ]);

        setProducts(productsData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.mainImage,
      stock: product.stockQuantity,
      requiresPrescription: product.requiresPrescription,
      quantity: 1,
    });
    openCart();
  };

  const handleProductClick = (slug: string) => {
    router.push(`/marketplace/products/${slug}`);
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-900 min-h-screen">
      <ScrollProgress />
      <Navbar />
      <CartDrawer />

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Produk Kesehatan
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Temukan produk kesehatan berkualitas untuk kebutuhan Anda
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk kesehatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-6`}>
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square bg-slate-100 dark:bg-slate-700 cursor-pointer overflow-hidden"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <img
                      src={product.mainImage || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.compareAtPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                      </div>
                    )}
                    {product.stockQuantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white px-4 py-2 rounded-lg font-bold text-slate-900">
                          Stok Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {product.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">
                        ({product.reviewCount})
                      </span>
                      <span className="text-sm text-slate-500">
                        · {product.soldCount} terjual
                      </span>
                    </div>

                    <div className="mb-4">
                      {product.compareAtPrice && (
                        <span className="text-sm text-slate-400 line-through mr-2">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-emerald-600">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.stockQuantity === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
