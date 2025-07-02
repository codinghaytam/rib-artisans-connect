
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SearchSection } from '@/components/home/SearchSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { TopArtisansSection } from '@/components/home/TopArtisansSection';
import { HeroSection } from '@/components/home/HeroSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />
      <HeroSection />
      <SearchSection />
      <CategoriesSection />
      <TopArtisansSection />
      <Footer />
    </div>
  );
};

export default Index;
