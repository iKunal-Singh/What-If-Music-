
import React from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { Link } from "react-router-dom";
import AdBanner from "@/components/common/AdBanner";

const CoverArtTeaser = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <AdBanner type="content" className="my-12" />
        
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="md:flex items-center">
            <div className="md:w-1/2">
              <img src="/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png" alt="Cover Art Collection" className="w-full h-full object-cover aspect-square md:aspect-auto" />
            </div>
            <div className="p-6 md:p-12 md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Professional Cover Art
              </h2>
              <p className="text-muted-foreground mb-6">
                Make your music stand out with our collection of high-quality cover art. 
                Perfect for your singles, albums, playlists, and social media.
              </p>
              <Button asChild className="gap-2">
                <Link to="/cover-art">
                  <Image size={20} />
                  Browse Gallery
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverArtTeaser;
