
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Disc3, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBeatCard from "@/components/beats/AnimatedBeatCard";
import RemixCard from "@/components/remixes/RemixCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import AnimatedHero from "@/components/sections/AnimatedHero";
import { fetchBeats, fetchRemixes } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ContentSection from "@/components/common/ContentSection";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredBeats, setFeaturedBeats] = useState([]);
  const [featuredRemixes, setFeaturedRemixes] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        setContentLoading(true);
        const [beatsData, remixesData] = await Promise.all([
          fetchBeats(),
          fetchRemixes()
        ]);
        
        setFeaturedBeats(beatsData.slice(0, 4));
        setFeaturedRemixes(remixesData.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured content:", error);
      } finally {
        setContentLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

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
  
  const CardSkeleton = () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <motion.div 
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        
        {/* Animated Hero Section */}
        <ErrorBoundary>
          <AnimatedHero />
        </ErrorBoundary>
        
        {/* Featured Beats Section */}
        <ContentSection className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-beatwave-400 to-purple-500 bg-clip-text text-transparent">
                Featured Beats
              </h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" asChild className="gap-2 hover:text-beatwave-500">
                  <Link to="/beats">
                    <span>View All</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {contentLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <CardSkeleton key={`beat-skeleton-${i}`} />
                ))
              ) : featuredBeats.length > 0 ? (
                featuredBeats.map((beat, index) => (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AnimatedBeatCard 
                      id={beat.id} 
                      title={beat.title} 
                      producer={beat.producer} 
                      image={beat.image_url} 
                      audio={beat.audio_url} 
                      bpm={beat.bpm}
                      key={beat.key}
                      tags={Array.isArray(beat.tags) ? beat.tags : []}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No beats available at the moment. Check back soon!
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AdBanner type="content" className="my-16" />
            </motion.div>
          </div>
        </ContentSection>
        
        {/* Featured Remixes Section */}
        <ContentSection className="py-16 px-4 bg-gradient-to-br from-secondary/30 to-secondary/10">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-beatwave-500 bg-clip-text text-transparent">
                Latest Remixes
              </h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" asChild className="gap-2 hover:text-beatwave-500">
                  <Link to="/remixes">
                    <span>View All</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {contentLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <CardSkeleton key={`remix-skeleton-${i}`} />
                ))
              ) : featuredRemixes.length > 0 ? (
                featuredRemixes.map((remix, index) => (
                  <motion.div
                    key={remix.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <RemixCard 
                      id={remix.id}
                      title={remix.title}
                      remixer={remix.remixer}
                      originalArtist={remix.original_artist}
                      youtubeId={remix.youtube_id}
                      tags={Array.isArray(remix.tags) ? remix.tags : []}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No remixes available at the moment. Check back soon!
                </div>
              )}
            </motion.div>
          </div>
        </ContentSection>
        
        {/* Cover Art Teaser */}
        <ContentSection className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-beatwave-500/50 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row items-center">
                <motion.div 
                  className="w-full md:w-1/2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png" 
                    alt="Cover Art Collection" 
                    className="w-full h-full object-cover aspect-square md:aspect-auto"
                    loading="lazy"
                  />
                </motion.div>
                <div className="p-8 md:p-12 w-full md:w-1/2">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-beatwave-400 to-purple-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    Professional Cover Art
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground mb-8 text-lg leading-relaxed"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Make your music stand out with our collection of high-quality cover art. 
                    Perfect for your singles, albums, playlists, and social media.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild className="gap-3 bg-gradient-to-r from-beatwave-500 to-purple-600 hover:from-beatwave-600 hover:to-purple-700">
                      <Link to="/cover-art">
                        <Image size={20} />
                        <span>Browse Gallery</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </ContentSection>
        
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </motion.div>
    </>
  );
};

export default Index;
