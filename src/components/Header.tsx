
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { User, Search, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="bg-white shadow-lg border-b-2 border-terracotta-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-zellige-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">9</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-terracotta-600 to-zellige-700 bg-clip-text text-transparent">
                9RIB
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                Accueil
              </Link>
              <Link to="/artisans" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                Artisans
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                Catégories
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                Contact
              </Link>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Tableau de bord
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mon profil
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-700 hover:text-terracotta-600"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white"
                  >
                    S'inscrire
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};
