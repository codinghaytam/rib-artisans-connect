
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Search } from 'lucide-react';

// Mock data for artisans
const mockArtisans = [
  {
    id: 1,
    name: "Ahmed Benjelloun",
    category: "Plomberie",
    city: "Casablanca",
    rating: 4.8,
    reviews: 45,
    phone: "+212 6XX-XXXXXX",
    verified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Fatima El Alami",
    category: "Électricité",
    city: "Rabat",
    rating: 4.9,
    reviews: 32,
    phone: "+212 6XX-XXXXXX",
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Youssef Tazi",
    category: "Menuiserie",
    city: "Marrakech",
    rating: 4.7,
    reviews: 28,
    phone: "+212 6XX-XXXXXX",
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Khadija Bennani",
    category: "Peinture",
    city: "Fès",
    rating: 4.6,
    reviews: 19,
    phone: "+212 6XX-XXXXXX",
    verified: false,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

const Artisans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Maçonnerie'];

  const filteredArtisans = mockArtisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artisan.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || artisan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Artisans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map(artisan => (
              <Card key={artisan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="flex items-center justify-center gap-2">
                    {artisan.name}
                    {artisan.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Vérifié
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{artisan.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{artisan.rating}</span>
                    <span className="text-gray-500">({artisan.reviews} avis)</span>
                  </div>
                  
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {artisan.city}
                  </div>
                  
                  <div className="flex items-center justify-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {artisan.phone}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700">
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArtisans.length === 0 && (
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
