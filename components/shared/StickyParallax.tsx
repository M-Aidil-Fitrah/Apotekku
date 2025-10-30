'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface StickyParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const StickyParallax = ({ children, speed = 0.5, className = '' }: StickyParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div 
        style={{ y, opacity }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
