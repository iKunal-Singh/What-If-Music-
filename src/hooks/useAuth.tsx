
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to ensure we don't miss events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got session:', session ? 'yes' : 'no');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to get current session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    signIn: async (email: string, password: string) => {
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
    },
    signUp: async (email: string, password: string) => {
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
    },
    signOut: async () => {
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
    },
  };
}
