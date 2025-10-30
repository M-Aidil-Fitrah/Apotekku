'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Pill, Phone, Mail, LogIn } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

const navLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Fitur', href: '#features' },
  { label: 'Tentang', href: '#about' },
  { label: 'Kontak', href: '#contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                  <Pill className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Apotekku
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="relative text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors group"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <motion.a
                href="tel:+628123456789"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+62 812-3456-789</span>
              </motion.a>
              <Link href="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login Staff
                </Button>
              </Link>
              <Button variant="primary" size="sm">
                Hubungi Kami
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </motion.button>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Apotekku
                  </span>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2 mb-8">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium">{link.label}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  ))}
                </nav>

                {/* Contact Info */}
                <div className="space-y-3 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <a
                    href="tel:+628123456789"
                    className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">+62 812-3456-789</span>
                  </a>
                  <a
                    href="mailto:info@apotekku.com"
                    className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">info@apotekku.com</span>
                  </a>
                </div>

                {/* CTA Button */}
                <div className="space-y-3">
                  <Link href="/login" className="block">
                    <Button variant="outline" size="md" className="w-full flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Login Staff
                    </Button>
                  </Link>
                  <Button variant="primary" size="md" className="w-full">
                    Hubungi Kami
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
