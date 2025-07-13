
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Users, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import heroArtisan from '@/assets/hero-artisan.jpg';
import woodCarver from '@/assets/wood-carver.jpg';

const BecomeArtisan = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cin: '',
    business_name: '',
    city_id: '',
    category_id: '',
    experience_years: '',
    description: '',
    specialties: ''
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchCities();
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
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

      const applicationData = {
        user_id: user?.id || null,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        business_name: formData.business_name,
        category_id: formData.category_id,
        city_id: formData.city_id,
        description: formData.description,
        experience_years: parseInt(formData.experience_years),
        specialties: specialtiesArray,
        status: 'not_read'
      };

      const { error } = await supabase
        .from('artisan_applications')
        .insert([applicationData]);

      if (error) throw error;

      toast({
        title: "Candidature envoyée",
        description: "Nous examinerons votre demande et vous contacterons sous 48h.",
      });

      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        cin: '',
        business_name: '',
        city_id: '',
        category_id: '',
        experience_years: '',
        description: '',
        specialties: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre candidature.",
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
      <div className="absolute inset-0 opacity-5">
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
            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Candidature d'artisan</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour rejoindre notre plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
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
                    <div>
                      <label htmlFor="cin" className="block text-sm font-medium text-foreground mb-2">
                        CIN *
                      </label>
                      <Input
                        id="cin"
                        name="cin"
                        type="text"
                        required
                        value={formData.cin}
                        onChange={handleChange}
                        placeholder="Votre CIN"
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

                  <div>
                    <label htmlFor="experience_years" className="block text-sm font-medium text-foreground mb-2">
                      Années d'expérience *
                    </label>
                    <Input
                      id="experience_years"
                      name="experience_years"
                      type="number"
                      required
                      min="0"
                      value={formData.experience_years}
                      onChange={handleChange}
                      placeholder="Nombre d'années"
                    />
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
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer ma candidature"
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
