
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
    
    // First, setup the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`Auth state changed: ${event}`, currentSession?.user?.email || 'no session');
      
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });
    
    // Then, get the initial session
    const getInitialSession = async () => {
      try {
        console.log("Checking for initial session...");
        const { data } = await supabase.auth.getSession();
        console.log("Initial session check:", data.session?.user?.email || 'no session');
        
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          // Important: make sure to set loading to false
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    getInitialSession();
    
    // Clean up
    return () => {
      console.log('Auth hook cleanup');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  };
}
