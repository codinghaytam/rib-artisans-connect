
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroArtisan from '@/assets/hero-artisan.jpg';
import { QuatrefoilBackground } from '@/components/decorative/QuatrefoilBackground';

interface HeroSectionProps {
  onScrollToSearch?: () => void;
  onScrollToBecomeArtisan?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToSearch,
  onScrollToBecomeArtisan
}) => {
  return (
    <section className="relative overflow-hidden bg-background theme-hero-bright">
      {/* Background image */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src={heroArtisan} 
          alt="Artisan traditionnel marocain au travail" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-grey/50"></div>
      
      {/* Moroccan decorative patterns */}
        
      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in text-white">
            Trouvez le{' '}
            <span className="text-accent drop-shadow-lg">
              parfait artisan
            </span>
            <br />
            près de chez vous
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in ">
            9RIB connecte les Marocains avec des artisans qualifiés et vérifiés. 
            Maçonnerie, plomberie, peinture, électricité... trouvez l'expert qu'il vous faut !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg shadow-lg"
              onClick={onScrollToSearch}
            >
              <User className="mr-2 h-5 w-5" />
              Trouver un artisan
            </Button>
            {onScrollToBecomeArtisan ? (
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white bg-white/10 hover:bg-accent hover:text-white px-8 py-4 text-lg shadow-lg backdrop-blur-sm cl"
                onClick={onScrollToBecomeArtisan}
              >
                Devenir artisan
              </Button>
            ) : (
              <Link to="/become-artisan">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white bg-white/10 hover:bg-accent hover:text-white px-8 py-4 text-lg shadow-lg backdrop-blur-sm"
                >
                  Devenir artisan
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-accent mb-2 drop-shadow-lg">2,500+</div>
              <div className="text-white/80 drop-shadow-md">Artisans vérifiés</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-accent mb-2 drop-shadow-lg">15,000+</div>
              <div className="text-white/80 drop-shadow-md">Projets réalisés</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-accent drop-shadow-lg">4.8</span>
                <Star className="h-6 w-6 text-accent fill-current ml-1 drop-shadow-lg" />
              </div>
              <div className="text-white/80 drop-shadow-md">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
