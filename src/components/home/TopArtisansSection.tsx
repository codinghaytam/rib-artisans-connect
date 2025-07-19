
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTopArtisans } from '@/hooks/useTopArtisans';
import { useToast } from '@/hooks/use-toast';
import { useArtisanMap } from '@/contexts/ArtisanMapContext';

export const TopArtisansSection: React.FC = () => {
  // Use mock data as fallback in production environments only when all retries fail
  const useMockData = process.env.NODE_ENV === 'production';
  const { topArtisans, loading, error, usedMockData } = useTopArtisans(4, useMockData);
  const { toast } = useToast();
  const { 
    setArtisans, 
    flyToArtisan, 
    setHoveredArtisan, 
    hoveredArtisan,
    selectedArtisan 
  } = useArtisanMap();

  // Update context with artisans data
  useEffect(() => {
    if (topArtisans.length > 0) {
      setArtisans(topArtisans);
    }
  }, [topArtisans, setArtisans]);

  const handleContactArtisan = (artisanPhone: string) => {
    toast({
      title: "Contact",
      description: `Numéro de téléphone copié: ${artisanPhone}`,
    });
    // Copy phone number to clipboard
    navigator.clipboard.writeText(artisanPhone);
  };

  const handleShowOnMap = (artisan: any) => {
    flyToArtisan(artisan);
    // Scroll to map section
    const mapSection = document.querySelector('[data-section="map"]');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 bg-background bg-[url(/public/13561297_5268821.jpg)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 " >
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Top artisans de confiance
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos artisans les mieux notés, vérifiés et recommandés par la communauté
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Chargement des artisans...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 max-w-xl mx-auto">
            <p className="text-destructive mb-4 text-lg">{error}</p>
            <p className="text-muted-foreground mb-6">
              {error.includes("connexion") || error.includes("configuration") ? 
                "Nous rencontrons actuellement des problèmes techniques. Nos équipes travaillent à résoudre ce problème." : 
                "Veuillez réessayer plus tard ou consulter la liste complète des artisans."}
            </p>
            <Link to="/artisans" className="text-primary hover:underline">
              Voir tous les artisans
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto bg-transparent">
            {topArtisans.map((artisan, index) => (
              <Link 
                to={`/artisans?category=${artisan.category_id}`} 
                key={artisan.id}
              >
                <Card 
                  className={`group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                    selectedArtisan?.user_id === artisan.id ? 'ring-2 ring-primary' : ''
                  } ${hoveredArtisan?.user_id === artisan.id ? 'shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredArtisan(artisan)}
                  onMouseLeave={() => setHoveredArtisan(null)}
                >
                <CardContent className="p-0">
                  {/* Image and Badge */}
                  <div className="relative">
                    <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
                      {artisan.profiles?.avatar_url ? (
                        <img 
                          src={artisan.profiles.avatar_url}
                          alt={artisan.profiles?.name || artisan.business_name || 'Artisan'}
                          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-primary">
                            {artisan.profiles?.name?.split(' ').map(n => n?.[0]).join('') || 
                             artisan.business_name?.split(' ').map(n => n?.[0]).join('') ||
                             'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    {artisan.is_verified && (
                      <Badge className="absolute top-3 right-3 bg-success hover:bg-success/90">
                        ✓ Vérifié
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Name and Profession */}
                    <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">
                      {artisan.profiles?.name || artisan.business_name}
                    </h3>
                    <p className="text-primary font-medium mb-2">
                      {artisan.categories?.name}
                    </p>

                    {/* Location */}
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{artisan.cities?.name || 'Maroc'}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-accent fill-current" />
                        <span className="font-bold text-foreground ml-1">
                          {artisan.rating_average?.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-sm ml-2">
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
                              className="text-xs"
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
                          className="text-xs"
                        >
                          {artisan.categories?.name}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Experience Years */}
                    {artisan.experience_years > 0 && (
                      <div className="text-center text-sm text-muted-foreground mb-3">
                        {artisan.experience_years} ans d'expérience
                      </div>
                    )}
                    
                    {/* Hourly Rate */}
                    {artisan.hourly_rate && (
                      <div className="text-center text-sm font-medium text-primary mb-3">
                        À partir de {artisan.hourly_rate}€/h
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleContactArtisan(artisan.profiles?.phone || '');
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                    
                    {artisan.address && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          handleShowOnMap(artisan);
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Voir sur la carte
                      </Button>
                    )}
                  </div>
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
            >
              Voir tous les artisans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
