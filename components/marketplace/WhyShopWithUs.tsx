'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Truck, HeadphonesIcon, Award, Clock, CreditCard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Shield,
    title: 'Produk 100% Original',
    description: 'Semua produk dijamin keasliannya dan terdaftar resmi di BPOM Indonesia',
    color: 'emerald',
  },
  {
    icon: Truck,
    title: 'Gratis Ongkir',
    description: 'Pengiriman gratis untuk pembelian minimal Rp 100.000 ke seluruh Indonesia',
    color: 'teal',
  },
  {
    icon: HeadphonesIcon,
    title: 'Konsultasi Gratis',
    description: 'Konsultasi langsung dengan apoteker profesional bersertifikat',
    color: 'cyan',
  },
  {
    icon: Award,
    title: 'Kualitas Terjamin',
    description: 'Penyimpanan produk sesuai standar farmasi internasional',
    color: 'amber',
  },
  {
    icon: Clock,
    title: 'Layanan 24/7',
    description: 'Siap melayani kebutuhan kesehatan Anda kapan saja',
    color: 'purple',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran Aman',
    description: 'Berbagai metode pembayaran aman dan terpercaya',
    color: 'pink',
  },
];

export const WhyShopWithUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate cards with parallax
    cardsRef.current.forEach((card, index) => {
      if (card) {
        // Entrance animation
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            scale: 0.9,
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
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // Parallax effect
        gsap.to(card, {
          y: index % 2 === 0 ? -20 : 20,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, #10b981, transparent)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, #14b8a6, transparent)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -bottom-40 left-1/2 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, #06b6d4, transparent)',
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
            className="inline-block mb-4 px-6 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #10b98122, #14b8a622)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
              Keunggulan Kami
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Mengapa Belanja Di Sini?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Komitmen kami untuk memberikan pelayanan kesehatan terbaik dengan standar tertinggi
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="group relative h-full"
                >
                  {/* Glow Effect */}
                  <div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, var(--${feature.color}-400), var(--${feature.color}-600))`,
                    }}
                  />

                  {/* Card */}
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6"
                    >
                      <div
                        className="inline-block p-4 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, var(--${feature.color}-50), var(--${feature.color}-100))`,
                        }}
                      >
                        <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover Line */}
                    <div
                      className="h-1 w-0 group-hover:w-full transition-all duration-500 mt-6 rounded-full"
                      style={{
                        background: `linear-gradient(to right, var(--${feature.color}-400), var(--${feature.color}-600))`,
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div
            className="inline-block rounded-3xl p-12 border-2"
            style={{
              background: 'linear-gradient(135deg, #10b98111, #14b8a611)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
            }}
          >
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Butuh Bantuan Memilih Produk?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
              Tim apoteker kami siap membantu Anda dengan konsultasi kesehatan gratis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg"
                style={{
                  background: 'linear-gradient(to right, #10b981, #14b8a6)',
                }}
              >
                💬 Chat Apoteker
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-semibold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
              >
                📞 Hubungi Via WhatsApp
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
