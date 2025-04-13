
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent font-heading">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! Track not found</p>
        <p className="text-lg text-muted-foreground mb-8">
          We couldn't find the page you were looking for. The beat might have dropped too hard.
        </p>
        <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-500 hover:from-fuchsia-700 hover:to-purple-600">
          <Link to="/">
            <Home size={18} />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
