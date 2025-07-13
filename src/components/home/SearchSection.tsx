
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { useCategories, useCities } from '@/hooks/useArtisans';
import { MoroccanPatternGrid } from '@/components/decorative/MoroccanPatterns';
import { QuatrefoilBackground } from '@/components/decorative/QuatrefoilBackground';

export const SearchSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const navigate = useNavigate();

  // Fetch categories and cities from the backend
  const { categories } = useCategories();
  const { cities } = useCities();

  const handleSearch = () => {
    // Build search parameters
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    
    if (selectedCity && selectedCity !== 'all') {
      params.set('city', selectedCity);
    }
    
    // Navigate to artisans page with search parameters
    navigate(`/artisans?${params.toString()}`);
  };

  const handleQuickSearch = (categoryName: string) => {
    setSearchTerm(categoryName);
    const params = new URLSearchParams();
    params.set('search', categoryName);
    navigate(`/artisans?${params.toString()}`);
  };

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <QuatrefoilBackground opacity={0.08} />
      <MoroccanPatternGrid density="low" color="text-muted-foreground/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Cherchez un artisan par métier, ville ou note
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Quel métier recherchez-vous ?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Category Selector */}
              <div className="relative">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji ? `${category.emoji} ` : ''}{category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Selector */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="pl-10 h-12 text-lg">
                    <SelectValue placeholder="Choisir une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="h-12 text-lg bg-secondary hover:bg-secondary/90"
              >
                Rechercher
              </Button>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
};
