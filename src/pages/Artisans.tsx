
import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Search, Loader2 } from 'lucide-react';
import { useArtisans, useCategories, useCities } from '@/hooks/useArtisans';
import { useToast } from '@/hooks/use-toast';

const Artisans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const { toast } = useToast();

  // Fetch data from backend
  const { categories, loading: categoriesLoading } = useCategories();
  const { cities, loading: citiesLoading } = useCities();
  
  const filters = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    categoryId: selectedCategory || undefined,
    cityId: selectedCity || undefined,
  }), [searchTerm, selectedCategory, selectedCity]);

  const { artisans, loading: artisansLoading, error } = useArtisans(filters);

  const handleContactArtisan = (artisanPhone: string) => {
    toast({
      title: "Contact",
      description: `Numéro de téléphone copié: ${artisanPhone}`,
    });
    // Copy phone number to clipboard
    navigator.clipboard.writeText(artisanPhone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trouvez votre artisan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez des artisans qualifiés et vérifiés près de chez vous.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  disabled={categoriesLoading}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.emoji ? `${category.emoji} ` : ''}{category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  disabled={citiesLoading}
                >
                  <option value="">Toutes les villes</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {artisansLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
              <span className="ml-2 text-lg">Chargement des artisans...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-xl text-red-600 mb-4">
                Erreur lors du chargement des artisans
              </p>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {/* Artisans Grid */}
          {!artisansLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisans.map(artisan => (
                <Card key={artisan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <img
                      src={artisan.profiles?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                      alt={artisan.profiles?.full_name || artisan.business_name || 'Artisan'}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <CardTitle className="flex items-center justify-center gap-2">
                      {artisan.profiles?.full_name || artisan.business_name}
                      {artisan.is_verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Vérifié
                        </Badge>
                      )}
                      {artisan.is_featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          ⭐ Vedette
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {artisan.categories?.emoji ? `${artisan.categories.emoji} ` : ''}
                      {artisan.categories?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{artisan.rating_average.toFixed(1)}</span>
                      <span className="text-gray-500">({artisan.rating_count} avis)</span>
                    </div>
                    
                    {artisan.cities && (
                      <div className="flex items-center justify-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {artisan.cities.name}
                      </div>
                    )}
                    
                    {artisan.profiles?.phone && (
                      <div className="flex items-center justify-center text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        {artisan.profiles.phone}
                      </div>
                    )}

                    {artisan.experience_years > 0 && (
                      <div className="text-center text-sm text-gray-600">
                        {artisan.experience_years} ans d'expérience
                      </div>
                    )}

                    {artisan.hourly_rate && (
                      <div className="text-center text-sm font-medium text-terracotta-600">
                        À partir de {artisan.hourly_rate}€/h
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
                      onClick={() => handleContactArtisan(artisan.profiles?.phone || '')}
                    >
                      Contacter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!artisansLoading && !error && artisans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Aucun artisan trouvé pour cette recherche.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Artisans;
