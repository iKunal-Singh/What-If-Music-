
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabaseConfig = async () => {
      try {
        // Check active sessions and sets the user
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Supabase authentication error:', error);
        toast.error('Authentication system is not available. Please check Supabase configuration.');
      } finally {
        setLoading(false);
      }
    };
    
    checkSupabaseConfig();

    // Listen for changes on auth state (sign in, sign out, etc.)
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Failed to set up auth state change listener:', error);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  return {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        return await supabase.auth.signInWithPassword({ email, password });
      } catch (error) {
        console.error('Sign in error:', error);
        toast.error('Unable to sign in. Please check Supabase configuration.');
        return { data: null, error };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        return await supabase.auth.signUp({ email, password });
      } catch (error) {
        console.error('Sign up error:', error);
        toast.error('Unable to sign up. Please check Supabase configuration.');
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        return await supabase.auth.signOut();
      } catch (error) {
        console.error('Sign out error:', error);
        toast.error('Unable to sign out. Please check Supabase configuration.');
        return { error };
      }
    },
  };
}
