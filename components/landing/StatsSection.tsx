'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Package, Award, Users, Star, BarChart } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Parallax } from '@/components/shared/Parallax';

const stats = [
  { icon: Package, value: 5000, suffix: '+', label: 'Produk Tersedia', color: 'text-emerald-500' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Kepuasan Pelanggan', color: 'text-blue-500' },
  { icon: Award, value: 15, suffix: '+', label: 'Tahun Pengalaman', color: 'text-purple-500' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * target);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold">
      {count}{suffix}
    </div>
  );
}

export const StatsSection = () => {
  return (
    <section id="about" className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Parallax Background - Fixed in section */}
      <div className="absolute top-10 left-10">
        <Parallax speed={0.3}>
          <div className="w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        </Parallax>
      </div>
      <div className="absolute bottom-10 right-10">
        <Parallax speed={0.4} direction="down">
          <div className="w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </Parallax>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Parallax speed={0.2}>
          <div className="w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        </Parallax>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle
          subtitle="Pencapaian Kami"
          title="Dipercaya oleh Ribuan Pelanggan"
          description="Komitmen kami dalam memberikan pelayanan terbaik tercermin dalam angka-angka berikut"
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="relative p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>

                {/* Counter */}
                <div className={`${stat.color} mb-2`}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>

                {/* Decorative Line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color === 'text-emerald-500' ? 'from-emerald-500 to-teal-500' : stat.color === 'text-blue-500' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
            {/* Animated Background Pattern */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.2) 75%)',
                backgroundSize: '60px 60px',
              }}
            />

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Siap Meningkatkan Bisnis Apotek Anda?
              </h3>
              <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan apotek yang telah mempercayai sistem kami
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Hubungi Kami Sekarang
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
