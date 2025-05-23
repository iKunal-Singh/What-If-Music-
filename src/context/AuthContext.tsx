
import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuth, UserProfile } from '@/hooks/useAuth'; // Import UserProfile
import { Navigate, useLocation } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null; // Added userProfile
  loading: boolean; // For initial auth session/user loading
  isLoadingProfile: boolean; // For profile data loading
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  getUserRole: () => string | null; // Added getUserRole
  hasRole: (roleOrRoles: string | string[]) => boolean; // Added hasRole
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  // Log includes user and profile loading state
  console.log("AuthProvider: auth state updated", { 
    user: !!auth.user, 
    profile: !!auth.userProfile, 
    loading: auth.loading, 
    isLoadingProfile: auth.isLoadingProfile 
  });
  
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
  // Use loading for session and isLoadingProfile for profile data
  const { user, loading, isLoadingProfile } = useAuthContext();
  const location = useLocation();
  
  console.log(`RequireAuth: user=${!!user}, loading=${loading}, isLoadingProfile=${isLoadingProfile}`);

  // Wait if either session is loading or profile is loading
  if (loading || isLoadingProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Verifying authentication and loading profile...</span>
      </div>
    );
  }

  // If not authenticated after all loading completes, redirect to auth
  if (!user) {
    console.log("RequireAuth: User not authenticated after loading, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("RequireAuth: User authenticated, rendering children");
  return <>{children}</>;
}
