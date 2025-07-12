
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroArtisan from '@/assets/hero-artisan.jpg';

interface HeroSectionProps {
  onScrollToSearch?: () => void;
  onScrollToBecomeArtisan?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToSearch,
  onScrollToBecomeArtisan
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-50 via-white to-zellige-50">
      {/* Background image */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src={heroArtisan} 
          alt="Artisan traditionnel marocain au travail" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-terracotta-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-zellige-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gold-300 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in text-white drop-shadow-lg">
            Trouvez le{' '}
            <span className="bg-gradient-to-r from-terracotta-200 to-zellige-200 bg-clip-text text-transparent drop-shadow-sm">
              parfait artisan
            </span>
            <br />
            près de chez vous
          </h1>
          
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto animate-fade-in drop-shadow-md">
            9RIB connecte les Marocains avec des artisans qualifiés et vérifiés. 
            Maçonnerie, plomberie, peinture, électricité... trouvez l'expert qu'il vous faut !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white px-8 py-4 text-lg"
              onClick={onScrollToSearch}
            >
              <User className="mr-2 h-5 w-5" />
              Trouver un artisan
            </Button>
            {onScrollToBecomeArtisan ? (
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-zellige-500 text-zellige-700 hover:bg-zellige-50 px-8 py-4 text-lg"
                onClick={onScrollToBecomeArtisan}
              >
                Devenir artisan
              </Button>
            ) : (
              <Link to="/become-artisan">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-zellige-500 text-zellige-700 hover:bg-zellige-50 px-8 py-4 text-lg"
                >
                  Devenir artisan
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-terracotta-600 mb-2">2,500+</div>
              <div className="text-gray-600">Artisans vérifiés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zellige-600 mb-2">15,000+</div>
              <div className="text-gray-600">Projets réalisés</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-gold-600">4.8</span>
                <Star className="h-6 w-6 text-gold-500 fill-current ml-1" />
              </div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
