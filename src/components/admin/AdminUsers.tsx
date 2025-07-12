import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  phone: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

const roleConfig = {
  client: { label: "Client", variant: "secondary" as const },
  artisan: { label: "Artisan", variant: "default" as const },
  admin: { label: "Admin", variant: "destructive" as const },
};

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            <TableHead>Rôle</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'inscription</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const role = roleConfig[user.role as keyof typeof roleConfig];
            
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={role?.variant || "secondary"}>
                    {role?.label || user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.city || "-"}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {user.is_verified && (
                      <Badge variant="outline" className="text-green-600">
                        Vérifié
                      </Badge>
                    )}
                    {user.is_active && (
                      <Badge variant="outline" className="text-blue-600">
                        Actif
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun utilisateur trouvé
        </div>
      )}
    </div>
  );
};