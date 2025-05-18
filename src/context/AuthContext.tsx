
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  console.log("AuthProvider: auth state updated", !!auth.user);
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Create a route guard component to protect dashboard routes
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  // Add a delay to ensure auth state is fully initialized and stable
  useEffect(() => {
    console.log(`RequireAuth: user=${!!user}, loading=${loading}, isReady=${isReady}`);
    
    if (!loading) {
      // Short delay to ensure auth state is stable before making routing decisions
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  // Don't render anything while we check for authentication
  if (loading || !isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Verifying authentication...</span>
      </div>
    );
  }

  // If not authenticated after loading completes, redirect to auth
  if (!user) {
    console.log("RequireAuth: User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("RequireAuth: User authenticated, rendering children");
  return <>{children}</>;
}
