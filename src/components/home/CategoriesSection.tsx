
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    name: 'Maçonnerie',
    icon: '🧱',
    description: 'Construction, rénovation, murs',
    count: 450
  },
  {
    name: 'Plomberie',
    icon: '🔧',
    description: 'Réparation, installation, dépannage',
    count: 380
  },
  {
    name: 'Peinture',
    icon: '🎨',
    description: 'Intérieur, extérieur, décoration',
    count: 320
  },
  {
    name: 'Électricité',
    icon: '⚡',
    description: 'Installation, réparation, dépannage',
    count: 290
  },
  {
    name: 'Menuiserie',
    icon: '🪚',
    description: 'Meubles, portes, fenêtres',
    count: 250
  },
  {
    name: 'Carrelage',
    icon: '⬜',
    description: 'Pose, rénovation, zellige',
    count: 180
  },
  {
    name: 'Couture',
    icon: '✂️',
    description: 'Vêtements, réparation, sur-mesure',
    count: 160
  },
  {
    name: 'Ferronnerie',
    icon: '🔨',
    description: 'Portails, grilles, soudure',
    count: 140
  }
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Catégories populaires
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos artisans spécialisés dans tous les domaines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Card 
              key={category.name}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-white"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-terracotta-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
                <div className="text-terracotta-600 font-semibold">
                  {category.count} artisans
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="text-terracotta-600 hover:text-terracotta-700 font-semibold text-lg hover:underline transition-colors">
            Voir toutes les catégories →
          </button>
        </div>
      </div>
    </section>
  );
};
