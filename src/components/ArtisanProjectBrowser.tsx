import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MapPin, Calendar, DollarSign, Phone, Mail, User, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  address: string;
  category_id: string;
  status: string;
  created_at: string;
  client_id: string;
  categories?: {
    name: string;
  };
  profiles?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const ArtisanProjectBrowser = () => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          categories(name),
          profiles!projects_client_id_fkey(name, email, phone)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = async (project: Project) => {
    setSelectedProject(project);
    
    // Track the view
    try {
      await supabase.functions.invoke('track-view', {
        body: {
          project_id: project.id,
          artisan_id: user?.id
        }
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  if (loading) {
    return <div>Chargement des projets...</div>;
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Projets Disponibles</h2>
        <p className="text-muted-foreground">
          Tous les projets ouverts
        </p>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Aucun projet disponible dans votre catégorie</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {project.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      Ouvert
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProject(project)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{project.title}</DialogTitle>
                          <DialogDescription>
                            Détails du projet et informations de contact
                          </DialogDescription>
                        </DialogHeader>
                        {selectedProject && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedProject.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Localisation</h4>
                                <p className="text-sm">{selectedProject.address}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Catégorie</h4>
                                <p className="text-sm">{selectedProject.categories?.name}</p>
                              </div>
                            </div>

                            {(selectedProject.budget_min > 0 || selectedProject.budget_max > 0) && (
                              <div>
                                <h4 className="font-semibold mb-2">Budget</h4>
                                <div className="flex items-center gap-1 text-sm">
                                  <DollarSign className="h-4 w-4" />
                                  {selectedProject.budget_min > 0 && selectedProject.budget_max > 0
                                    ? `${selectedProject.budget_min} - ${selectedProject.budget_max} MAD`
                                    : selectedProject.budget_min > 0
                                    ? `À partir de ${selectedProject.budget_min} MAD`
                                    : `Jusqu'à ${selectedProject.budget_max} MAD`}
                                </div>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-3">Informations de contact du client</h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedProject.profiles?.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <a 
                                    href={`mailto:${selectedProject.profiles?.email}`}
                                    className="text-sm text-primary hover:underline"
                                  >
                                    {selectedProject.profiles?.email}
                                  </a>
                                </div>
                                {selectedProject.profiles?.phone && (
                                  <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a 
                                      href={`tel:${selectedProject.profiles?.phone}`}
                                      className="text-sm text-primary hover:underline"
                                    >
                                      {selectedProject.profiles?.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button 
                                className="flex-1"
                                onClick={() => {
                                  window.location.href = `mailto:${selectedProject.profiles?.email}?subject=Proposition pour: ${selectedProject.title}`;
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Envoyer une proposition
                              </Button>
                              {selectedProject.profiles?.phone && (
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    window.location.href = `tel:${selectedProject.profiles?.phone}`;
                                  }}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Appeler
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {project.categories?.name}
                    </span>
                    {(project.budget_min > 0 || project.budget_max > 0) && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {project.budget_min > 0 && project.budget_max > 0
                          ? `${project.budget_min} - ${project.budget_max} MAD`
                          : project.budget_min > 0
                          ? `À partir de ${project.budget_min} MAD`
                          : `Jusqu'à ${project.budget_max} MAD`}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Client: {project.profiles?.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};