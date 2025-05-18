import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep auth methods outside useEffect to prevent recreation
  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        toast.error(response.error.message);
        return response;
      } else if (response.data?.user) {
        toast.success('Signed in successfully!');
        return response;
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
    console.log('Auth hook initializing');
    let mounted = true;

    // Set up auth state listener FIRST to ensure we don't miss events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`Auth state changed: ${event}`, currentSession?.user?.email || 'no session');
      
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false); // Important: set loading to false after auth state change
    });

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log("Checking for initial session...");
        const { data } = await supabase.auth.getSession();
        console.log("Initial session check:", data.session?.user?.email || 'no session');
        
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setLoading(false); // Important: set loading to false after getting initial session
        }
      } catch (error) {
        console.error('Failed to get initial session:', error);
        if (mounted) {
          setLoading(false); // Important: set loading to false even on error
        }
      }
    };
    
    getInitialSession();

    return () => {
      console.log('Auth hook cleanup');
      mounted = false;
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
