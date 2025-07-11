import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const role: UserRole = 'client'; // Only client registration in modal
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Register the user
      const { error: authError, needsEmailConfirmation } = await register(
        formData.email,
        formData.password,
        formData.name,
        role,
        formData.phone
      );
      
      if (authError) {
        toast({
          title: "Erreur d'inscription",
          description: authError,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (needsEmailConfirmation) {
        toast({
          title: "Vérification d'email requise",
          description: "Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l'email pour activer votre compte.",
          variant: "default",
          duration: 8000
        });
        onClose();
        setIsLoading(false);
        return;
      }
      
      // Close the modal and show success message
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      });
      
      setTimeout(() => {
        toast({
          title: "Inscription réussie",
          description: 'Bienvenue sur 9RIB ! Vous êtes maintenant connecté(e).',
          variant: "default",
          duration: 6000
        });
      }, 300);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || 'Une erreur inattendue est survenue',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-terracotta-600 to-zellige-700 bg-clip-text text-transparent">
            Rejoindre 9RIB
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <div className="text-sm text-gray-600 mb-4">
            Créez votre compte client pour rechercher et contacter des artisans
          </div>
          <div className="text-xs text-gray-500">
            Vous êtes artisan ? {' '}
            <Link 
              to="/become-artisan" 
              className="text-terracotta-600 hover:text-terracotta-700 font-medium"
              onClick={onClose}
            >
              Rejoignez-nous ici
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Votre nom complet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+212 6XX XXX XXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-terracotta-600 hover:text-terracotta-700 font-medium"
          >
            Se connecter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};