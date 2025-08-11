import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Star, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  Users,
  BarChart3,
  FileText,
  Heart,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Artisans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate('/admin')} className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Button>
            <Button variant="outline" onClick={() => navigate('/artisans')} className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Artisans
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>New artisan application</span>
                <Badge variant="secondary">2h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Project completed</span>
                <Badge variant="secondary">4h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>New user registration</span>
                <Badge variant="secondary">6h ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderArtisanDashboard = () => {
    const { ArtisanProjectBrowser } = require('@/components/ArtisanProjectBrowser');
    return <ArtisanProjectBrowser />;
  };

  const renderClientDashboard = () => {
    const { ClientProjectManager } = require('@/components/ClientProjectManager');
    return <ClientProjectManager />;
  };

  const getDashboardContent = () => {
    switch (profile.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'artisan':
        return renderArtisanDashboard();
      case 'client':
        return renderClientDashboard();
      default:
        return renderClientDashboard();
    }
  };

  const getDashboardTitle = () => {
    switch (profile.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'artisan':
        return 'Projets Disponibles';
      case 'client':
        return 'Mes Projets';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getDashboardTitle()}
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {profile.name}! Here's what's happening with your account.
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {profile.role}
            </Badge>
          </div>
        </div>
        
        {getDashboardContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;