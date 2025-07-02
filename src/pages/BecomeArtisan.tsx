
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BecomeArtisan = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cin: '',
    city: '',
    category: '',
    experience: '',
    description: ''
  });
  const { toast } = useToast();

  const categories = [
    'Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 
    'Maçonnerie', 'Rénovation', 'Jardinage', 'Automobile'
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Candidature envoyée",
      description: "Nous examinerons votre demande et vous contacterons sous 48h.",
    });
    setFormData({
      name: '', email: '', phone: '', cin: '', city: '',
      category: '', experience: '', description: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rejoignez notre réseau d'artisans
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                    <div className="mx-auto mb-4 p-3 rounded-full bg-terracotta-100">
                      <IconComponent className="h-6 w-6 text-terracotta-600" />
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
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="cin" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Ville *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Votre ville"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience *
                    </label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      required
                      min="0"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Nombre d'années"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700"
                  >
                    Envoyer ma candidature
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
                    <div className="flex-shrink-0 w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <span className="text-terracotta-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Soumettez votre candidature</h3>
                      <p className="text-gray-600 text-sm">Remplissez le formulaire avec vos informations</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <span className="text-terracotta-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Vérification</h3>
                      <p className="text-gray-600 text-sm">Nous vérifions vos documents et qualifications</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <span className="text-terracotta-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Activation du profil</h3>
                      <p className="text-gray-600 text-sm">Votre profil est activé et visible aux clients</p>
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
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Pièce d'identité valide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Minimum 2 ans d'expérience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Références vérifiables</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
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
