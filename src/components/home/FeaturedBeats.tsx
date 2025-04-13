
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BeatCard from "@/components/beats/BeatCard";

// Sample data for featured beats
const featuredBeats = [
  {
    id: "beat1",
    title: "Utopia Vibes",
    producer: "BeatWave",
    image: "/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png",
    audioUrl: "/path-to-audio.mp3",
    bpm: 140,
    key: "A Minor",
    tags: ["Hip Hop", "Travis Scott Type", "Dark"]
  }, 
  {
    id: "beat2",
    title: "Midnight Dreams",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 95,
    key: "F Major",
    tags: ["Chill", "Drake Type", "R&B"]
  }, 
  {
    id: "beat3",
    title: "Future Bounce",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 128,
    key: "G Minor",
    tags: ["Techno", "EDM", "Club"]
  }, 
  {
    id: "beat4",
    title: "Mellow Sunset",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 90,
    key: "C Major",
    tags: ["Lo-Fi", "Chill", "Study"]
  }
];

const FeaturedBeats = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Beats</h2>
          <Button variant="ghost" asChild className="gap-1">
            <Link to="/beats">
              View All
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBeats.map(beat => <BeatCard key={beat.id} {...beat} />)}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBeats;
