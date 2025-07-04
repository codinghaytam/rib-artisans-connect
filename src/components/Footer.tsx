
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, User, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Back to top button */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={scrollToTop}
          className="rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white w-10 h-10 flex items-center justify-center shadow-lg"
          size="icon"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-zellige-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">9</span>
              </div>
              <span className="text-2xl font-bold">9RIB</span>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              La plateforme marocaine de référence pour trouver des artisans qualifiés et vérifiés. 
              Connectez-vous avec les meilleurs professionnels près de chez vous.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>+212 5XX-XXXXXX</span>
              </div>
              <div className="flex items-center text-gray-400">
                <User className="h-4 w-4 mr-2" />
                <span>contact@9rib.ma</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Casablanca, Maroc</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/artisans" className="text-gray-400 hover:text-white transition-colors">
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link to="/become-artisan" className="text-gray-400 hover:text-white transition-colors">
                  Devenir artisan
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Aide & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 9RIB. Tous droits réservés. Fait avec ❤️ au Maroc.
          </p>
        </div>
      </div>
    </footer>
  );
};
