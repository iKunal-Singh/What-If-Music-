
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already consented
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Show cookie consent after 1 second
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'full');
    setVisible(false);
    toast({
      title: "Cookies accepted",
      description: "Thank you for accepting all cookies",
    });
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setVisible(false);
    toast({
      title: "Necessary cookies accepted",
      description: "Only necessary cookies will be used",
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <div className="bg-card border border-border p-4 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h4 className="text-lg font-semibold mb-2">Cookie Consent</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This website uses cookies to enhance user experience and to analyze traffic. 
                We also share information about your use of our site with our advertising and analytics partners.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setVisible(false)}>
              <X size={20} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={acceptAll}>
              Accept All
            </Button>
            <Button variant="outline" onClick={acceptNecessary}>
              Accept Necessary Only
            </Button>
            <Button variant="link">
              Cookie Policy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
