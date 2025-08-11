import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const reviewSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  comment: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères').max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  rating: z.number().min(1, 'Veuillez donner une note').max(5, 'La note maximum est 5'),
  work_quality_rating: z.number().min(1).max(5).optional(),
  communication_rating: z.number().min(1).max(5).optional(),
  timeliness_rating: z.number().min(1).max(5).optional(),
  would_recommend: z.boolean().default(true)
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  artisanId: string;
  onReviewAdded: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ artisanId, onReviewAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: '',
      comment: '',
      rating: 5,
      work_quality_rating: 5,
      communication_rating: 5,
      timeliness_rating: 5,
      would_recommend: true
    }
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour laisser un avis",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For direct artisan reviews, we'll use a dummy project_id since the schema requires it
      // In a real implementation, you might want to modify the schema to make project_id optional
      const { error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: user.id,
          reviewee_id: artisanId,
          project_id: '00000000-0000-0000-0000-000000000000', // Dummy project for direct artisan reviews
          title: data.title,
          comment: data.comment,
          rating: data.rating,
          work_quality_rating: data.work_quality_rating,
          communication_rating: data.communication_rating,
          timeliness_rating: data.timeliness_rating,
          would_recommend: data.would_recommend
        });

      if (error) {
        console.error('Error submitting review:', error);
        toast({
          title: "Erreur",
          description: "Impossible de soumettre votre avis. Veuillez réessayer.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Avis soumis",
        description: "Votre avis a été ajouté avec succès!"
      });

      form.reset();
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{ 
    value: number; 
    onChange: (value: number) => void;
    label: string;
  }> = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground hover:text-accent'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Laisser un avis</CardTitle>
          <CardDescription>
            Connectez-vous pour laisser un avis sur cet artisan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Vous devez être connecté pour laisser un avis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laisser un avis</CardTitle>
        <CardDescription>
          Partagez votre expérience avec cet artisan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    label="Note générale *"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'avis *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Excellent travail, très professionnel..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre expérience avec cet artisan..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="work_quality_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value || 5}
                      onChange={field.onChange}
                      label="Qualité du travail"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communication_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value || 5}
                      onChange={field.onChange}
                      label="Communication"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeliness_rating"
                render={({ field }) => (
                  <FormItem>
                    <StarRating
                      value={field.value || 5}
                      onChange={field.onChange}
                      label="Ponctualité"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Publier l\'avis'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};