import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Phone, Mail, Clock, Award, User, Camera, MessageSquare, Loader2, AlertCircle, Edit, Plus } from 'lucide-react';
import { useArtisanProfile, useArtisanReviews } from '@/hooks/useArtisanProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewForm } from '@/components/ReviewForm';

const ArtisanProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);
  
  const { artisan, loading: artisanLoading, error: artisanError } = useArtisanProfile(id || '');
  const { reviews, loading: reviewsLoading, error: reviewsError } = useArtisanReviews(id || '', refreshReviews);

  const handleReviewAdded = () => {
    setRefreshReviews(prev => prev + 1);
    setShowReviewForm(false);
    toast({
      title: "Succès",
      description: "Votre avis a été publié avec succès!"
    });
  };

  // Track artisan profile view
  useEffect(() => {
    if (id && artisan) {
      const trackView = async () => {
        try {
          await supabase.functions.invoke('track-view', {
            body: {
              type: 'artisan',
              target_id: id,
              viewer_id: user?.id || null,
              viewer_ip: null, // Will be determined by the edge function
              user_agent: navigator.userAgent
            }
          });
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      };

      trackView();
    }
  }, [id, artisan, user]);

  const handleContact = (type: 'phone' | 'email', value: string) => {
    if (type === 'phone') {
      navigator.clipboard.writeText(value);
      toast({
        title: "Contact",
        description: `Numéro de téléphone copié: ${value}`,
      });
    } else {
      window.location.href = `mailto:${value}`;
    }
  };

  if (artisanLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-foreground">Chargement du profil...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (artisanError || !artisan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <p className="text-xl text-destructive mb-4">
              Erreur lors du chargement du profil
            </p>
            <p className="text-muted-foreground mb-6">{artisanError || "Artisan non trouvé"}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={artisan.profiles?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face`}
                    alt={artisan.profiles?.name || artisan.business_name || 'Artisan'}
                    className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {artisan.profiles?.name || artisan.business_name}
                      </h1>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {artisan.categories?.emoji && (
                          <span className="text-xl">{artisan.categories.emoji}</span>
                        )}
                        <span className="text-lg text-muted-foreground">{artisan.categories?.name}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {artisan.is_verified && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            <Award className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        )}
                        {artisan.is_featured && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                            ⭐ Vedette
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {artisan.experience_years || 0} ans d'expérience
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-accent text-accent mr-1" />
                          <span className="font-medium">{artisan.rating_average?.toFixed(1) || '0.0'}</span>
                          <span className="ml-1">({artisan.rating_count || 0} avis)</span>
                        </div>
                        
                        {artisan.cities && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {artisan.cities.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      
                      <div className="flex flex-col gap-2">
                        {/* Show edit button if viewing own profile */}
                        {user && user.id === artisan.user_id && (
                          <Button 
                            variant="outline"
                            onClick={() => window.location.href = '/profile'}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier mon profil
                          </Button>
                        )}
                        
                        {artisan.profiles?.phone && user?.id !== artisan.user_id && (
                          <Button 
                            onClick={() => handleContact('phone', artisan.profiles?.phone || '')}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Appeler
                          </Button>
                        )}
                        
                        {artisan.profiles?.email && user?.id !== artisan.user_id && (
                          <Button 
                            variant="outline"
                            onClick={() => handleContact('email', artisan.profiles?.email || '')}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">
                <User className="h-4 w-4 mr-2" />
                À propos
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <Camera className="h-4 w-4 mr-2" />
                Galerie
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <MessageSquare className="h-4 w-4 mr-2" />
                Avis ({artisan.rating_count || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {artisan.description || "Aucune description disponible."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-semibold mb-3">Informations</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expérience:</span>
                          <span>{artisan.experience_years || 0} ans</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projets réalisés:</span>
                          <span>{artisan.total_projects || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temps de réponse:</span>
                          <span>{artisan.response_time_hours || 24}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rayon d'action:</span>
                          <span>{artisan.service_radius || 20} km</span>
                        </div>
                      </div>
                    </div>
                    
                    {artisan.specialties && artisan.specialties.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Spécialités</h3>
                        <div className="flex flex-wrap gap-2">
                          {artisan.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {artisan.languages && artisan.languages.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Langues parlées</h3>
                      <div className="flex flex-wrap gap-2">
                        {artisan.languages.map((language, index) => (
                          <Badge key={index} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>
                    Découvrez quelques réalisations de cet artisan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {artisan.portfolio_images && artisan.portfolio_images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {artisan.portfolio_images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune image de portfolio disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Add Review Button (only show if not viewing own profile and user is logged in) */}
                {user && user.id !== artisan.user_id && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Avis clients</CardTitle>
                          <CardDescription>
                            {reviews && reviews.length > 0 
                              ? `${reviews.length} avis client${reviews.length > 1 ? 's' : ''}`
                              : "Aucun avis pour le moment"
                            }
                          </CardDescription>
                        </div>
                        <Button 
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          variant={showReviewForm ? "outline" : "default"}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {showReviewForm ? "Annuler" : "Laisser un avis"}
                        </Button>
                      </div>
                    </CardHeader>
                    {showReviewForm && (
                      <CardContent>
                        <ReviewForm 
                          artisanId={artisan.user_id} 
                          onReviewAdded={handleReviewAdded}
                        />
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Reviews List */}
                <Card>
                  {!user || user.id === artisan.user_id ? (
                    <CardHeader>
                      <CardTitle>Avis clients</CardTitle>
                      <CardDescription>
                        {reviews && reviews.length > 0 
                          ? `${reviews.length} avis client${reviews.length > 1 ? 's' : ''}`
                          : "Aucun avis pour le moment"
                        }
                      </CardDescription>
                    </CardHeader>
                  ) : null}
                  <CardContent>
                    {reviewsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Chargement des avis...</span>
                      </div>
                    ) : reviews && reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? 'fill-accent text-accent'
                                            : 'text-muted'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-medium">{review.rating}/5</span>
                                </div>
                                {review.title && (
                                  <h4 className="font-medium text-foreground">{review.title}</h4>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(review.created_at || '').toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            
                            {review.comment && (
                              <p className="text-foreground mb-3">{review.comment}</p>
                            )}
                            
                            {(review.work_quality_rating || review.communication_rating || review.timeliness_rating) && (
                              <div className="flex flex-wrap gap-4 text-sm">
                                {review.work_quality_rating && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Qualité:</span>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= review.work_quality_rating!
                                              ? 'fill-accent text-accent'
                                              : 'text-muted'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {review.communication_rating && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Communication:</span>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= review.communication_rating!
                                              ? 'fill-accent text-accent'
                                              : 'text-muted'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {review.timeliness_rating && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Ponctualité:</span>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= review.timeliness_rating!
                                              ? 'fill-accent text-accent'
                                              : 'text-muted'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun avis disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtisanProfile;