
import React from "react";
import { Button } from "@/components/ui/button";
import { Music, Disc3, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BeatCard from "@/components/beats/BeatCard";
import RemixCard from "@/components/remixes/RemixCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sample data - replace with real data from backend/API
const featuredBeats = [{
  id: "beat1",
  title: "Utopia Vibes",
  producer: "BeatWave",
  image: "/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png",
  audioUrl: "/path-to-audio.mp3",
  bpm: 140,
  key: "A Minor",
  tags: ["Hip Hop", "Travis Scott Type", "Dark"]
}, {
  id: "beat2",
  title: "Midnight Dreams",
  producer: "BeatWave",
  image: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
  audioUrl: "/path-to-audio.mp3",
  bpm: 95,
  key: "F Major",
  tags: ["Chill", "Drake Type", "R&B"]
}, {
  id: "beat3",
  title: "Future Bounce",
  producer: "BeatWave",
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
  audioUrl: "/path-to-audio.mp3",
  bpm: 128,
  key: "G Minor",
  tags: ["Techno", "EDM", "Club"]
}, {
  id: "beat4",
  title: "Mellow Sunset",
  producer: "BeatWave",
  image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
  audioUrl: "/path-to-audio.mp3",
  bpm: 90,
  key: "C Major",
  tags: ["Lo-Fi", "Chill", "Study"]
}];
const featuredRemixes = [{
  id: "remix1",
  title: "Blinding Lights Remix",
  remixer: "BeatWave",
  originalArtist: "The Weeknd",
  youtubeId: "4NRXx6U8ABQ",
  tags: ["EDM", "Remix", "Pop"]
}, {
  id: "remix2",
  title: "Savage Remix",
  remixer: "BeatWave",
  originalArtist: "Megan Thee Stallion",
  youtubeId: "4NRXx6U8ABQ",
  tags: ["Hip Hop", "Trap", "Remix"]
}, {
  id: "remix3",
  title: "Levitating Remix",
  remixer: "BeatWave",
  originalArtist: "Dua Lipa",
  youtubeId: "4NRXx6U8ABQ",
  tags: ["Dance", "Pop", "Club"]
}, {
  id: "remix4",
  title: "Mood Remix",
  remixer: "BeatWave",
  originalArtist: "24kGoldn",
  youtubeId: "4NRXx6U8ABQ",
  tags: ["Hip Hop", "Alternative", "Pop"]
}];

const Index = () => {
  // List of genres with their corresponding icons and colors
  const genres = [{
    name: "Hip Hop",
    icon: <Music size={24} />,
    color: "bg-beatwave-500"
  }, {
    name: "Chill",
    icon: <Music size={24} />,
    color: "bg-blue-500"
  }, {
    name: "Techno",
    icon: <Music size={24} />,
    color: "bg-purple-500"
  }, {
    name: "Soul",
    icon: <Music size={24} />,
    color: "bg-amber-500"
  }, {
    name: "Funk",
    icon: <Music size={24} />,
    color: "bg-green-500"
  }, {
    name: "Jazz",
    icon: <Music size={24} />,
    color: "bg-pink-500"
  }];
  return <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="py-12 md:py-24 px-4 relative hero-section" 
        style={{
          backgroundImage: "url('/lovable-uploads/8e577b0f-aefc-4105-8149-88d723a4d42e.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
      
      {/* Genre Filters */}
      
      
      {/* Featured Beats Section */}
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

          <AdBanner type="content" className="my-12" />
        </div>
      </section>
      
      {/* Featured Remixes Section */}
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
      
      {/* Cover Art Teaser */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
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
      
      <Footer />
    </div>;
};
export default Index;
