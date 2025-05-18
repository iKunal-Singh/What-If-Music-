
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
  
  // Use useEffect for navigation instead of doing it directly in the component
  useEffect(() => {
    // Only redirect if we have a user and loading is complete
    if (user && !loading) {
      console.log("Auth: Redirecting authenticated user to", from);
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we have a user and we're not loading, we'll redirect via the useEffect
  // This is just a fallback in case the useEffect hasn't fired yet
  if (user) {
    return null;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm redirectPath={from} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
