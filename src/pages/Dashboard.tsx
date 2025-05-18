
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardUsers from "@/components/dashboard/DashboardUsers";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardUploads from "@/components/dashboard/DashboardUploads";
import DashboardSettings from "@/components/dashboard/DashboardSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Protect dashboard from unauthorized access with better loading handling
  useEffect(() => {
    setMounted(true);
    
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate, loading]);

  // Don't render until we've checked auth status to prevent flashing content
  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <DashboardLayout>
      <Tabs defaultValue="overview" className="w-full">
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
  );
};

export default Dashboard;
