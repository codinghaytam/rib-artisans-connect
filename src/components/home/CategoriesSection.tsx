
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategoriesSection: React.FC = () => {
  const { categories, loading, error } = useCategories();
  // Select top categories based on artisan count (limit to 8)
  const topCategories = React.useMemo(() => {
    if (!categories) return [];
    return [...categories]
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 8);
  }, [categories]);

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-terracotta-500" />
            <span className="ml-2 text-lg text-gray-600">Chargement des catégories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 max-w-xl mx-auto">
            <p className="text-red-500 mb-4 text-lg">{error}</p>
            <p className="text-gray-600 mb-6">
              {error.includes("connexion") || error.includes("configuration") ? 
                "Nous rencontrons actuellement des problèmes techniques. Nos équipes travaillent à résoudre ce problème." : 
                "Veuillez réessayer plus tard ou consulter la liste complète des catégories."}
            </p>
            <Link to="/categories" className="text-terracotta-600 hover:underline">
              Voir toutes les catégories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {topCategories.map((category, index) => (
              <Card 
                key={category.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-white"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link to={`/categories/${category.id}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.emoji || '🔨'}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-terracotta-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="text-terracotta-600 font-semibold">
                      {category.count || 0} artisans
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/categories" className="text-terracotta-600 hover:text-terracotta-700 font-semibold text-lg hover:underline transition-colors">
            Voir toutes les catégories →
          </Link>
        </div>
      </div>
    </section>
  );
};
