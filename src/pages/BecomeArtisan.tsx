
import React, { useState, useEffect } from 'react';
import type { Category as CategoryType, City as CityType } from '@/hooks/useArtisans';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Users, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { STORAGE_BUCKET } from '@/integrations/supabase/storage';
import { useAuth } from '@/contexts/AuthContext';
import heroArtisan from '@/assets/hero-artisan.jpg';
import woodCarver from '@/assets/wood-carver.jpg';

const BecomeArtisan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    business_name: '',
    address: '',
    service_radius: '20',
    city_id: '',
    category_id: '',
    description: '',
    specialties: '',
    portfolio_images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchCities();
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));

      // Prefill from existing profile records
      (async () => {
        try {
          const [{ data: artisan }, { data: profile } ] = await Promise.all([
            supabase
              .from('artisan_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single(),
            supabase
              .from('profiles')
              .select('phone')
              .eq('id', user.id)
              .single(),
          ]);

          setFormData(prev => ({
            ...prev,
            phone: profile?.phone || prev.phone,
            business_name: artisan?.business_name || prev.business_name,
            address: artisan?.address || prev.address,
            service_radius: artisan?.service_radius?.toString?.() || prev.service_radius,
            city_id: artisan?.city_id || prev.city_id,
            category_id: artisan?.category_id || prev.category_id,
            description: artisan?.description || prev.description,
            specialties: (artisan?.specialties || []).join(', '),
            portfolio_images: artisan?.portfolio_images || [],
          }));
        } catch (e) {
          // Silent prefill failure
        }
      })();
    }
  }, [user]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);
    setCategories(data || []);
  };

  const fetchCities = async () => {
    const { data } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true);
    setCities(data || []);
  };

  const benefits = [
    {
      icon: Users,
      title: "Accès à des milliers de clients",
      description: "Connectez-vous avec des clients potentiels dans votre région"
    },
    {
      icon: Star,
      title: "Système de notation",
      description: "Construisez votre réputation grâce aux avis clients"
    },
    {
      icon: Shield,
      title: "Profil vérifié",
      description: "Badge de vérification pour inspirer confiance"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const specialtiesArray = formData.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      if (!user) throw new Error('Utilisateur non connecté');

      // Resolve city name for profiles.city field
      let cityName: string | null = null;
      if (formData.city_id) {
        const { data: cityRow } = await supabase
          .from('cities')
          .select('name')
          .eq('id', formData.city_id)
          .single();
        cityName = cityRow?.name || null;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: formData.phone || null,
          city: cityName,
          role: 'artisan',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select('id')
        .single();

      if (profileError) throw profileError;

      // Upsert artisan profile for this user
      const serviceRadius = parseInt(formData.service_radius || '20', 10);
      const now = new Date().toISOString();
      const { error: artisanError } = await supabase
        .from('artisan_profiles')
        .upsert({
          user_id: user.id,
          business_name: formData.business_name.trim() || null,
          address: formData.address.trim() || null,
          category_id: formData.category_id || null,
          city_id: formData.city_id || null,
          description: formData.description.trim() || null,
          specialties: specialtiesArray,
          service_radius: isNaN(serviceRadius) ? 20 : serviceRadius,
          portfolio_images: formData.portfolio_images || [],
          is_active: true,
          updated_at: now,
        }, { onConflict: 'user_id' })
        .eq('user_id', user.id)
        .select('id')
        .single();

      if (artisanError) throw artisanError;

      toast({
        title: "Profil artisan mis à jour",
        description: "Votre profil a été enregistré. Bienvenue parmi les artisans!",
      });

  navigate('/profile');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre profil artisan (droits ou RLS)",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0 opacity-5 pointer-events-none -z-10">
        <img 
          src={heroArtisan} 
          alt="Artisan marocain" 
          className="absolute top-0 right-0 w-1/3 h-1/2 object-cover"
        />
        <img 
          src={woodCarver} 
          alt="Sculpteur sur bois" 
          className="absolute bottom-0 left-0 w-1/4 h-1/3 object-cover"
        />
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Rejoignez notre réseau d'artisans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Développez votre activité en rejoignant la plateforme de référence
              pour les artisans au Maroc.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Artisan Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Profil artisan</CardTitle>
                <CardDescription>
                  Complétez votre profil pour apparaître dans les recherches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Portfolio images */}
                  <div className="space-y-2">
                    <Label>Portfolio (images)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || !user) return;
                        try {
                          setUploading(true);
                          const uploadedUrls: string[] = [];
                          for (const file of Array.from(files)) {
                            const path = `portfolio/${user.id}/${Date.now()}-${file.name}`;
                            const { data: up, error: upErr } = await supabase.storage
                              .from(STORAGE_BUCKET)
                              .upload(path, file, { upsert: false });
                            if (upErr) throw upErr;
                            const { data: pub } = supabase.storage
                              .from(STORAGE_BUCKET)
                              .getPublicUrl(up.path);
                            if (pub?.publicUrl) uploadedUrls.push(pub.publicUrl);
                          }
                          setFormData((prev) => ({
                            ...prev,
                            portfolio_images: [...(prev.portfolio_images || []), ...uploadedUrls],
                          }));
                          toast({ title: 'Images ajoutées', description: `${uploadedUrls.length} image(s) ajoutée(s)` });
                        } catch (err) {
                          console.error('Upload error:', err);
                          toast({ title: 'Erreur', description: "Échec du téléversement d'images", variant: 'destructive' });
                        } finally {
                          setUploading(false);
                          if (e.target) e.target.value = '';
                        }
                      }}
                      disabled={uploading}
                    />
                    {formData.portfolio_images && formData.portfolio_images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {formData.portfolio_images.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img src={url} alt={`portfolio-${idx}`} className="w-full h-28 object-cover rounded-md" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        disabled
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Téléphone *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+212 6XX-XXXXXX"
                      />
                    </div>
                    
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-foreground mb-2">
                        Nom de l'entreprise
                      </label>
                      <Input
                        id="business_name"
                        name="business_name"
                        type="text"
                        value={formData.business_name}
                        onChange={handleChange}
                        placeholder="Nom de votre entreprise (optionnel)"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                        Adresse
                      </label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Adresse complète (optionnel)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city_id" className="block text-sm font-medium text-foreground mb-2">
                        Ville *
                      </label>
                      <select
                        id="city_id"
                        name="city_id"
                        required
                        value={formData.city_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Sélectionnez une ville</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="category_id" className="block text-sm font-medium text-foreground mb-2">
                        Catégorie *
                      </label>
                      <select
                        id="category_id"
                        name="category_id"
                        required
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.emoji} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="service_radius" className="block text-sm font-medium text-foreground mb-2">
                        Rayon de service (km)
                      </label>
                      <Input
                        id="service_radius"
                        name="service_radius"
                        type="number"
                        min="1"
                        value={formData.service_radius}
                        onChange={handleChange}
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialties" className="block text-sm font-medium text-foreground mb-2">
                      Spécialités (séparées par des virgules)
                    </label>
                    <Input
                      id="specialties"
                      name="specialties"
                      type="text"
                      value={formData.specialties}
                      onChange={handleChange}
                      placeholder="ex: Installation électrique, Réparation, Maintenance"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                      Description de vos services
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez vos compétences et services..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer mon profil"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processus d'inscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Soumettez votre candidature</h3>
                      <p className="text-muted-foreground text-sm">Remplissez le formulaire avec vos informations</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Vérification</h3>
                      <p className="text-muted-foreground text-sm">Nous vérifions vos documents et qualifications</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Activation du profil</h3>
                      <p className="text-muted-foreground text-sm">Votre profil est activé et visible aux clients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Critères requis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-sm">Pièce d'identité valide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-sm">Minimum 2 ans d'expérience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-sm">Références vérifiables</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-sm">Assurance professionnelle (recommandée)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeArtisan;
