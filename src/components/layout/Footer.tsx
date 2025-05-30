
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Youtube, Instagram, Twitter, Heart } from "lucide-react";
import DonateModal from "../common/DonateModal";
import { subscribeToNewsletter } from "@/lib/api"; 
import { toast } from "sonner";

const Footer = () => {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    try {
      await subscribeToNewsletter(email);
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail(''); // Clear the input after successful subscription
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };
  
  return (
    <footer className="bg-card border-t border-border mt-12 pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/6f3af6e6-2893-440a-9d49-fee740ae1d20.png" 
                alt="What If Music Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">What If Music?</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Free beats, remixes, and cover art for content creators. All downloads
              are royalty-free for non-commercial use.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.youtube.com/channel/UCvzFTezT7exbODaM7HJBL8Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-beatwave-500 transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://www.instagram.com/whatifmusiic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-beatwave-500 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com/whatifmusiic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-beatwave-500 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/beats"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Beats
                </Link>
              </li>
              <li>
                <Link 
                  to="/remixes"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Remixes
                </Link>
              </li>
              <li>
                <Link 
                  to="/cover-art"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Cover Art
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setDonateModalOpen(true)}
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Support Us
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link 
                  to="/dmca"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  DMCA Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/copyright"
                  className="text-muted-foreground hover:text-beatwave-500 transition-colors"
                >
                  Copyright
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold uppercase mb-4">Subscribe</h4>
            <p className="text-muted-foreground mb-4">
              Get notified about new beats, remixes, and exclusive content.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-secondary/50" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <Button 
                className="shrink-0" 
                onClick={handleSubscribe}
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setDonateModalOpen(true)}
                className="w-full border-beatwave-500 text-beatwave-500 hover:bg-beatwave-500/10"
              >
                <Heart className="mr-2 h-4 w-4" />
                Support Our Music
              </Button>
            </div>
          </div>
        </div>

        {/* Ad Banner - Footer */}
        <div className="mt-12 mb-8 p-4 border border-border rounded-lg bg-secondary/20 text-center">
          <p className="text-xs text-muted-foreground">Advertisement</p>
          <div className="h-16 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Ad Banner Placeholder (728x90)</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} What If Music?. All rights reserved.</p>
        </div>
      </div>
      <DonateModal open={donateModalOpen} setOpen={setDonateModalOpen} />
    </footer>
  );
};

export default Footer;
