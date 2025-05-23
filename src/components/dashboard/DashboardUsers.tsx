
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  profile?: {
    username?: string;
    avatar_url?: string;
  };
}

const fetchUserData = async () => {
  try {
    // Call our edge function that will use service role to get users
    // If you don't have this edge function, it will fall back to profiles
    const { data: usersData, error: usersError } = await supabase.functions.invoke('list-users');
    
    if (usersError || !usersData) {
      console.log("Falling back to profiles data");
      
      // Fallback to profiles if edge function fails or doesn't exist
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (profilesError) throw profilesError;
      
      // Transform into user objects
      return profilesData.map((profile: any) => ({
        id: profile.id,
        created_at: profile.created_at,
        profile: {
          username: profile.username,
          avatar_url: profile.avatar_url
        }
      }));
    }
    
    return usersData;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const DashboardUsers = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  // Helper to get initials from username or id
  const getInitials = (user: User) => {
    if (user.profile?.username) {
      return user.profile.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return user.id.substring(0, 2).toUpperCase();
  };

  // Format date to readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    console.error("Error loading users:", error);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Insights</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div className="flex items-center gap-4" key={i}>
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profile?.avatar_url || ''} />
                            <AvatarFallback>{getInitials(user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.profile?.username || user.email || 'Anonymous User'}</div>
                            <div className="text-sm text-muted-foreground">{user.email || 'No email'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                      <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardUsers;
