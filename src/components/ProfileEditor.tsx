import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Save, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { STORAGE_BUCKET } from '@/integrations/supabase/storage';

type City = { id: string; name: string };

interface ProfileEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave, onCancel }) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    city: user?.city || '',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  useEffect(() => {
    const loadCities = async () => {
      const { data } = await supabase
        .from('cities')
        .select('id,name')
        .eq('is_active', true);
      setCities(data || []);
      if (user?.city && data) {
        const match = data.find((c) => c.name === user.city);
        if (match) setSelectedCityId(match.id);
      }
    };
    loadCities();
  }, [user?.city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation
    try {
      setSaving(true);
      await updateProfile({
        phone: formData.phone.trim() || undefined,
  city: formData.city.trim() || undefined,
      });

      toast({
        title: 'Succès',
        description: 'Votre profil a été mis à jour avec succès',
      });

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre profil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
  const { data: up, error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true, cacheControl: '3600' });
      if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      const url = pub.publicUrl;
      await updateProfile({ avatar: url });
      toast({ title: 'Photo mise à jour' });
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast({ title: 'Erreur', description: "Impossible de téléverser la photo", variant: 'destructive' });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCityId(id);
    const name = cities.find((c) => c.id === id)?.name || '';
    setFormData((prev) => ({ ...prev, city: name }));
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Modifier votre profil
        </CardTitle>
        <CardDescription>
          Mettez à jour vos informations personnelles
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Téléversement...' : 'Changer la photo'}
            </Button>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                L'email ne peut pas être modifié
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city_id">Ville</Label>
              <select
                id="city_id"
                value={selectedCityId}
                onChange={handleCityChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sélectionnez une ville</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* CIN removed per new schema */}
          </div>

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

export default ProfileEditor;