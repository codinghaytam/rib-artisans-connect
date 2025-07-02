
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';

const moroccanCities = [
  'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'Mohammedia'
];

export const SearchSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm, 'in', selectedCity);
    // Here you would implement the actual search logic
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Cherchez un artisan par métier, ville ou note
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Quel métier recherchez-vous ?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>

              {/* City Selector */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="pl-10 h-12 text-lg">
                    <SelectValue placeholder="Choisir une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {moroccanCities.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="h-12 text-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
              >
                Rechercher
              </Button>
            </div>

            {/* Quick Search Tags */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Recherches populaires :</p>
              <div className="flex flex-wrap gap-2">
                {['Plombier', 'Électricien', 'Peintre', 'Maçon', 'Menuisier', 'Carreleur'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-4 py-2 bg-gray-100 hover:bg-terracotta-100 hover:text-terracotta-700 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
