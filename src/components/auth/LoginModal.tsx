
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error } = await login(email, password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur 9RIB !"
      });
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-terracotta-600 to-zellige-700 bg-clip-text text-transparent">
            Connexion à 9RIB
          </DialogTitle>
        </DialogHeader>

        <Tabs value={role} onValueChange={(value) => setRole(value as UserRole)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="artisan">Artisan</TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-4 mt-6">
            <div className="text-center text-sm text-gray-600 mb-4">
              Connectez-vous en tant que client pour rechercher des artisans
            </div>
          </TabsContent>

          <TabsContent value="artisan" className="space-y-4 mt-6">
            <div className="text-center text-sm text-gray-600 mb-4">
              Connectez-vous en tant qu'artisan pour gérer vos services
            </div>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-terracotta-600 hover:text-terracotta-700 font-medium"
          >
            S'inscrire
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
