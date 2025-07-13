import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Heart, User, Mail, Phone, Edit, Loader2, AlertCircle, HeartOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FavoriteArtisan {
  id: string;
  artisan_id: string;
  created_at: string;
  artisan_profiles: {
    id: string;
    business_name: string;
    description: string;
    hourly_rate: number;
    rating_average: number;
    rating_count: number;
    is_verified: boolean;
    categories: {
      name: string;
      emoji: string;
    };
    profiles: {
      id: string;
      name: string;
      avatar_url: string;
      phone: string;
    };
  };
}

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteArtisan[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [removingFavorite, setRemovingFavorite] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchFavorites();
    }
  }, [user, isLoading, navigate]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoadingFavorites(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          artisan_id,
          created_at
        `)
        .eq('client_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos artisans favoris",
          variant: "destructive",
        });
        return;
      }

      // Get artisan profiles separately
      if (data && data.length > 0) {
        const artisanIds = data.map(fav => fav.artisan_id);
        const { data: artisanProfiles, error: artisanError } = await supabase
          .from('artisan_profiles')
          .select(`
            id,
            user_id,
            business_name,
            description,
            hourly_rate,
            rating_average,
            rating_count,
            is_verified,
            category_id,
            categories:categories(name, emoji),
            profiles:profiles(id, name, avatar_url, phone)
          `)
          .in('user_id', artisanIds);

        if (artisanError) {
          console.error('Error fetching artisan profiles:', artisanError);
          toast({
            title: "Erreur", 
            description: "Impossible de charger les profils des artisans",
            variant: "destructive",
          });
          return;
        }

        // Combine favorites with artisan profiles
        const favoritesWithProfiles = data.map(favorite => ({
          ...favorite,
          artisan_profiles: artisanProfiles?.find(profile => profile.user_id === favorite.artisan_id) || null
        })).filter(fav => fav.artisan_profiles !== null);

        setFavorites(favoritesWithProfiles as FavoriteArtisan[]);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        variant: "destructive",
      });
    } finally {
      setLoadingFavorites(false);
    }
  };

  const removeFavorite = async (favoriteId: string, artisanName: string) => {
    if (!user) return;

    try {
      setRemovingFavorite(favoriteId);
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('client_id', user.id);

      if (error) {
        console.error('Error removing favorite:', error);
        toast({
          title: "Erreur",
          description: "Impossible de retirer l'artisan des favoris",
          variant: "destructive",
        });
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast({
        title: "Succès",
        description: `${artisanName} retiré de vos favoris`,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setRemovingFavorite(null);
    }
  };

  const handleViewArtisan = (artisanId: string) => {
    navigate(`/artisan/${artisanId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mon Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.phone && (
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <Badge variant={user.role === 'artisan' ? 'default' : 'secondary'}>
                      {user.role === 'artisan' ? 'Artisan' : 'Client'}
                    </Badge>
                    {user.isVerified && (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Vérifié
                      </Badge>
                    )}
                    {user.city && (
                      <Badge variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.city}
                      </Badge>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-fit">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorites Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-destructive text-destructive" />
                Mes Artisans Favoris ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFavorites ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Chargement de vos favoris...</span>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8">
                  <HeartOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Aucun favori</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore ajouté d'artisans à vos favoris.
                  </p>
                  <Button onClick={() => navigate('/artisans')}>
                    Découvrir des artisans
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((favorite) => {
                    const artisan = favorite.artisan_profiles;
                    if (!artisan) return null;
                    
                    return (
                      <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage 
                                src={artisan.profiles?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`} 
                                alt={artisan.profiles?.name || artisan.business_name} 
                              />
                              <AvatarFallback>
                                {(artisan.profiles?.name || artisan.business_name || 'A')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-foreground truncate">
                                    {artisan.profiles?.name || artisan.business_name}
                                  </h3>
                                  {artisan.categories && (
                                    <p className="text-sm text-muted-foreground">
                                      {artisan.categories.emoji} {artisan.categories.name}
                                    </p>
                                  )}
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFavorite(favorite.id, artisan.profiles?.name || artisan.business_name)}
                                  disabled={removingFavorite === favorite.id}
                                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                >
                                  {removingFavorite === favorite.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Heart className="h-4 w-4 fill-current" />
                                  )}
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-4 mt-2">
                                {artisan.rating_average > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-accent text-accent" />
                                    <span className="text-sm font-medium">
                                      {artisan.rating_average.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      ({artisan.rating_count})
                                    </span>
                                  </div>
                                )}
                                
                                {artisan.hourly_rate && (
                                  <span className="text-sm font-medium text-foreground">
                                    {artisan.hourly_rate}€/h
                                  </span>
                                )}
                                
                                {artisan.is_verified && (
                                  <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                                    Vérifié
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() => handleViewArtisan(artisan.profiles?.id || '')}
                              >
                                Voir le profil
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;