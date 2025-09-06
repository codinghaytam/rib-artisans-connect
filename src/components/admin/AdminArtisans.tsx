import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Star, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Artisan {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  experience_years: number;
  rating_average: number;
  rating_count: number;
  total_projects: number;
  is_verified: boolean;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  specialties: string[];
  profiles: {
    name: string;
    email: string;
    phone: string;
  };
  categories: {
    name: string;
    emoji: string;
  };
  cities: {
    name: string;
  };
}

export const AdminArtisans = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [saving, setSaving] = useState(false);
  // Editable fields state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBusinessName, setEditBusinessName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSpecialties, setEditSpecialties] = useState("");
  const { toast } = useToast();

  const fetchArtisans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("artisan_profiles")
        .select(`
          *,
          profiles(email, phone),
          categories(name, emoji),
          cities(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArtisans(data || []);
    } catch (error) {
      console.error("Error fetching artisans:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les artisans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  const toggleArtisanStatus = async (artisanId: string, field: string, value: boolean) => {
    try {
      // Optimistic UI update
      setArtisans(prev => prev.map(a => a.id === artisanId ? { ...a, [field]: value } as Artisan : a));
      setSelectedArtisan(prev => prev ? (prev.id === artisanId ? { ...prev, [field]: value } as Artisan : prev) : prev);

      // Do update and require a returned row; if RLS denies, .single() will error
      const { data, error } = await supabase
        .from("artisan_profiles")
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq("id", artisanId)
        .select("id, is_active, is_featured, is_verified")
        .single();

      if (error || !data) throw error || new Error('Mise à jour non autorisée');

      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating artisan:", error);
      // Rollback optimistic change
      setArtisans(prev => prev.map(a => a.id === artisanId ? { ...a, [field]: !value } as Artisan : a));
      setSelectedArtisan(prev => prev ? (prev.id === artisanId ? { ...prev, [field]: !value } as Artisan : prev) : prev);
      toast({
        title: "Erreur",
        description: "Mise à jour refusée (droits insuffisants ou RLS).",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entreprise</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artisans.map((artisan) => (
            <TableRow key={artisan.id}>
              <TableCell>{artisan.business_name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{artisan.categories?.emoji}</span>
                  {artisan.categories?.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {artisan.cities?.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{artisan.rating_average?.toFixed(1) || "0.0"}</span>
                  <span className="text-muted-foreground">({artisan.rating_count})</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {artisan.is_verified && (
                    <Badge variant="outline" className="text-green-600">
                      Vérifié
                    </Badge>
                  )}
                  {artisan.is_active && (
                    <Badge variant="outline" className="text-blue-600">
                      Actif
                    </Badge>
                  )}
                  {artisan.is_featured && (
                    <Badge variant="outline" className="text-purple-600">
                      Mis en avant
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedArtisan(artisan);
                        // Seed edit state from selected artisan
                        setEditEmail(artisan.profiles?.email || "");
                        setEditPhone(artisan.profiles?.phone || "");
                        setEditBusinessName(artisan.business_name || "");
                        setEditDescription(artisan.description || "");
                        setEditSpecialties((artisan.specialties || []).join(", "));
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Gérer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Gestion de l'artisan</DialogTitle>
                      <DialogDescription>
                        Consultez et modifiez les informations de l'artisan
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedArtisan && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                      
                          <div>
                            <label className="font-semibold">Email</label>
                            <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@example.com" />
                          </div>
                          <div>
                            <label className="font-semibold">Téléphone</label>
                            <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+212 ..." />
                          </div>
                          <div>
                            <label className="font-semibold">Entreprise</label>
                            <Input value={editBusinessName} onChange={(e) => setEditBusinessName(e.target.value)} placeholder="Raison sociale" />
                          </div>
                          {/* experience_years removed per schema */}
                          <div>
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold">Description</label>
                          <Textarea className="mt-1" rows={4} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description de l'artisan" />
                        </div>

                        <div>
                          <label className="font-semibold">Spécialités</label>
                          <Input className="mt-1" value={editSpecialties} onChange={(e) => setEditSpecialties(e.target.value)} placeholder="Séparées par des virgules" />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={async () => {
                              if (!selectedArtisan) return;
                              try {
                                setSaving(true);
                                // Update profiles (name, email, phone)
                                const { error: profileErr } = await supabase
                                  .from('profiles')
                                  .update({
                                    email: editEmail.trim() || null,
                                    phone: editPhone.trim() || null,
                                    updated_at: new Date().toISOString(),
                                  })
                                  .eq('id', selectedArtisan.user_id)
                                  .select('id')
                                  .single();

                                if (profileErr) throw profileErr;

                                // Update artisan_profiles (business_name, description, specialties)
                                const specialtiesArray = editSpecialties
                                  .split(',')
                                  .map(s => s.trim())
                                  .filter(Boolean);

                                const { error: artisanErr } = await supabase
                                  .from('artisan_profiles')
                                  .update({
                                    business_name: editBusinessName.trim() || null,
                                    description: editDescription.trim() || null,
                                    specialties: specialtiesArray,
                                    updated_at: new Date().toISOString(),
                                  })
                                  .eq('id', selectedArtisan.id)
                                  .select('id')
                                  .single();

                                if (artisanErr) throw artisanErr;

                                toast({ title: 'Succès', description: "Informations mises à jour" });
                                // Reflect in UI
                                setArtisans(prev => prev.map(a => a.id === selectedArtisan.id ? {
                                  ...a,
                                  business_name: editBusinessName,
                                  description: editDescription,
                                  specialties: specialtiesArray,
                                  profiles: {
                                    ...a.profiles,
                                    name: editName,
                                    email: editEmail,
                                    phone: editPhone,
                                  }
                                } as Artisan : a));
                              } catch (err) {
                                console.error('Admin save error:', err);
                                toast({ title: 'Erreur', description: "Mise à jour refusée (droits/RLS)", variant: 'destructive' });
                              } finally {
                                setSaving(false);
                              }
                            }}
                            disabled={saving}
                          >
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                          <Button
                            onClick={() => toggleArtisanStatus(selectedArtisan.id, "is_active", !selectedArtisan.is_active)}
                            variant={selectedArtisan.is_active ? "destructive" : "default"}
                          >
                            {selectedArtisan.is_active ? "Désactiver" : "Activer"}
                          </Button>
                          
                          <Button
                            onClick={() => toggleArtisanStatus(selectedArtisan.id, "is_featured", !selectedArtisan.is_featured)}
                            variant={selectedArtisan.is_featured ? "outline" : "default"}
                          >
                            {selectedArtisan.is_featured ? "Retirer de la mise en avant" : "Mettre en avant"}
                          </Button>
                          
                          <Button
                            onClick={() => toggleArtisanStatus(selectedArtisan.id, "is_verified", !selectedArtisan.is_verified)}
                            variant="outline"
                          >
                            {selectedArtisan.is_verified ? "Retirer la vérification" : "Vérifier"}
                          </Button>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>Inscrit le : {format(new Date(selectedArtisan.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {artisans.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun artisan trouvé
        </div>
      )}
    </div>
  );
};