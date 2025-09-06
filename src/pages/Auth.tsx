import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: 'client' as UserRole
  });

  // Redirect authenticated users
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Seed demo accounts once (safe/idempotent)
  React.useEffect(() => {
    const seed = async () => {
      try {
        if (localStorage.getItem('seeded-demo-accounts') === '1') return;
        const { data, error } = await supabase.functions.invoke('seed-demo-accounts');
        if (!error) {
          localStorage.setItem('seeded-demo-accounts', '1');
        }
      } catch {}
    };
    seed();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error } = await login(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur 9RIB !",
      });
      navigate(from, { replace: true });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.password || !registerData.name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error, needsEmailConfirmation } = await register(
      registerData.email,
      registerData.password,
      registerData.name,
      registerData.role,
      registerData.phone || undefined
    );
    
    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error,
        variant: "destructive"
      });
    } else if (needsEmailConfirmation) {
      toast({
        title: "Vérification email requise",
        description: "Veuillez vérifier votre email pour activer votre compte",
      });
    } else {
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur 9RIB !",
      });
      navigate(from, { replace: true });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">9</span>
              </div>
              <span className="text-3xl font-bold text-primary">
                9RIB
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bienvenue sur 9RIB
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        'Se connecter'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    {/* Client-only registration; artisans use dedicated page */}
                    <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                      Vous êtes artisan ? Utilisez la page dédiée pour vous inscrire.
                      <Link to="/become-artisan" className="ml-2 text-primary underline underline-offset-2">
                        Devenir artisan →
                      </Link>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Nom complet *</Label>
                        <Input
                          id="register-name"
                          type="text"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Votre nom"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email *</Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="votre@email.com"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-phone">Téléphone</Label>
                        <Input
                          id="register-phone"
                          type="tel"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+212 6XX-XXXXXX"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Mot de passe *</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">Confirmer le mot de passe *</Label>
                        <Input
                          id="register-confirm-password"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Inscription...
                          </>
                        ) : (
                          "S'inscrire"
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>



          <div className="text-center mt-6">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;