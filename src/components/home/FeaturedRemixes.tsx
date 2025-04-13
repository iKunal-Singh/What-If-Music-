
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import RemixCard from "@/components/remixes/RemixCard";

// Sample data for featured remixes
const featuredRemixes = [
  {
    id: "remix1",
    title: "Blinding Lights Remix",
    remixer: "BeatWave",
    originalArtist: "The Weeknd",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["EDM", "Remix", "Pop"]
  }, 
  {
    id: "remix2",
    title: "Savage Remix",
    remixer: "BeatWave",
    originalArtist: "Megan Thee Stallion",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Hip Hop", "Trap", "Remix"]
  }, 
  {
    id: "remix3",
    title: "Levitating Remix",
    remixer: "BeatWave",
    originalArtist: "Dua Lipa",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Dance", "Pop", "Club"]
  }, 
  {
    id: "remix4",
    title: "Mood Remix",
    remixer: "BeatWave",
    originalArtist: "24kGoldn",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Hip Hop", "Alternative", "Pop"]
  }
];

const FeaturedRemixes = () => {
  return (
    <section className="py-12 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Remixes</h2>
          <Button variant="ghost" asChild className="gap-1">
            <Link to="/remixes">
              View All
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRemixes.map(remix => <RemixCard key={remix.id} {...remix} />)}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRemixes;
