
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    phone: '',
    cin: ''
  });
  const [role, setRole] = useState<UserRole>('client');
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

    if (role === 'artisan' && !formData.cin) {
      toast({
        title: "Erreur",
        description: "Le CIN est obligatoire pour les artisans",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        role,
        formData.phone
      );
      
      toast({
        title: "Inscription réussie",
        description: `Bienvenue sur 9RIB ! ${role === 'artisan' ? 'Votre profil artisan sera vérifié sous 24h.' : ''}`
      });
      
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        cin: ''
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-terracotta-600 to-zellige-700 bg-clip-text text-transparent">
            Rejoindre 9RIB
          </DialogTitle>
        </DialogHeader>

        <Tabs value={role} onValueChange={(value) => setRole(value as UserRole)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="artisan">Artisan</TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-4 mt-6">
            <div className="text-center text-sm text-gray-600 mb-4">
              Créez votre compte client pour rechercher et contacter des artisans
            </div>
          </TabsContent>

          <TabsContent value="artisan" className="space-y-4 mt-6">
            <div className="text-center text-sm text-gray-600 mb-4">
              Créez votre profil artisan et commencez à recevoir des demandes
            </div>
          </TabsContent>
        </Tabs>

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
            <Label htmlFor="phone">Téléphone {role === 'artisan' ? '*' : ''}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+212 6XX XXX XXX"
            />
          </div>

          {role === 'artisan' && (
            <div className="space-y-2">
              <Label htmlFor="cin">CIN (Carte d'identité) *</Label>
              <Input
                id="cin"
                value={formData.cin}
                onChange={(e) => handleInputChange('cin', e.target.value)}
                placeholder="Ex: BK123456"
              />
            </div>
          )}

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
