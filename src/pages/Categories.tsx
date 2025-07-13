
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, Zap, Hammer, Paintbrush, Home, Car, Building, 
  Square, Scissors, Leaf, Sparkles, Loader2
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Map of icon names to icon components
const iconMap = {
  Wrench: Wrench,
  Zap: Zap,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  Home: Home,
  Car: Car,
  Building: Building,
  Square: Square,
  Scissors: Scissors,
  Leaf: Leaf,
  Sparkles: Sparkles
};

// Map of categories to colors
const colorMap: Record<string, string> = {
  "Plomberie": "text-blue-600",
  "Électricité": "text-yellow-600",
  "Menuiserie": "text-amber-600",
  "Peinture": "text-purple-600",
  "Rénovation": "text-green-600",
  "Maçonnerie": "text-stone-600",
  "Carrelage": "text-cyan-600",
  "Couture": "text-pink-600",
  "Ferronnerie": "text-gray-800",
  "Jardinage": "text-emerald-600",
  "Nettoyage": "text-sky-600",
  "Automobile": "text-red-600",
};

const Categories = () => {
  const { categories, loading, error } = useCategories();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Catégories d'artisans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez nos différentes catégories d'artisans professionnels
              pour tous vos besoins.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-2 text-lg text-muted-foreground">Chargement des catégories...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => {
                // Find the corresponding icon component or default to Wrench
                const IconComponent = category.icon ? iconMap[category.icon as keyof typeof iconMap] || Wrench : Wrench;
                // Find the corresponding color or default to blue
                const color = colorMap[category.name] || "text-blue-600";
                
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className={`mx-auto mb-4 p-4 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                        <IconComponent className={`h-8 w-8 ${color}`} />
                        {category.emoji && <span className="text-2xl ml-2">{category.emoji}</span>}
                      </div>
                      <CardTitle className="flex items-center justify-center gap-2">
                        {category.name}
                        <Badge variant="secondary">
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
          )}

          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Vous ne trouvez pas votre catégorie ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Contactez-nous pour ajouter votre spécialité à notre plateforme.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
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
