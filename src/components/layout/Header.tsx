
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Youtube, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CookieConsent from "../common/CookieConsent";
import DonateModal from "../common/DonateModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = [{
    name: "Home",
    path: "/"
  }, {
    name: "Beats",
    path: "/beats"
  }, {
    name: "Remixes",
    path: "/remixes"
  }, {
    name: "Cover Art",
    path: "/cover-art"
  }, {
    name: "About",
    path: "/about"
  }];
  
  return <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300", scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border py-2" : "bg-transparent")}>
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img alt="What If Music Logo" className="h-16 w-auto transition-transform duration-300 hover:scale-105" src="/lovable-uploads/d1f0893d-51ba-442a-9e6c-b70b5cb19c05.png" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => <Link key={link.name} to={link.path} className="text-foreground/90 hover:text-beatwave-500 transition-colors">
                {link.name}
              </Link>)}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setDonateModalOpen(true)}
              className="bg-gradient-to-r from-transparent to-transparent hover:from-beatwave-400/20 hover:to-beatwave-600/20 border-beatwave-500 text-beatwave-500 transition-all hover:shadow-md hover:scale-105"
            >
              <Heart className="mr-2 h-4 w-4" />
              Support Us
            </Button>
            
            <Button>
              <Youtube className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && <div className="fixed inset-0 top-16 bg-background z-40 md:hidden animate-fade-in">
            <nav className="container flex flex-col py-8 gap-6">
              {navLinks.map(link => <Link key={link.name} to={link.path} className="text-xl font-medium border-b border-border pb-2 hover:text-beatwave-500 transition-colors" onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>)}
              <Button
                variant="outline"
                onClick={() => {
                  setDonateModalOpen(true);
                  setIsOpen(false);
                }}
                className="border-beatwave-500 text-beatwave-500 hover:bg-beatwave-500/10"
              >
                <Heart className="mr-2 h-4 w-4" />
                Support Us
              </Button>
              <Button className="mt-4">
                <Youtube className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </nav>
          </div>}
      </header>
      <div className="h-20"></div>
      <CookieConsent />
      <DonateModal open={donateModalOpen} setOpen={setDonateModalOpen} />
    </>;
};
export default Header;
