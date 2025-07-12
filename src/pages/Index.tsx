import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { SearchSection } from '@/components/home/SearchSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { TopArtisansSection } from '@/components/home/TopArtisansSection';
import { HeroSection } from '@/components/home/HeroSection';
import ArtisansMapSection from '@/components/home/ArtisansMapSection';
import { Footer } from '@/components/Footer';
import { ArtisanMapProvider } from '@/contexts/ArtisanMapContext';

const Index = () => {
  // Create refs for each section
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const artisansRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ArtisanMapProvider>
      <div className="min-h-screen bg-background">
        <Header 
          onScrollToSearch={() => scrollToSection(searchRef)}
          onScrollToCategories={() => scrollToSection(categoriesRef)}
          onScrollToArtisans={() => scrollToSection(artisansRef)}
        />
        <HeroSection 
          onScrollToSearch={() => scrollToSection(searchRef)}
        />
        <div ref={searchRef}>
          <SearchSection />
        </div>
        <div ref={categoriesRef}>
          <CategoriesSection />
        </div>
        <div ref={artisansRef} id="artisans-section">
          <TopArtisansSection />
        </div>
        <div ref={mapRef} data-section="map">
          <ArtisansMapSection />
        </div>
        <Footer />
      </div>
    </ArtisanMapProvider>
  );
};

export default Index;
