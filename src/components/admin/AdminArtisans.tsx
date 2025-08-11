import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      const { data, error } = await supabase
        .from("artisan_profiles")
        .select(`
          *,
          profiles(name, email, phone),
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
  };

  const toggleArtisanStatus = async (artisanId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from("artisan_profiles")
        .update({ [field]: value })
        .eq("id", artisanId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });

      await fetchArtisans();
    } catch (error) {
      console.error("Error updating artisan:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
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
            <TableHead>Nom</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Projets</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artisans.map((artisan) => (
            <TableRow key={artisan.id}>
              <TableCell className="font-medium">{artisan.profiles?.name}</TableCell>
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
              <TableCell>{artisan.total_projects}</TableCell>
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
                      onClick={() => setSelectedArtisan(artisan)}
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
                            <label className="font-semibold">Nom</label>
                            <p>{selectedArtisan.profiles?.name}</p>
                          </div>
                          <div>
                            <label className="font-semibold">Email</label>
                            <p>{selectedArtisan.profiles?.email}</p>
                          </div>
                          <div>
                            <label className="font-semibold">Téléphone</label>
                            <p>{selectedArtisan.profiles?.phone}</p>
                          </div>
                          <div>
                            <label className="font-semibold">Entreprise</label>
                            <p>{selectedArtisan.business_name}</p>
                          </div>
                          <div>
                            <label className="font-semibold">Expérience</label>
                            <p>{selectedArtisan.experience_years} ans</p>
                          </div>
                          <div>
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold">Description</label>
                          <p className="mt-1 text-sm">{selectedArtisan.description}</p>
                        </div>

                        <div>
                          <label className="font-semibold">Spécialités</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedArtisan.specialties?.map((specialty) => (
                              <Badge key={specialty} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
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