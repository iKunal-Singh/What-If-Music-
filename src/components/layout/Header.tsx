import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Youtube, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CookieConsent from "../common/CookieConsent";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Beats", path: "/beats" },
    { name: "Remixes", path: "/remixes" },
    { name: "Cover Art", path: "/cover-art" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border py-2"
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6f3af6e6-2893-440a-9d49-fee740ae1d20.png" 
              alt="What If Music Logo" 
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
            <span className="text-2xl font-bold tracking-tight">What If Music?</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground/90 hover:text-beatwave-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button>
              <Youtube className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="fixed inset-0 top-16 bg-background z-40 md:hidden animate-fade-in">
            <nav className="container flex flex-col py-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xl font-medium border-b border-border pb-2 hover:text-beatwave-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="mt-4">
                <Youtube className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </nav>
          </div>
        )}
      </header>
      <div className="h-16"></div>
      <CookieConsent />
    </>
  );
};

export default Header;
