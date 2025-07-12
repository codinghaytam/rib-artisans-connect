import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminApplications } from "@/components/admin/AdminApplications";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminArtisans } from "@/components/admin/AdminArtisans";
import { Shield, Users, Briefcase, FileText } from "lucide-react";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { user } = useAuth();

  // For now, redirect if not user (will add admin check after creating admin users)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Administration</h1>
          </div>
          <p className="text-muted-foreground">
            Gérez les demandes d'artisans, les utilisateurs et les comptes artisans
          </p>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Demandes d'artisans
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="artisans" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Artisans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Demandes d'inscription d'artisans</CardTitle>
                <CardDescription>
                  Gérez les demandes d'inscription des nouveaux artisans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplications />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Consultez et gérez tous les utilisateurs de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUsers />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artisans">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des artisans</CardTitle>
                <CardDescription>
                  Consultez et gérez les comptes artisans vérifiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminArtisans />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;