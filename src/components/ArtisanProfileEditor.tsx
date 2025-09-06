import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { STORAGE_BUCKET } from '@/integrations/supabase/storage';
import { useCategories, useCities } from '@/hooks/useArtisans';
import { Loader2, Save, ArrowLeft, Plus, X } from 'lucide-react';

interface ArtisanProfileData {
  business_name: string;
  description: string;
  category_id: string;
  city_id: string;
  service_radius: number;
  response_time_hours: number;
  specialties: string[];
  address: string;
  portfolio_images?: string[];
}

interface ArtisanProfileEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
}

const ArtisanProfileEditor: React.FC<ArtisanProfileEditorProps> = ({ onSave, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const { cities, loading: citiesLoading } = useCities();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ArtisanProfileData>({
    business_name: '',
    description: '',
    category_id: '',
    city_id: '',
    service_radius: 20,
    response_time_hours: 24,
    specialties: [],
    address: '',
    portfolio_images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  // Removed languages per schema

  const fetchArtisanProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artisan_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching artisan profile:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger votre profil artisan',
          variant: 'destructive',
        });
        return;
      }

    if (data) {
        setFormData({
          business_name: data.business_name || '',
          description: data.description || '',
          category_id: data.category_id || '',
          city_id: data.city_id || '',
          service_radius: data.service_radius || 20,
          response_time_hours: data.response_time_hours || 24,
          specialties: data.specialties || [],
      address: data.address || '',
      portfolio_images: data.portfolio_images || [],
        });
      }
    } catch (error) {
      console.error('Error fetching artisan profile:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du chargement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if (user) {
      fetchArtisanProfile();
    }
  }, [user, fetchArtisanProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation
    if (!formData.business_name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom de l\'entreprise est requis',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Erreur',
        description: 'La description est requise',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une catégorie',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('artisan_profiles')
        .update({
          business_name: formData.business_name.trim(),
          description: formData.description.trim(),
          category_id: formData.category_id,
          city_id: formData.city_id || null,
          service_radius: formData.service_radius,
          response_time_hours: formData.response_time_hours,
          specialties: formData.specialties,
          address: formData.address.trim() || null,
          portfolio_images: formData.portfolio_images || [],
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Succès',
        description: 'Votre profil artisan a été mis à jour avec succès',
      });

      if (onSave) {
        onSave();
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error updating artisan profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre profil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ArtisanProfileData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value as never,
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    try {
      setUploading(true);
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const path = `portfolio/${user.id}/${Date.now()}-${file.name}`;
  const { data: up, error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });
        if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(up.path);
        if (pub?.publicUrl) uploadedUrls.push(pub.publicUrl);
      }
      setFormData(prev => ({
        ...prev,
        portfolio_images: [...(prev.portfolio_images || []), ...uploadedUrls],
      }));
      toast({ title: 'Images ajoutées', description: `${uploadedUrls.length} image(s) ajoutée(s)` });
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Erreur', description: "Échec du téléversement d'images", variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Languages removed per schema

  if (loading || categoriesLoading || citiesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Modifier votre profil artisan</span>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Mettez à jour vos informations professionnelles pour attirer plus de clients
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Portfolio images */}
          <div className="space-y-2">
            <Label>Portfolio (images)</Label>
            <Input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="business_name">Nom de l'entreprise *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Ex: Menuiserie Alami"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Catégorie *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.emoji} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez vos services, votre expérience et ce qui vous distingue..."
              rows={4}
              required
            />
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city_id">Ville</Label>
              <Select
                value={formData.city_id}
                onValueChange={(value) => handleInputChange('city_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name} ({city.region})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Votre adresse complète"
              />
            </div>
          </div>

          {/* experience_years removed per schema */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="service_radius">Rayon d'action (km)</Label>
              <Input
                id="service_radius"
                type="number"
                min="5"
                max="100"
                value={formData.service_radius}
                onChange={(e) => handleInputChange('service_radius', parseInt(e.target.value) || 20)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="response_time_hours">Temps de réponse (heures)</Label>
              <Input
                id="response_time_hours"
                type="number"
                min="1"
                max="72"
                value={formData.response_time_hours}
                onChange={(e) => handleInputChange('response_time_hours', parseInt(e.target.value) || 24)}
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Spécialités</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Ajouter une spécialité..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" variant="outline" onClick={addSpecialty}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages removed per schema */}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArtisanProfileEditor;