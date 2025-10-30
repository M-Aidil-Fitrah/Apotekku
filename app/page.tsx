'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Navbar } from '@/components/shared/Navbar';
import { ScrollProgress } from '@/components/shared/ScrollProgress';

export default function Home() {
  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
