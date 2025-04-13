
import React from "react";
import { Button } from "@/components/ui/button";
import { Music, Disc3 } from "lucide-react";
import { Link } from "react-router-dom";
import AdBanner from "@/components/common/AdBanner";

const HeroSection = () => {
  return (
    <section 
      className="py-12 md:py-24 px-4 relative" 
      style={{
        backgroundImage: "url('/lovable-uploads/8e577b0f-aefc-4105-8149-88d723a4d42e.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto relative z-10">
        <AdBanner type="header" className="mb-8" />
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-beatwave-400 to-beatwave-600 bg-clip-text text-transparent">
            Free Beats & Remixes for Content Creators
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Download high-quality royalty-free beats, remixes, and cover art for your videos, podcasts, and creative projects.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/beats">
                <Music size={20} />
                Browse Beats
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/remixes">
                <Disc3 size={20} />
                Explore Remixes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
