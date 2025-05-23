
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react'; // Added Trash2 icon
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Added AlertDialog components

interface User {
  id:string;
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
    queryKey: ['usersWithRoles'], 
    queryFn: fetchUserData
  });

  const { hasRole: viewingUserIsAdmin, isLoadingProfile: isLoadingViewingUserProfile, user: viewingUser } = useAuthContext();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // State for delete confirmation

  useEffect(() => {
    if (users && users.length > 0) {
      const initialRoles: { [key: string]: string } = {};
      users.forEach(user => {
        if (user.role) {
          initialRoles[user.id] = user.role;
        }
      });
      setSelectedRoles(initialRoles);
    }
  }, [users]);

  const handleRoleChange = (userId: string, newRole: string) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdateRole = async (userId: string) => {
    const newRole = selectedRoles[userId];
    if (!newRole) {
      toast.error("No role selected.");
      return;
    }

    // Prevent admin from changing their own role through this UI to avoid self-lockout
    if (userId === viewingUser?.id) {
      toast.error("Admins cannot change their own role through this interface. Please use database tools for this change if necessary.");
      // Reset select to original role if attempted
      const originalUser = users.find(u => u.id === userId);
      if (originalUser && originalUser.role) {
        setSelectedRoles(prev => ({ ...prev, [userId]: originalUser.role! }));
      }
      return;
    }


    const promise = supabase.functions.invoke('manage-user-roles', {
      body: { targetUserId: userId, newRole },
    });

    toast.promise(promise, {
      loading: `Updating role for user ${userId.substring(0,4)}... to ${newRole}...`,
      success: (res) => {
        if (res.error) {
          throw new Error(res.error.message || 'Function error');
        }
        queryClient.invalidateQueries({ queryKey: ['usersWithRoles'] });
        return `Role updated to ${newRole} for user ${userId.substring(0,4)}...`;
      },
      error: (err) => {
        // Reset select to original role on failure
        const originalUser = users.find(u => u.id === userId);
        if (originalUser && originalUser.role) {
          setSelectedRoles(prev => ({ ...prev, [userId]: originalUser.role! }));
        }
        return `Failed to update role: ${err.message}`;
      },
    });
  };

  const handleDeleteUserClick = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const promise = supabase.functions.invoke('delete-user', {
      body: { targetUserId: userToDelete.id },
    });

    toast.promise(promise, {
      loading: `Deleting user ${userToDelete.username || userToDelete.id.substring(0,4)}...`,
      success: (res) => {
        if (res.error) {
          throw new Error(res.data?.error || res.error?.message || 'Function error during delete');
        }
        queryClient.invalidateQueries({ queryKey: ['usersWithRoles'] });
        setUserToDelete(null); // Close dialog
        return `User ${userToDelete.username || userToDelete.id.substring(0,4)}... deleted successfully.`;
      },
      error: (err) => {
        setUserToDelete(null); // Close dialog
        return `Failed to delete user: ${err.message}`;
      },
    });
  };
  
  const canManageUsers = useMemo(() => !isLoadingViewingUserProfile && viewingUserIsAdmin('admin'), [isLoadingViewingUserProfile, viewingUserIsAdmin]);

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
          {isLoading || isLoadingViewingUserProfile ? ( // Consider both loading states for initial render
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
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>ID</TableHead>
                  {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManageUsers ? 5 : 4} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>{getInitials(user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username || 'Anonymous User'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role || 'N/A'}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                      {canManageUsers && (
                        <TableCell className="text-right">
                          { user.id === viewingUser?.id ? (
                              <span className="text-xs text-muted-foreground pr-4">N/A (Self)</span>
                            ) : (
                              <div className="flex items-center justify-end gap-1">
                                <Select
                                  value={selectedRoles[user.id] || user.role || 'user'}
                                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                                >
                                  <SelectTrigger className="w-[110px] h-8 text-xs">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="icon-sm" // Assuming icon-sm is a smaller icon button
                                  onClick={() => handleUpdateRole(user.id)}
                                  disabled={selectedRoles[user.id] === (user.role || 'user')}
                                  className="h-8 w-8" // Explicitly set size if icon-sm not defined
                                >
                                  <CheckIcon size={14}/>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon-sm"
                                  onClick={() => handleDeleteUserClick(user)}
                                  className="h-8 w-8"  // Explicitly set size
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            )
                          }
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete User Confirmation Dialog */}
      {userToDelete && (
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user 
                <span className="font-semibold"> {userToDelete.username || userToDelete.id}</span>
                {' '}and all their associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

// Dummy CheckIcon component if not available elsewhere, replace with actual import if you have it
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
);


export default DashboardUsers;
