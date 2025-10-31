'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pill, Loader2, Mail, Lock, User, ArrowRight, Sparkles, Home, Shield, Zap, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    setIsLoading(true);

    // Simulate API call (karena belum ada endpoint register di backend)
    setTimeout(() => {
      setError('Fitur registrasi belum tersedia. Silakan gunakan akun demo untuk login.');
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden flex flex-row-reverse bg-slate-950">
      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-purple-600 via-pink-600 to-rose-600 p-12 flex-col justify-between overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border border-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <Link href="/" className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          
          <div className="mt-16">
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl mb-6 border border-white/20"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Pill className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-6xl font-bold text-white mb-4">
              Bergabung dengan Kami
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Daftar sekarang dan kelola apotek Anda dengan lebih efisien
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 space-y-4"
        >
          {[
            { icon: Shield, text: 'Gratis untuk memulai' },
            { icon: Zap, text: 'Setup dalam 5 menit' },
            { icon: Heart, text: 'Support 24/7' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3 text-white/90"
            >
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <feature.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-950 relative overflow-hidden">
        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 via-pink-600/10 to-rose-600/10" />
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mb-8 text-center"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors mb-6">
              <Home className="w-4 h-4" />
              <span className="text-sm">Kembali ke Beranda</span>
            </Link>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Apotekku</h1>
            </div>
          </motion.div>

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-slate-400">
              Isi formulir di bawah untuk memulai
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:bg-slate-900/80 outline-none transition-all"
                  placeholder="John Doe"
                />
                {focusedField === 'name' && (
                  <motion.div
                    layoutId="focus-border"
                    className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:bg-slate-900/80 outline-none transition-all"
                  placeholder="john@example.com"
                />
                {focusedField === 'email' && (
                  <motion.div
                    layoutId="focus-border"
                    className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:bg-slate-900/80 outline-none transition-all"
                  placeholder="••••••••"
                />
                {focusedField === 'password' && (
                  <motion.div
                    layoutId="focus-border"
                    className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:bg-slate-900/80 outline-none transition-all"
                  placeholder="••••••••"
                />
                {focusedField === 'confirmPassword' && (
                  <motion.div
                    layoutId="focus-border"
                    className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-400 text-sm">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
