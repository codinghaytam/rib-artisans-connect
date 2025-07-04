
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';

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
    cin: '',
    // Artisan-specific fields
    businessName: '',
    categoryId: '',
    cityId: '',
    experienceYears: '',
    hourlyRate: '',
    description: '',
    serviceRadius: '20'
  });
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const { categories } = useCategories();
  const [cities, setCities] = useState<Array<{id: string, name: string}>>([]);

  // Load cities when component mounts
  React.useEffect(() => {
    const loadCities = async () => {
      const { data } = await supabase
        .from('cities')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        setCities(data);
      }
    };
    loadCities();
  }, []);

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

    if (role === 'artisan') {
      if (!formData.cin || !formData.phone || !formData.categoryId || !formData.experienceYears) {
        toast({
          title: "Erreur",
          description: "Tous les champs marqués d'un * sont obligatoires pour les artisans",
          variant: "destructive"
        });
        return;
      }

      const experienceYears = parseInt(formData.experienceYears);
      if (experienceYears < 0 || experienceYears > 50) {
        toast({
          title: "Erreur",
          description: "L'expérience doit être entre 0 et 50 ans",
          variant: "destructive"
        });
        return;
      }

      if (formData.hourlyRate) {
        const hourlyRate = parseFloat(formData.hourlyRate);
        if (hourlyRate < 0 || hourlyRate > 10000) {
          toast({
            title: "Erreur",
            description: "Le tarif horaire doit être entre 0 et 10000 DH",
            variant: "destructive"
          });
          return;
        }
      }
    }

    setIsLoading(true);
    
    try {
      // Register the user first
      const { error: authError } = await register(
        formData.email,
        formData.password,
        formData.name,
        role,
        formData.phone,
        formData.cin
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

      // If artisan, create artisan profile
      if (role === 'artisan') {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error: profileError } = await supabase
            .from('artisan_profiles')
            .insert({
              user_id: user.id,
              category_id: formData.categoryId,
              city_id: formData.cityId || null,
              business_name: formData.businessName || null,
              description: formData.description || null,
              experience_years: parseInt(formData.experienceYears),
              hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
              service_radius: parseInt(formData.serviceRadius),
              is_active: true,
              is_verified: false
            });

          if (profileError) {
            console.error('Error creating artisan profile:', profileError);
            toast({
              title: "Profil artisan",
              description: "Profil utilisateur créé mais erreur lors de la création du profil artisan. Vous pourrez le compléter plus tard.",
              variant: "destructive"
            });
          }
        }
      }
      
      // Close the modal and show success message
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        cin: '',
        businessName: '',
        categoryId: '',
        cityId: '',
        experienceYears: '',
        hourlyRate: '',
        description: '',
        serviceRadius: '20'
      });
      
      setTimeout(() => {
        toast({
          title: "Inscription réussie",
          description: `Bienvenue sur 9RIB ! ${role === 'artisan' 
            ? 'Votre profil artisan sera vérifié sous 24h.' 
            : 'Vous êtes maintenant connecté(e).'}`,
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
            <>
              <div className="space-y-2">
                <Label htmlFor="cin">CIN (Carte d'identité) *</Label>
                <Input
                  id="cin"
                  value={formData.cin}
                  onChange={(e) => handleInputChange('cin', e.target.value)}
                  placeholder="Ex: BK123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nom de l'entreprise</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Nom de votre entreprise (optionnel)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Catégorie de service *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityId">Ville</Label>
                <Select value={formData.cityId} onValueChange={(value) => handleInputChange('cityId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Années d'expérience *</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                    placeholder="Ex: 5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Tarif horaire (DH)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="Ex: 150"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceRadius">Rayon d'intervention (km)</Label>
                <Input
                  id="serviceRadius"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.serviceRadius}
                  onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
                  placeholder="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description de vos services</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez vos compétences, spécialités et services..."
                  rows={3}
                />
              </div>
            </>
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
