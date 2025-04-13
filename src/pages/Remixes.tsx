
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Disc3, Search } from "lucide-react";
import RemixCard from "@/components/remixes/RemixCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sample data - replace with real data from backend/API
const remixes = [
  {
    id: "remix1",
    title: "Blinding Lights Remix",
    remixer: "BeatWave",
    originalArtist: "The Weeknd",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["EDM", "Remix", "Pop"],
  },
  {
    id: "remix2",
    title: "Savage Remix",
    remixer: "BeatWave",
    originalArtist: "Megan Thee Stallion",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Hip Hop", "Trap", "Remix"],
  },
  {
    id: "remix3",
    title: "Levitating Remix",
    remixer: "BeatWave",
    originalArtist: "Dua Lipa",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Dance", "Pop", "Club"],
  },
  {
    id: "remix4",
    title: "Mood Remix",
    remixer: "BeatWave",
    originalArtist: "24kGoldn",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Hip Hop", "Alternative", "Pop"],
  },
  {
    id: "remix5",
    title: "Watermelon Sugar Remix",
    remixer: "BeatWave",
    originalArtist: "Harry Styles",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Pop", "Dance", "Summer"],
  },
  {
    id: "remix6",
    title: "Don't Start Now Remix",
    remixer: "BeatWave",
    originalArtist: "Dua Lipa",
    youtubeId: "4NRXx6U8ABQ",
    tags: ["Dance", "Disco", "Pop"],
  }
];

const Remixes = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                <Disc3 className="text-beatwave-500" />
                Remixes
              </h1>
              <p className="text-muted-foreground">
                Free remixes for your content and promotion
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search remixes..."
                  className="pl-9 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* DMCA Notice */}
      <section className="py-6 px-4 bg-beatwave-500/10">
        <div className="container mx-auto">
          <div className="rounded-lg p-4 text-sm">
            <h3 className="font-semibold mb-2">⚠️ Fair Use Notice</h3>
            <p>
              All remixes are provided for <strong>non-commercial use only</strong> under Fair Use doctrine. 
              Original vocals are copyright of their respective owners and are used for transformative, non-profit purposes. 
              Do not monetize content using these remixes without appropriate licenses from the original copyright holders.
            </p>
          </div>
        </div>
      </section>
      
      {/* Remixes Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <AdBanner type="header" className="mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {remixes.map((remix, index) => (
              <React.Fragment key={remix.id}>
                <RemixCard {...remix} />
                {/* Insert ad after every 4 remixes */}
                {(index + 1) % 4 === 0 && index !== 0 && index !== remixes.length - 1 && (
                  <AdBanner type="content" className="md:col-span-4 my-2" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Showing 6 of 18 remixes
            </p>
            <Button>
              Load More Remixes
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Remixes;
