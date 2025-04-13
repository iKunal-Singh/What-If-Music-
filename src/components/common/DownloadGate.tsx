
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Eye, Mail } from 'lucide-react';
import AdBanner from './AdBanner';
import { useToast } from '@/hooks/use-toast';

interface DownloadGateProps {
  title: string;
  fileType: string;
  onDownload: () => void;
}

const DownloadGate = ({ title, fileType, onDownload }: DownloadGateProps) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<'ad' | 'email'>('ad');
  const [email, setEmail] = useState('');
  const [adViewed, setAdViewed] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const { toast } = useToast();

  const handleOpen = () => {
    setOpen(true);
    if (method === 'ad') {
      startAdTimer();
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

  const handleDownload = () => {
    if (method === 'email' && !validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (method === 'ad' && !adViewed) {
      toast({
        title: "Please wait",
        description: "Please wait for the ad to finish",
      });
      return;
    }
    
    toast({
      title: "Download started",
      description: `${title} download has started`,
    });

    onDownload();
    setOpen(false);
  };

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  return (
    <>
      <Button onClick={handleOpen} className="flex gap-2">
        <Download size={18} />
        Download {fileType}
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
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
              onClick={() => { 
                setMethod('ad');
                startAdTimer();
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Watch Ad
            </Button>
            
            <Button 
              variant={method === 'email' ? 'default' : 'outline'} 
              className="flex-1" 
              onClick={() => setMethod('email')}
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
                  disabled={!adViewed}
                >
                  {adViewed ? 'Download Now' : `Wait ${adTimer}s`}
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
              <Button onClick={handleDownload}>
                Subscribe & Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadGate;
