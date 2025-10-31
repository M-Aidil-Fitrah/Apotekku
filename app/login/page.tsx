'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { Pill, Loader2, Mail, Lock, ArrowRight, Sparkles, Home, Shield, Zap, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Try customer login first
      try {
        const response = await authService.loginCustomer({ email, password });
        if (response.success) {
          router.push('/marketplace');
          return;
        }
      } catch (customerError: any) {
        // If customer login fails, try staff login
        if (customerError.response?.status === 401) {
          const response = await authService.login({ email, password });
          if (response.success) {
            const user = response.data.user;
            // Staff/Admin always go to dashboard
            if (user.roles && user.roles.length > 0) {
              router.push('/dashboard');
              return;
            }
          }
        } else {
          throw customerError;
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden flex bg-slate-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 flex-col justify-between overflow-hidden">
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
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Pill className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-6xl font-bold text-white mb-4">
              Apotekku
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Solusi manajemen apotek modern untuk bisnis Anda
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
            { icon: Shield, text: 'Keamanan Data Terjamin' },
            { icon: Zap, text: 'Proses Cepat & Efisien' },
            { icon: Heart, text: 'Mudah Digunakan' },
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
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-950 relative overflow-hidden">
        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-600/10 via-teal-600/10 to-cyan-600/10" />
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
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
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6">
              <Home className="w-4 h-4" />
              <span className="text-sm">Kembali ke Beranda</span>
            </Link>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
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
              Selamat Datang Kembali
            </h2>
            <p className="text-slate-400">
              Masukkan kredensial Anda untuk melanjutkan
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-slate-900/80 outline-none transition-all"
                  placeholder="admin@apotekku.com"
                />
                {focusedField === 'email' && (
                  <motion.div
                    layoutId="focus-border"
                    className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-slate-900/80 outline-none transition-all"
                  placeholder="••••••••"
                />
                {focusedField === 'password' && (
                  <motion.div
                    layoutId="focus-border"
                    className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none"
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
              className="w-full mt-6 py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
                  <span>Masuk</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-400 text-sm">
              Belum punya akun?{' '}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-slate-900/30 border border-slate-800 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-semibold text-slate-300">Demo Credentials</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Admin: admin@apotekku.com / password123
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Apoteker: apoteker@apotekku.com / password123
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Kasir: kasir@apotekku.com / password123
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

