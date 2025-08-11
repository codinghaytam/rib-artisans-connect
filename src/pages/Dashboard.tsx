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

  const renderArtisanDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+15% this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 pending completion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 24 reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,400</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your artisan profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate('/profile')} className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/projects')} className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              View Projects
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>New client inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">Maria Alami</p>
                  <p className="text-xs text-muted-foreground">Kitchen renovation inquiry</p>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">Ahmed Bennani</p>
                  <p className="text-xs text-muted-foreground">Bathroom project update</p>
                </div>
                <Badge variant="outline">Read</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled meetings and project deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Site visit - Villa Anfa</p>
                  <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
                </div>
              </div>
              <Badge>Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Project delivery - Maârif</p>
                  <p className="text-sm text-muted-foreground">Friday at 10:00 AM</p>
                </div>
              </div>
              <Badge variant="secondary">Confirmed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClientDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 pending proposals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Saved artisans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 unread</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your projects and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Post New Project
            </Button>
            <Button variant="outline" onClick={() => navigate('/artisans')} className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Browse Artisans
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')} className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Track your ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">Kitchen Renovation</p>
                  <p className="text-xs text-muted-foreground">3 proposals received</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">Bathroom Tiling</p>
                  <p className="text-xs text-muted-foreground">In progress - 60% complete</p>
                </div>
                <Badge variant="secondary">In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Artisans</CardTitle>
          <CardDescription>Based on your recent searches and projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Mohamed Alami</p>
                <p className="text-sm text-muted-foreground">Plomberie • Casablanca</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs ml-1">4.9 (23 reviews)</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Fatima Benjelloun</p>
                <p className="text-sm text-muted-foreground">Électricité • Rabat</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs ml-1">4.8 (31 reviews)</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
        return 'Artisan Dashboard';
      case 'client':
        return 'Client Dashboard';
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