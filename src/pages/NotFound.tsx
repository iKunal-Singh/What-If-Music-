
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
    <div className="min-h-screen flex items-center justify-center bg-background px-apple-md">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-medium mb-6 text-apple-blue">404</h1>
        <p className="text-xl text-foreground mb-apple-md">Page Not Found</p>
        <p className="text-lg text-muted-foreground mb-apple-xl">
          We couldn't find the page you were looking for.
        </p>
        <Button asChild size="lg" className="gap-2">
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
