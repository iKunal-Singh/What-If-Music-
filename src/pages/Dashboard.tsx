
import { useAuthContext } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardUsers from "@/components/dashboard/DashboardUsers";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardUploads from "@/components/dashboard/DashboardUploads";
import DashboardSettings from "@/components/dashboard/DashboardSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import APIErrorBoundary from "@/components/common/APIErrorBoundary";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000, // 1 minute
    },
  },
});

const Dashboard = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract tab from URL parameters or default to "overview"
  const urlParams = new URLSearchParams(location.search);
  const defaultTab = urlParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL with the selected tab
    navigate(`/dashboard?tab=${value}`, { replace: true });
  };
  
  console.log(`Dashboard: user=${!!user}, loading=${loading}, activeTab=${activeTab}`);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }
  
  // The RequireAuth component in App.tsx should handle redirection if user is not authenticated
  // This is just an additional safety check
  if (!user) {
    console.log("Dashboard: No user found, this should be handled by RequireAuth");
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <APIErrorBoundary fallbackMessage="Failed to load dashboard">
        <DashboardLayout>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-6 border-b w-full justify-start rounded-none gap-6 px-0 h-auto pb-4">
              <TabsTrigger value="overview" className="data-[state=active]:shadow-none text-md">Overview</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:shadow-none text-md">User Insights</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:shadow-none text-md">Content Management</TabsTrigger>
              <TabsTrigger value="uploads" className="data-[state=active]:shadow-none text-md">Upload Management</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:shadow-none text-md">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="users">
              <DashboardUsers />
            </TabsContent>

            <TabsContent value="content">
              <DashboardContent />
            </TabsContent>

            <TabsContent value="uploads">
              <DashboardUploads />
            </TabsContent>

            <TabsContent value="settings">
              <DashboardSettings />
            </TabsContent>
          </Tabs>
        </DashboardLayout>
      </APIErrorBoundary>
    </QueryClientProvider>
  );
};

export default Dashboard;
