
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTopArtisans } from '@/hooks/useTopArtisans';
import { useToast } from '@/hooks/use-toast';

export const TopArtisansSection: React.FC = () => {
  const { topArtisans, loading, error } = useTopArtisans(4);
  const { toast } = useToast();
  const handleContactArtisan = (artisanPhone: string) => {
    toast({
      title: "Contact",
      description: `Numéro de téléphone copié: ${artisanPhone}`,
    });
    // Copy phone number to clipboard
    navigator.clipboard.writeText(artisanPhone);
  };

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-terracotta-500" />
            <span className="ml-2 text-lg text-gray-600">Chargement des artisans...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 max-w-xl mx-auto">
            <p className="text-red-500 mb-4 text-lg">{error}</p>
            <p className="text-gray-600 mb-6">
              {error.includes("connexion") || error.includes("configuration") ? 
                "Nous rencontrons actuellement des problèmes techniques. Nos équipes travaillent à résoudre ce problème." : 
                "Veuillez réessayer plus tard ou consulter la liste complète des artisans."}
            </p>
            <Link to="/artisans" className="text-terracotta-600 hover:underline">
              Voir tous les artisans
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {topArtisans.map((artisan, index) => (
              <Link 
                to={`/artisans?category=${artisan.category_id}`} 
                key={artisan.id}
              >
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                <CardContent className="p-0">
                  {/* Image and Badge */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-terracotta-100 to-zellige-100 rounded-t-lg flex items-center justify-center">
                      {artisan.profiles?.avatar_url ? (
                        <img 
                          src={artisan.profiles.avatar_url}
                          alt={artisan.profiles?.name || artisan.business_name || 'Artisan'}
                          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-terracotta-600">
                            {artisan.profiles?.name?.split(' ').map(n => n?.[0]).join('') || 
                             artisan.business_name?.split(' ').map(n => n?.[0]).join('') ||
                             'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    {artisan.is_verified && (
                      <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                        ✓ Vérifié
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Name and Profession */}
                    <h3 className="text-xl font-bold mb-1 text-gray-800 group-hover:text-terracotta-600 transition-colors">
                      {artisan.profiles?.name || artisan.business_name}
                    </h3>
                    <p className="text-terracotta-600 font-medium mb-2">
                      {artisan.categories?.name}
                    </p>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{artisan.cities?.name || 'Maroc'}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-gold-500 fill-current" />
                        <span className="font-bold text-gray-800 ml-1">
                          {artisan.rating_average?.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm ml-2">
                        ({artisan.rating_count} avis)
                      </span>
                    </div>

                    {/* Specialties or Services */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {artisan.specialties ? (
                        <>
                          {(artisan.specialties as string[]).slice(0, 2).map((specialty) => (
                            <Badge 
                              key={specialty} 
                              variant="secondary" 
                              className="text-xs bg-terracotta-50 text-terracotta-700"
                            >
                              {specialty}
                            </Badge>
                          ))}
                          {(artisan.specialties as string[]).length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(artisan.specialties as string[]).length - 2}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-terracotta-50 text-terracotta-700"
                        >
                          {artisan.categories?.name}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Experience Years */}
                    {artisan.experience_years > 0 && (
                      <div className="text-center text-sm text-gray-600 mb-3">
                        {artisan.experience_years} ans d'expérience
                      </div>
                    )}
                    
                    {/* Hourly Rate */}
                    {artisan.hourly_rate && (
                      <div className="text-center text-sm font-medium text-terracotta-600 mb-3">
                        À partir de {artisan.hourly_rate}€/h
                      </div>
                    )}

                  {/* Contact Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
                    size="sm"
                    onClick={() => handleContactArtisan(artisan.profiles?.phone || '')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
              </Link>
          ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/artisans">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-terracotta-500 text-terracotta-600 hover:bg-terracotta-50"
            >
              Voir tous les artisans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
