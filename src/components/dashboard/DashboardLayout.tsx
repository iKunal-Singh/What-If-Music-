
import React from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarInset
} from "@/components/ui/sidebar";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Upload, 
  Settings, 
  LogOut, 
  Home
} from 'lucide-react';
import { useAuthContext } from "@/context/AuthContext";
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const handleTabClick = (tabId: string) => {
    // Find the tab in the main content area and trigger it
    const tabElement = document.querySelector(`[value="${tabId}"]`) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r">
          <SidebarHeader className="h-14 flex items-center px-4 border-b">
            <h2 className="font-bold text-xl">BeatWave Admin</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Dashboard"
                  onClick={() => handleTabClick('overview')}
                >
                  <button className="flex w-full items-center gap-2">
                    <LayoutDashboard size={18} />
                    <span>Overview</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Users"
                  onClick={() => handleTabClick('users')}
                >
                  <button className="flex w-full items-center gap-2">
                    <Users size={18} />
                    <span>User Insights</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Content"
                  onClick={() => handleTabClick('content')}
                >
                  <button className="flex w-full items-center gap-2">
                    <FileText size={18} />
                    <span>Content Management</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Uploads"
                  onClick={() => handleTabClick('uploads')}
                >
                  <button className="flex w-full items-center gap-2">
                    <Upload size={18} />
                    <span>Upload Management</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Settings"
                  onClick={() => handleTabClick('settings')}
                >
                  <button className="flex w-full items-center gap-2">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Site">
                  <Link to="/" className="flex items-center gap-2 w-full">
                    <Home size={18} />
                    <span>Back to Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Sign Out"
                >
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-6 w-full">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
