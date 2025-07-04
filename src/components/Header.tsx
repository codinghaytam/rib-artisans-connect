
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { User, Search, MapPin, Menu, X } from 'lucide-react';

interface HeaderProps {
  onScrollToSearch?: () => void;
  onScrollToCategories?: () => void;
  onScrollToArtisans?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onScrollToSearch, 
  onScrollToCategories, 
  onScrollToArtisans 
}) => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:bg-transparent"
              >
                {mobileMenuOpen ? 
                  <X className="h-6 w-6" /> : 
                  <Menu className="h-6 w-6" />
                }
              </Button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                Accueil
              </Link>
              {location.pathname === '/' && onScrollToArtisans ? (
                <button 
                  onClick={onScrollToArtisans}
                  className="text-gray-700 hover:text-terracotta-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Artisans
                </button>
              ) : (
                <Link to="/artisans" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                  Artisans
                </Link>
              )}
              {location.pathname === '/' && onScrollToCategories ? (
                <button 
                  onClick={onScrollToCategories}
                  className="text-gray-700 hover:text-terracotta-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Catégories
                </button>
              ) : (
                <Link to="/categories" className="text-gray-700 hover:text-terracotta-600 transition-colors">
                  Catégories
                </Link>
              )}
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
                    className="flex items-center space-x-2 rounded-full hover:bg-gray-100"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover border-2 border-terracotta-300"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-terracotta-400 to-zellige-500 flex items-center justify-center text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline font-medium">{user.name}</span>
                    {user.isVerified && (
                      <span className="hidden md:flex h-4 w-4 bg-green-500 rounded-full ml-1" title="Compte vérifié">
                        <span className="sr-only">Vérifié</span>
                      </span>
                    )}
                  </Button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="py-3 px-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full object-cover border-2 border-terracotta-300" 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-terracotta-400 to-zellige-500 flex items-center justify-center text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.role === 'artisan' ? 'Artisan' : 'Client'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        {user.role === 'artisan' && (
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="mr-2">🧰</span> Tableau de bord
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="mr-2">👤</span> Mon profil
                        </Link>
                        {user.role === 'client' && (
                          <Link
                            to="/mes-projets"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="mr-2">📋</span> Mes projets
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex w-full text-left items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <span className="mr-2">🚪</span> Déconnexion
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

      {/* Mobile Navigation Menu - Transparent and Sleek */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="relative bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200/50 w-80 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-terracotta-500 to-zellige-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">9</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-terracotta-600 to-zellige-700 bg-clip-text text-transparent">
                  9RIB
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:bg-gray-100/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="py-6">
              <div className="space-y-1 px-4">
                <Link 
                  to="/" 
                  className="block px-4 py-3 text-gray-700 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                {location.pathname === '/' && onScrollToArtisans ? (
                  <button
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg transition-all duration-200"
                    onClick={() => {
                      onScrollToArtisans();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Artisans
                  </button>
                ) : (
                  <Link 
                    to="/artisans" 
                    className="block px-4 py-3 text-gray-700 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Artisans
                  </Link>
                )}
                {location.pathname === '/' && onScrollToCategories ? (
                  <button
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg transition-all duration-200"
                    onClick={() => {
                      onScrollToCategories();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Catégories
                  </button>
                ) : (
                  <Link 
                    to="/categories" 
                    className="block px-4 py-3 text-gray-700 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Catégories
                  </Link>
                )}
                <Link 
                  to="/contact" 
                  className="block px-4 py-3 text-gray-700 hover:bg-terracotta-50 hover:text-terracotta-600 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              
              {/* Mobile auth buttons */}
              {!user && (
                <div className="px-4 pt-6 space-y-3">
                  <Button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full bg-white/50 border-gray-300 hover:bg-white/80"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRegisterModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
                  >
                    S'inscrire
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

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
