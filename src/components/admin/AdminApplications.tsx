import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, CheckCircle, Clock, XCircle, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Application {
  id: string;
  name: string;
  email: string;
  business_name: string;
  status: string;
  created_at: string;
  description: string;
  experience_years: number;
  specialties: string[];
  admin_notes: string;
  phone: string;
  categories: { name: string };
  cities: { name: string };
}

const statusConfig = {
  not_read: { label: "Non lu", variant: "secondary" as const, icon: Eye },
  in_progress: { label: "En cours", variant: "default" as const, icon: Clock },
  validated: { label: "Validé", variant: "default" as const, icon: CheckCircle },
  rejected: { label: "Rejeté", variant: "destructive" as const, icon: XCircle },
};

export const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("artisan_applications")
        .select(`
          *,
          categories(name),
          cities(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processApplication = async (applicationId: string, action: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.functions.invoke("process-application", {
        body: {
          applicationId,
          action,
          adminNotes,
        },
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Demande traitée avec succès",
      });

      await fetchApplications();
      setSelectedApplication(null);
      setAdminNotes("");
    } catch (error) {
      console.error("Error processing application:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du traitement de la demande",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
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
            <TableHead>Email</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const status = statusConfig[application.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            
            return (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.business_name}</TableCell>
                <TableCell>{application.categories?.name}</TableCell>
                <TableCell>
                  <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(application.created_at), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setAdminNotes(application.admin_notes || "");
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Détails de la demande</DialogTitle>
                        <DialogDescription>
                          Examinez les détails et traitez la demande d'inscription
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedApplication && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold">Nom</Label>
                              <p>{selectedApplication.name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Email</Label>
                              <p>{selectedApplication.email}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Téléphone</Label>
                              <p>{selectedApplication.phone}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Entreprise</Label>
                              <p>{selectedApplication.business_name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Catégorie</Label>
                              <p>{selectedApplication.categories?.name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Ville</Label>
                              <p>{selectedApplication.cities?.name}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Expérience</Label>
                              <p>{selectedApplication.experience_years} ans</p>
                            </div>
                          </div>

                          <div>
                            <Label className="font-semibold">Description</Label>
                            <p className="mt-1 text-sm">{selectedApplication.description}</p>
                          </div>

                          <div>
                            <Label className="font-semibold">Spécialités</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedApplication.specialties?.map((specialty) => (
                                <Badge key={specialty} variant="outline">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="admin-notes">Notes administratives</Label>
                            <Textarea
                              id="admin-notes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Ajoutez des notes pour cette demande..."
                              className="mt-1"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2 pt-4">
                            {selectedApplication.status === "not_read" && (
                              <Button
                                onClick={() => processApplication(selectedApplication.id, "request_verification")}
                                disabled={processing}
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                Demander vérification email
                              </Button>
                            )}
                            
                            <Button
                              onClick={() => processApplication(selectedApplication.id, "request_payment")}
                              disabled={processing}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Clock className="h-4 w-4" />
                              Demander paiement
                            </Button>
                            
                            <Button
                              onClick={() => processApplication(selectedApplication.id, "validate")}
                              disabled={processing}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Valider et créer compte
                            </Button>
                            
                            <Button
                              onClick={() => processApplication(selectedApplication.id, "reject")}
                              disabled={processing}
                              variant="destructive"
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {applications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucune demande d'artisan trouvée
        </div>
      )}
    </div>
  );
};