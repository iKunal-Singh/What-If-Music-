
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const DashboardSettings = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState({
    username: '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile settings saved');
  };
  
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: profile.newPassword
      });
      
      if (error) throw error;
      toast.success('Password updated successfully');
      setProfile({...profile, oldPassword: '', newPassword: '', confirmPassword: ''});
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="font-medium">{profile.username || 'Admin User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    User ID: {user?.id ? `${user.id.substring(0, 8)}...` : 'Not logged in'}
                  </p>
                  <div className="mt-2">
                    <Button type="button" variant="outline" size="sm">
                      Upload Avatar
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Display Name</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your display name"
                    value={profile.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    readOnly
                    value={profile.email}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={profile.oldPassword}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={profile.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={!profile.newPassword || !profile.confirmPassword || !profile.oldPassword}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSettings;
