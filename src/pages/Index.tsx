
import React from "react";
import { Button } from "@/components/ui/button";
import { Disc3, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BeatCard from "@/components/beats/BeatCard";
import RemixCard from "@/components/remixes/RemixCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

// Sample data - replace with real data from backend/API
const featuredBeats = [
  {
    id: "beat1",
    title: "Utopia Vibes",
    producer: "WHAT IF MUSIC?",
    image: "/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png",
    audioUrl: "/path-to-audio.mp3",
    bpm: 140,
    key: "A Minor",
    tags: ["Hip Hop", "Travis Scott Type", "Dark"],
  },
  {
    id: "beat2",
    title: "Midnight Dreams",
    producer: "WHAT IF MUSIC?",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 95,
    key: "F Major",
    tags: ["Chill", "Drake Type", "R&B"],
  },
  {
    id: "beat3",
    title: "Future Bounce",
    producer: "WHAT IF MUSIC?",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 128,
    key: "G Minor",
    tags: ["Techno", "EDM", "Club"],
  },
];

const featuredRemixes = [
  {
    id: "remix1",
    title: "Blinding Lights Remix",
    remixer: "WHAT IF MUSIC?",
    originalArtist: "The Weeknd",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["EDM", "Remix", "Pop"],
  },
  {
    id: "remix2",
    title: "Savage Remix",
    remixer: "WHAT IF MUSIC?",
    originalArtist: "Megan Thee Stallion",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Hip Hop", "Trap", "Remix"],
  },
];

const Index = () => {
  // List of genres with their corresponding SVG icons and colors
  const genres = [
    { 
      name: "Hip Hop", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      ), 
      color: "bg-fuchsia-500" 
    },
    { 
      name: "Pop", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M9 18V5l12-2v13"></path>
          <path d="M9 9 21 7"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      ), 
      color: "bg-blue-500" 
    },
    { 
      name: "Electronic", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M2 2v20h20"></path>
          <path d="m6 16 3-8 4 2 3-8 4 2"></path>
        </svg>
      ), 
      color: "bg-purple-500" 
    },
    { 
      name: "Rock", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
          <circle cx="17" cy="7" r="5"></circle>
        </svg>
      ), 
      color: "bg-amber-500" 
    },
    { 
      name: "R&B", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="5.5" cy="17.5" r="3.5"></circle>
          <circle cx="18.5" cy="17.5" r="3.5"></circle>
          <path d="M15 17.5a7 7 0 1 0-14 0"></path>
          <path d="M18.5 10.5c-1 0-3 .5-3 2"></path>
          <path d="M18.5 14c-1 0-3-.5-3-2"></path>
        </svg>
      ), 
      color: "bg-green-500" 
    },
    { 
      name: "Lofi", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M2 19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
          <path d="M12 11h4"></path>
          <path d="M12 15h4"></path>
          <path d="M8 7h.01"></path>
          <path d="M8 11h.01"></path>
          <path d="M8 15h.01"></path>
        </svg>
      ), 
      color: "bg-pink-500" 
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-24 px-4">
        <div className="container mx-auto">
          <AdBanner type="header" className="mb-8" />
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent">
              WHAT IF MUSIC?
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Download high-quality royalty-free beats, remixes, and cover art for your videos, podcasts, and creative projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-500 hover:from-fuchsia-700 hover:to-purple-600">
                <Link to="/beats">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                  Browse Beats
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500/10">
                <Link to="/remixes">
                  <Disc3 size={20} />
                  Explore Remixes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Genre Filters */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center font-heading bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent">Browse by Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres.map((genre) => (
              <Link
                key={genre.name}
                to={`/beats?genre=${genre.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-lg p-4 text-center transition-all hover:border-fuchsia-500 hover:shadow-md">
                  <div className={`${genre.color} mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:animate-neon-pulse`}>
                    {genre.icon}
                  </div>
                  <h3 className="font-medium group-hover:text-fuchsia-500 transition-colors">
                    {genre.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Beats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent">Featured Beats</h2>
            <Button variant="ghost" asChild className="gap-1 text-fuchsia-500 hover:text-fuchsia-600 hover:bg-fuchsia-500/10">
              <Link to="/beats">
                View All
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredBeats.map((beat) => (
              <BeatCard key={beat.id} {...beat} />
            ))}
          </div>

          <AdBanner type="content" className="my-12" />
        </div>
      </section>
      
      {/* Featured Remixes Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent">Latest Remixes</h2>
            <Button variant="ghost" asChild className="gap-1 text-fuchsia-500 hover:text-fuchsia-600 hover:bg-fuchsia-500/10">
              <Link to="/remixes">
                View All
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {featuredRemixes.map((remix) => (
              <RemixCard key={remix.id} {...remix} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Cover Art Teaser */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="md:flex items-center">
              <div className="md:w-1/2">
                <img 
                  src="/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png" 
                  alt="Cover Art Collection" 
                  className="w-full h-full object-cover aspect-square md:aspect-auto"
                />
              </div>
              <div className="p-6 md:p-12 md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading bg-gradient-to-r from-fuchsia-500 to-purple-400 bg-clip-text text-transparent">
                  Professional Cover Art
                </h2>
                <p className="text-muted-foreground mb-6">
                  Make your music stand out with our collection of high-quality cover art. 
                  Perfect for your singles, albums, playlists, and social media.
                </p>
                <Button asChild className="gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-500 hover:from-fuchsia-700 hover:to-purple-600">
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
      
      <Footer />
    </div>
  );
};

export default Index;
