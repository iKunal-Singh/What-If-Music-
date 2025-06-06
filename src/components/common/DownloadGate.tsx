import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Eye, Mail } from 'lucide-react';
import AdBanner from './AdBanner';
import { useToast } from '@/hooks/use-toast';
import { getDownloadURL, recordDownload, subscribeToNewsletter } from '@/lib/api';

export interface DownloadGateProps {
  title: string;
  fileType: string;
  itemId: string;
  itemType: 'beat' | 'remix' | 'cover_art';
  filePath: string;
  bucket: string;
}

const DownloadGate = ({ title, fileType, itemId, itemType, filePath, bucket }: DownloadGateProps) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<'ad' | 'email'>('ad');
  const [email, setEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false); // Added consent state
  const [adViewed, setAdViewed] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpen = () => {
    setOpen(true);
    // Reset consent when dialog opens and method is email, or when switching to email
    if (method === 'email') {
      setConsentChecked(false);
    }
    if (method === 'ad') {
      startAdTimer();
    }
  };

  const handleMethodChange = (newMethod: 'ad' | 'email') => {
    setMethod(newMethod);
    if (newMethod === 'email') {
      setConsentChecked(false); // Reset consent when switching to email method
    } else if (newMethod === 'ad') {
      startAdTimer(); // Start ad timer if switching to ad method
    }
  };

  const startAdTimer = () => {
    setAdViewed(false);
    setAdTimer(5);
    
    const timer = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdViewed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDownload = async () => {
    // Consent check for email method
    if (method === 'email' && !consentChecked) {
      toast({
        title: "Consent Required",
        description: "Please agree to receive emails to proceed with the download.",
        variant: "destructive",
      });
      return;
    }

    // Email validation for email method
    if (method === 'email' && !validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Ad viewed check for ad method
    if (method === 'ad' && !adViewed) {
      toast({
        title: "Please wait",
        description: "Please wait for the ad to finish",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // If user chose email method, subscribe them to newsletter
      if (method === 'email' && email) { // email validation already passed if we are here
        await subscribeToNewsletter(email);
      }
      
      // Record the download
      await recordDownload(itemId, itemType, method === 'email' ? email : undefined);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(bucket, filePath);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${title} download has started`,
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error starting your download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <Button onClick={handleOpen} className="flex gap-2">
        <Download size={18} />
        Download
      </Button>
      
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) { // Reset states on dialog close
          setMethod('ad');
          setEmail('');
          setConsentChecked(false);
          setAdViewed(false);
          setAdTimer(5);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Support my work by choosing one of the options below to unlock your download.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-4 mt-2 mb-4">
            <Button 
              variant={method === 'ad' ? 'default' : 'outline'} 
              className="flex-1" 
              onClick={() => handleMethodChange('ad')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Watch Ad
            </Button>
            
            <Button 
              variant={method === 'email' ? 'default' : 'outline'} 
              className="flex-1" 
              onClick={() => handleMethodChange('email')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>
          
          {method === 'ad' ? (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Please view this ad for {adTimer} seconds to unlock your download
              </p>
              <AdBanner type="content" />
              
              <div className="flex items-center justify-center">
                <Button 
                  onClick={handleDownload} 
                  disabled={!adViewed || isLoading}
                >
                  {isLoading ? 'Processing...' : adViewed ? 'Download Now' : `Wait ${adTimer}s`}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Subscribe to my newsletter to unlock your download and receive updates about new beats
              </p>
              
              <div className="grid gap-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    id="consent"
                    className="mr-2"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    required 
                  />
                  <label htmlFor="consent" className="text-muted-foreground">
                    I agree to receive emails about new beats and exclusive offers
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {method === 'email' && (
              <Button onClick={handleDownload} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Subscribe & Download'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadGate;
