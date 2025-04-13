
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Search, Grid3X3 } from "lucide-react";
import ArtCard from "@/components/cover-art/ArtCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sample data - replace with real data from backend/API
const coverArtItems = [
  {
    id: "art1",
    title: "Neon Dystopia",
    artist: "BeatWave",
    image: "/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png",
    tags: ["Cyberpunk", "Futuristic", "Neon"],
  },
  {
    id: "art2",
    title: "Desert Vibes",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1614850715776-a747fb083930?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    tags: ["Western", "Desert", "Minimal"],
  },
  {
    id: "art3",
    title: "Liquid Dreams",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1557682250-6b57f5b937cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2729&q=80",
    tags: ["Abstract", "Liquid", "Colorful"],
  },
  {
    id: "art4",
    title: "City Lights",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    tags: ["Urban", "Night", "City"],
  },
  {
    id: "art5",
    title: "Abstract Waves",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    tags: ["Abstract", "Waves", "Colorful"],
  },
  {
    id: "art6",
    title: "Retro Space",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    tags: ["Space", "Retro", "Sci-Fi"],
  },
  {
    id: "art7",
    title: "Tropical Vibes",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1520690214124-2405c5217036?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    tags: ["Tropical", "Summer", "Beach"],
  },
  {
    id: "art8",
    title: "Neon Portrait",
    artist: "BeatWave",
    image: "https://images.unsplash.com/photo-1607748851687-ba9a10438621?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    tags: ["Portrait", "Neon", "Dark"],
  },
];

const CoverArt = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridColumns, setGridColumns] = useState(4);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section 
        className="py-12 px-4 relative"
        style={{
          backgroundImage: "url('/lovable-uploads/9343b022-ea9b-427f-a882-3f125542e521.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 text-white">
                <Image className="text-beatwave-500" />
                Cover Art
              </h1>
              <p className="text-white">
                High-quality artwork for your music and content
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search cover art..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setGridColumns(gridColumns === 3 ? 4 : 3)}
              >
                <Grid3X3 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cover Art Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <AdBanner type="header" className="mb-8" />
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns} gap-6`}>
            {coverArtItems.map((art, index) => (
              <React.Fragment key={art.id}>
                <ArtCard {...art} />
                {/* Insert ad after every 4 items */}
                {(index + 1) % 4 === 0 && index !== 0 && index !== coverArtItems.length - 1 && (
                  <AdBanner type="content" className={`lg:col-span-${gridColumns} my-2`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Showing 8 of 24 cover art designs
            </p>
            <Button>
              Load More Artwork
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CoverArt;
