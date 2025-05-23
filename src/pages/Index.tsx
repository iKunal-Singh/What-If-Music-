
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Disc3, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BeatCard from "@/components/beats/BeatCard";
import RemixCard from "@/components/remixes/RemixCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchBeats, fetchRemixes } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [featuredBeats, setFeaturedBeats] = useState([]);
  const [featuredRemixes, setFeaturedRemixes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        setLoading(true);
        const [beatsData, remixesData] = await Promise.all([
          fetchBeats(),
          fetchRemixes()
        ]);
        
        // Get up to 4 latest beats and remixes
        setFeaturedBeats(beatsData.slice(0, 4));
        setFeaturedRemixes(remixesData.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

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
  
  // Loading skeleton for cards
  const CardSkeleton = () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - Improved for accessibility and performance */}
      <section 
        className="py-12 md:py-24 px-4 relative" 
        style={{
          backgroundImage: "url('/lovable-uploads/8e577b0f-aefc-4105-8149-88d723a4d42e.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="banner"
        aria-label="BeatWave - Free Beats & Remixes"
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto relative z-10">
          <AdBanner type="header" className="mb-8" />
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-beatwave-400 to-beatwave-600 bg-clip-text text-transparent">
              Free Beats & Remixes for Content Creators
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Download high-quality royalty-free beats, remixes, and cover art for your videos, podcasts, and creative projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/beats">
                  <Music size={20} aria-hidden="true" />
                  <span>Browse Beats</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/remixes">
                  <Disc3 size={20} aria-hidden="true" />
                  <span>Explore Remixes</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Beats Section - Improved responsive layout */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Beats</h2>
            <Button variant="ghost" asChild className="gap-1">
              <Link to="/beats">
                <span>View All</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <CardSkeleton key={`beat-skeleton-${i}`} />
              ))
            ) : featuredBeats.length > 0 ? (
              featuredBeats.map(beat => (
                <BeatCard 
                  key={beat.id} 
                  id={beat.id} 
                  title={beat.title} 
                  producer={beat.producer} 
                  image={beat.image_url} 
                  audio={beat.audio_url} 
                  bpm={beat.bpm}
                  key_signature={beat.key}
                  tags={beat.tags}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                No beats available at the moment. Check back soon!
              </div>
            )}
          </div>

          <AdBanner type="content" className="my-12" />
        </div>
      </section>
      
      {/* Featured Remixes Section - Improved accessibility */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Latest Remixes</h2>
            <Button variant="ghost" asChild className="gap-1">
              <Link to="/remixes">
                <span>View All</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <CardSkeleton key={`remix-skeleton-${i}`} />
              ))
            ) : featuredRemixes.length > 0 ? (
              featuredRemixes.map(remix => (
                <RemixCard 
                  key={remix.id} 
                  id={remix.id}
                  title={remix.title}
                  remixer={remix.remixer}
                  originalArtist={remix.original_artist}
                  youtubeId={remix.youtube_id}
                  tags={remix.tags}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                No remixes available at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Cover Art Teaser - Improved responsiveness */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2">
                <img 
                  src="/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png" 
                  alt="Cover Art Collection" 
                  className="w-full h-full object-cover aspect-square md:aspect-auto"
                  loading="lazy" // Performance optimization
                />
              </div>
              <div className="p-6 md:p-12 w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Professional Cover Art
                </h2>
                <p className="text-muted-foreground mb-6">
                  Make your music stand out with our collection of high-quality cover art. 
                  Perfect for your singles, albums, playlists, and social media.
                </p>
                <Button asChild className="gap-2">
                  <Link to="/cover-art">
                    <Image size={20} aria-hidden="true" />
                    <span>Browse Gallery</span>
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
