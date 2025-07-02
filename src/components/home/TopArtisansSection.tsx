
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone } from 'lucide-react';

const topArtisans = [
  {
    id: 1,
    name: 'Ahmed Bennani',
    profession: 'Maçon Expert',
    city: 'Casablanca',
    rating: 4.9,
    reviews: 127,
    image: '/placeholder.svg',
    verified: true,
    specialties: ['Construction', 'Rénovation', 'Zellige']
  },
  {
    id: 2,
    name: 'Fatima Alaoui',
    profession: 'Peintre-Décoratrice',
    city: 'Rabat',
    rating: 4.8,
    reviews: 89,
    image: '/placeholder.svg',
    verified: true,
    specialties: ['Décoration', 'Peinture murale', 'Tadelakt']
  },
  {
    id: 3,
    name: 'Omar Cherkaoui',
    profession: 'Électricien',
    city: 'Marrakech',
    rating: 4.9,
    reviews: 156,
    image: '/placeholder.svg',
    verified: true,
    specialties: ['Installation', 'Dépannage', 'Domotique']
  },
  {
    id: 4,
    name: 'Youssef Amrani',
    profession: 'Menuisier',
    city: 'Fès',
    rating: 4.7,
    reviews: 93,
    image: '/placeholder.svg',
    verified: true,
    specialties: ['Meubles', 'Portes', 'Artisanat']
  }
];

export const TopArtisansSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Top artisans de confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos artisans les mieux notés, vérifiés et recommandés par la communauté
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {topArtisans.map((artisan, index) => (
            <Card 
              key={artisan.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-0">
                {/* Image and Badge */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-terracotta-100 to-zellige-100 rounded-t-lg flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-terracotta-600">
                        {artisan.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  {artisan.verified && (
                    <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                      ✓ Vérifié
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  {/* Name and Profession */}
                  <h3 className="text-xl font-bold mb-1 text-gray-800 group-hover:text-terracotta-600 transition-colors">
                    {artisan.name}
                  </h3>
                  <p className="text-terracotta-600 font-medium mb-2">
                    {artisan.profession}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{artisan.city}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-gold-500 fill-current" />
                      <span className="font-bold text-gray-800 ml-1">
                        {artisan.rating}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm ml-2">
                      ({artisan.reviews} avis)
                    </span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {artisan.specialties.slice(0, 2).map((specialty) => (
                      <Badge 
                        key={specialty} 
                        variant="secondary" 
                        className="text-xs bg-terracotta-50 text-terracotta-700"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {artisan.specialties.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{artisan.specialties.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Contact Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
                    size="sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-terracotta-500 text-terracotta-600 hover:bg-terracotta-50"
          >
            Voir tous les artisans
          </Button>
        </div>
      </div>
    </section>
  );
};
