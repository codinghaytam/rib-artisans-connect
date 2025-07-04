
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-terracotta-500 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Page introuvable
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/artisans">
                <Search className="mr-2 h-4 w-4" />
                Chercher un artisan
              </Link>
            </Button>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <Link 
                to="/categories" 
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900">Catégories d'artisans</h4>
                <p className="text-sm text-gray-600">Explorez toutes nos catégories</p>
              </Link>
              
              <Link 
                to="/become-artisan" 
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900">Devenir artisan</h4>
                <p className="text-sm text-gray-600">Rejoignez notre réseau</p>
              </Link>
              
              <Link 
                to="/contact" 
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900">Contact</h4>
                <p className="text-sm text-gray-600">Besoin d'aide ?</p>
              </Link>
              
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-900">Support</h4>
                <p className="text-sm text-gray-600">+212 5XX-XXXXXX</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
