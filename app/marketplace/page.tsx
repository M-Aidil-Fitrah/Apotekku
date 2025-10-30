'use client';

import { Navbar } from '@/components/shared/Navbar';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { CategoryGrid } from '@/components/marketplace/CategoryGrid';
import { FeaturedProducts } from '@/components/marketplace/FeaturedProducts';
import { WhyShopWithUs } from '@/components/marketplace/WhyShopWithUs';
import { Footer } from '@/components/landing/Footer';

export default function MarketplacePage() {
  return (
    <div className="relative bg-slate-50 dark:bg-slate-900">
      <ScrollProgress />
      <Navbar />
      <MarketplaceHero />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyShopWithUs />
      <Footer />
    </div>
  );
}
