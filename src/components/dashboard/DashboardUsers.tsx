
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  username?: string; // Now directly on User object
  avatar_url?: string; // Now directly on User object
  created_at: string;
  role?: string; // Added role
  // email and last_sign_in_at are not returned by the new function
}

const fetchUserData = async () => {
  try {
    // Call our new edge function to get users with roles
    const { data: usersData, error: usersError } = await supabase.functions.invoke('list-users-with-roles');
    
    if (usersError) {
      console.error('Error invoking list-users-with-roles function:', usersError);
      throw usersError;
    }
    
    if (!usersData) {
      console.warn('No data returned from list-users-with-roles function');
      return [];
    }
    
    // The data from the function is expected to be an array of users
    // with id, username, avatar_url, created_at, role
    return usersData.map((user: any) => ({
      id: user.id,
      created_at: user.created_at,
      username: user.username,
      avatar_url: user.avatar_url,
      role: user.role,
    }));

  } catch (error) {
    console.error('Error fetching users with roles:', error);
    throw error;
  }
};

const DashboardUsers = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['usersWithRoles'], // Changed queryKey to reflect the new data source
    queryFn: fetchUserData
  });

  // Helper to get initials from username or id
  const getInitials = (user: User) => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    // Removed email fallback for initials as email is not fetched
    return user.id.substring(0, 2).toUpperCase();
  };

  // Format date to readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'; // Changed from 'Never' to 'N/A' for consistency
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
                  <TableHead>Role</TableHead> {/* Added Role column */}
                  <TableHead>Joined</TableHead>
                  {/* <TableHead>Last Activity</TableHead> Removed Last Activity column */}
                  <TableHead>ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center"> {/* Adjusted colSpan */}
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || ''} /> {/* Data directly from user object */}
                            <AvatarFallback>{getInitials(user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username || 'Anonymous User'}</div> {/* Data directly from user object */}
                            {/* Removed email display line */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role || 'N/A'}</TableCell> {/* Display role */}
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      {/* Last Activity cell removed */}
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
