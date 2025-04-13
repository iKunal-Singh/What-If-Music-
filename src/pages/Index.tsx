
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import GenreFilter from "@/components/home/GenreFilter";
import FeaturedBeats from "@/components/home/FeaturedBeats";
import FeaturedRemixes from "@/components/home/FeaturedRemixes";
import CoverArtTeaser from "@/components/home/CoverArtTeaser";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <GenreFilter />
      <FeaturedBeats />
      <FeaturedRemixes />
      <CoverArtTeaser />
      <Footer />
    </div>
  );
};

export default Index;
