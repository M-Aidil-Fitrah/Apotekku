'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { Pill, Sparkles, Shield, Clock, Heart, Zap, Award } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Parallax } from '@/components/shared/Parallax';

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  useEffect(() => {
    if (!heroRef.current || !floatingRef.current) return;

    // Floating animation untuk elemen
    const floatingElements = floatingRef.current.querySelectorAll('.floating-element');
    
    floatingElements.forEach((el, index) => {
      gsap.to(el, {
        y: `${(index + 1) * 20}`,
        rotation: index % 2 === 0 ? 10 : -10,
        duration: 2 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });

    // Text reveal animation
    const chars = heroRef.current.querySelectorAll('.char');
    gsap.from(chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      duration: 1,
      ease: 'back.out(1.7)',
    });

    // Gradient animation
    gsap.to('.gradient-bg', {
      backgroundPosition: '200% center',
      duration: 8,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section ref={sectionRef} id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950">
      {/* Animated Background Gradient with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="gradient-bg absolute inset-0 opacity-20 bg-size-[200%_100%] bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600" 
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-size-[32px_32px]" />
      
      {/* Floating Elements with Better Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={0.2}>
          <div className="absolute top-20 left-[10%] w-24 h-24 bg-emerald-400/30 rounded-full blur-2xl" />
        </Parallax>
        <Parallax speed={0.4}>
          <div className="absolute top-40 right-[15%] w-40 h-40 bg-teal-400/30 rounded-full blur-3xl" />
        </Parallax>
        <Parallax speed={0.3} direction="down">
          <div className="absolute bottom-32 left-[20%] w-32 h-32 bg-cyan-400/30 rounded-full blur-2xl" />
        </Parallax>
        <Parallax speed={0.5}>
          <div className="absolute bottom-20 right-[25%] w-36 h-36 bg-emerald-400/30 rounded-full blur-3xl" />
        </Parallax>
        
        {/* Floating Icons with improved visibility */}
        <Parallax speed={0.6}>
          <div className="absolute top-32 left-[8%]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="text-emerald-500/40 dark:text-emerald-400/40"
            >
              <Pill className="w-20 h-20" />
            </motion.div>
          </div>
        </Parallax>
        <Parallax speed={0.7}>
          <div className="absolute top-[60%] right-[12%]">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-teal-500/40 dark:text-teal-400/40"
            >
              <Heart className="w-16 h-16" />
            </motion.div>
          </div>
        </Parallax>
        <Parallax speed={0.4}>
          <div className="absolute bottom-[35%] left-[18%]">
            <motion.div
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-cyan-500/40 dark:text-cyan-400/40"
            >
              <Shield className="w-18 h-18" />
            </motion.div>
          </div>
        </Parallax>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div ref={heroRef} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-emerald-200 dark:border-emerald-800"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Solusi Kesehatan Terpercaya
                </span>
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white">
                  {splitText('Apotekku')}
                </h1>
                <p className="text-xl md:text-2xl text-emerald-600 dark:text-emerald-400 font-medium">
                  Kesehatan Anda, Prioritas Kami
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-lg text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed"
              >
                Apotek modern dengan sistem manajemen terintegrasi, menyediakan obat berkualitas 
                dengan pelayanan profesional dan terpercaya untuk keluarga Indonesia.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Button variant="primary" size="lg" showArrow>
                  Mulai Sekarang
                </Button>
                <Button variant="outline" size="lg">
                  Pelajari Lebih Lanjut
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                <div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">5000+</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Produk</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Layanan</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Terpercaya</div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - 3D Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px]">
                {/* Card 1 */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="absolute top-0 right-0 w-80 h-96 bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-8 text-white transform rotate-6"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Pill className="w-16 h-16 mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Obat Berkualitas</h3>
                  <p className="text-emerald-50">Produk original dengan sertifikat resmi dari BPOM</p>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  className="absolute top-32 left-0 w-80 h-96 bg-linear-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl p-8 text-white transform -rotate-6"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Shield className="w-16 h-16 mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Aman & Terpercaya</h3>
                  <p className="text-cyan-50">Sistem keamanan berlapis untuk melindungi data Anda</p>
                </motion.div>

                {/* Floating Pill Icon */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-10 right-10 w-24 h-24 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center"
                >
                  <Pill className="w-12 h-12 text-emerald-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
