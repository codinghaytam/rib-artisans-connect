
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap, Hammer, Paintbrush, Home, Car } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: "Plomberie",
    description: "Installation, réparation et maintenance des systèmes de plomberie",
    icon: Wrench,
    count: 156,
    color: "text-blue-600"
  },
  {
    id: 2,
    name: "Électricité",
    description: "Services électriques résidentiels et commerciaux",
    icon: Zap,
    count: 124,
    color: "text-yellow-600"
  },
  {
    id: 3,
    name: "Menuiserie",
    description: "Travail du bois, meubles sur mesure et aménagements",
    icon: Hammer,
    count: 89,
    color: "text-amber-600"
  },
  {
    id: 4,
    name: "Peinture",
    description: "Peinture intérieure et extérieure, décoration",
    icon: Paintbrush,
    count: 73,
    color: "text-purple-600"
  },
  {
    id: 5,
    name: "Rénovation",
    description: "Rénovation complète et aménagement d'intérieur",
    icon: Home,
    count: 67,
    color: "text-green-600"
  },
  {
    id: 6,
    name: "Automobile",
    description: "Réparation et entretien automobile",
    icon: Car,
    count: 45,
    color: "text-red-600"
  }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Catégories d'artisans
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez nos différentes catégories d'artisans professionnels
              pour tous vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 p-4 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                      <IconComponent className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {category.name}
                      <Badge variant="secondary" className="bg-terracotta-100 text-terracotta-800">
                        {category.count}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vous ne trouvez pas votre catégorie ?
              </h2>
              <p className="text-gray-600 mb-6">
                Contactez-nous pour ajouter votre spécialité à notre plateforme.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-medium rounded-lg transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
