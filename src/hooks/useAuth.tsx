
import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define UserProfile interface
export interface UserProfile {
  id: string;
  role: string | null;
  // Add other profile fields here if needed in the future
  username?: string; 
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // For initial session/user loading
  const [isLoadingProfile, setIsLoadingProfile] = useState(false); // For profile data loading

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        toast.error(response.error.message);
      } else if (response.data?.user) {
        toast.success('Signed in successfully!');
      }
      return response;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Unable to sign in. Please check your credentials.');
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({ email, password });
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Account created successfully! Please check your email to confirm your account.');
      }
      return response;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('Unable to sign up. Please check your credentials.');
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully!');
      }
      return { error };
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Unable to sign out. Please try again.');
      return { error };
    }
  };

  useEffect(() => {
    // Flag to track mounted state to prevent updates after unmount
    let isMounted = true;
    
    console.log('Auth hook initializing');

    const fetchUserProfile = async (userId: string) => {
      if (!userId) {
        setUserProfile(null);
        setIsLoadingProfile(false);
        return;
      }
      setIsLoadingProfile(true);
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`id, role, username, avatar_url`)
          .eq('id', userId)
          .single();

        if (error && status !== 406) { // 406: Not found, which is fine if profile not created yet
          console.error('Error fetching user profile:', error);
          toast.error('Error fetching user profile.');
          setUserProfile(null);
        } else if (data) {
          setUserProfile(data as UserProfile);
        } else {
          setUserProfile(null); // No profile found or other non-error case
        }
      } catch (profileError) {
        console.error('Exception fetching user profile:', profileError);
        toast.error('Exception fetching user profile.');
        setUserProfile(null);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };
    
    // First, setup the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`Auth state changed: ${event}`, currentSession?.user?.id || 'no session');
      
      if (isMounted) {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserProfile(currentUser.id);
        } else {
          setUserProfile(null);
          setIsLoadingProfile(false); // Ensure loading profile is false when no user
        }
        setLoading(false); // Auth state settled
      }
    });
    
    // Then, get the initial session and profile
    const getInitialSessionAndProfile = async () => {
      try {
        console.log("Checking for initial session...");
        setLoading(true); // Start loading for initial session check
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession?.user?.id || 'no session');
        
        if (isMounted) {
          setSession(initialSession);
          const initialUser = initialSession?.user ?? null;
          setUser(initialUser);

          if (initialUser) {
            await fetchUserProfile(initialUser.id);
          } else {
            setUserProfile(null);
            setIsLoadingProfile(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (isMounted) {
          setUserProfile(null); // Clear profile on error
          setIsLoadingProfile(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Initial auth check complete
        }
      }
    };
    
    getInitialSessionAndProfile();
    
    // Clean up
    return () => {
      console.log('Auth hook cleanup');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getUserRole = useCallback((): string | null => {
    if (isLoadingProfile || !userProfile) return null;
    return userProfile.role ?? null;
  }, [userProfile, isLoadingProfile]);

  const hasRole = useCallback((roleOrRoles: string | string[]): boolean => {
    if (isLoadingProfile || !userProfile || !userProfile.role) return false;
    
    const currentRole = userProfile.role;
    if (typeof roleOrRoles === 'string') {
      return currentRole === roleOrRoles;
    }
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(currentRole);
    }
    return false;
  }, [userProfile, isLoadingProfile]);

  return {
    user,
    session,
    userProfile,
    loading, // This is for the initial auth user/session loading
    isLoadingProfile, // This is specifically for profile data loading
    signIn,
    signUp,
    signOut,
    getUserRole,
    hasRole,
  };
}
