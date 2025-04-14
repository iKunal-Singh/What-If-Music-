
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Confetti effect
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ['#E34234', '#F0756B', '#F9C1BC', '#F59B93', '#FBD4D0'][Math.floor(Math.random() * 5)],
            borderRadius: '50%',
            animation: `fall-${i} ${Math.random() * 3 + 2}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
};

type DonateModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DonateModal = ({ open, setOpen }: DonateModalProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [showingThankYou, setShowingThankYou] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleDonate = () => {
    // Here you would integrate with Stripe/PayPal
    // For now, we'll just show the thank you message
    setShowingThankYou(true);
    setShowConfetti(true);
    
    // Notify success
    toast({
      title: "Thank you for your support!",
      description: `Your donation of $${amount || customAmount || 5} helps us continue creating free music content.`,
    });
    
    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  const resetModal = () => {
    setOpen(false);
    setTimeout(() => {
      setShowingThankYou(false);
      setAmount(10);
      setCustomAmount("");
    }, 300);
  };
  
  const predefinedAmounts = [5, 10, 25, 50];
  
  return (
    <>
      <Confetti active={showConfetti} />
      <Dialog open={open} onOpenChange={resetModal}>
        <DialogContent className="sm:max-w-[425px]">
          {showingThankYou ? (
            <div className="py-10 text-center">
              <PartyPopper className="h-16 w-16 mx-auto mb-4 text-beatwave-500" />
              <DialogTitle className="text-2xl mb-2">Thank You!</DialogTitle>
              <DialogDescription className="text-lg mb-6">
                Your support helps us create more amazing beats and remixes for our community.
              </DialogDescription>
              <Button onClick={resetModal} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-center text-2xl">
                  <Heart className="h-5 w-5 mr-2 text-beatwave-500" /> Support Our Music
                </DialogTitle>
                <DialogDescription className="text-center pt-2">
                  Your donation helps us create more free beats, remixes, and cover art for content creators.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 gap-2">
                  {predefinedAmounts.map((presetAmount) => (
                    <button
                      key={presetAmount}
                      onClick={() => {
                        setAmount(presetAmount);
                        setCustomAmount("");
                      }}
                      className={cn(
                        "py-3 rounded-md border text-center transition-all",
                        amount === presetAmount
                          ? "border-beatwave-500 bg-beatwave-500/10 text-beatwave-500"
                          : "border-border hover:border-beatwave-500/50"
                      )}
                    >
                      ${presetAmount}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(0);
                    }}
                    className="w-full pl-8 rounded-md border border-border px-3 py-2 focus:border-beatwave-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleDonate} 
                  className="w-full bg-gradient-to-r from-beatwave-400 to-beatwave-600 hover:from-beatwave-500 hover:to-beatwave-700 transition-colors"
                >
                  Donate Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonateModal;
