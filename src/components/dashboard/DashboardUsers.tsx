
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get users from auth.users through admin functions (would need Edge Function in production)
        // For demo, we'll use profiles if they exist
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Transform into user objects
        const userProfiles = data.map(profile => ({
          id: profile.id,
          created_at: profile.created_at,
          profile: {
            username: profile.username,
            avatar_url: profile.avatar_url
          }
        }));

        setUsers(userProfiles);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Helper to get initials from username or id
  const getInitials = (user: User) => {
    if (user.profile?.username) {
      return user.profile.username.substring(0, 2).toUpperCase();
    }
    return user.id.substring(0, 2).toUpperCase();
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Insights</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
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
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profile?.avatar_url || ''} />
                            <AvatarFallback>{getInitials(user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.profile?.username || 'Anonymous User'}</div>
                            <div className="text-sm text-muted-foreground">{user.email || 'No email'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}</TableCell>
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
