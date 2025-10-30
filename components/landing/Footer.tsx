'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Fitur', href: '#features' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
    { label: 'Testimoni', href: '#testimonials' },
  ],
  company: [
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Karir', href: '#career' },
    { label: 'Kontak', href: '#contact' },
  ],
  resources: [
    { label: 'Dokumentasi', href: '#docs' },
    { label: 'Tutorial', href: '#tutorial' },
    { label: 'Support', href: '#support' },
    { label: 'FAQ', href: '#faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
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

export const Footer = () => {
  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(255 255 255) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 py-16 border-b border-slate-800"
        >
          {/* Brand Section */}
          <motion.div variants={item} className="col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                Apotekku
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Solusi manajemen apotek modern untuk kesehatan Indonesia yang lebih baik
              </p>
            </div>

            <div className="space-y-3">
              <a href="mailto:info@apotekku.com" className="flex items-center gap-2 text-sm hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4" />
                <span>info@apotekku.com</span>
              </a>
              <a href="tel:+628123456789" className="flex items-center gap-2 text-sm hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4" />
                <span>+62 812-3456-789</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Jl. Kesehatan No. 123, Jakarta Selatan, DKI Jakarta 12345</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={item}>
            <h4 className="font-semibold text-white mb-4">Produk</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={item}>
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div variants={item}>
            <h4 className="font-semibold text-white mb-4">Sumber Daya</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={item}>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="py-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-slate-400">
            © 2025 Apotekku. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="hover:text-emerald-400 transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-emerald-400 transition-colors">
              Terms
            </a>
            <a href="#cookies" className="hover:text-emerald-400 transition-colors">
              Cookies
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
    </footer>
  );
};
