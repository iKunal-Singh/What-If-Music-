
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Music, Filter, X, Search } from "lucide-react";
import BeatCard from "@/components/beats/BeatCard";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Sample data - replace with real data from backend/API
const beats = [
  {
    id: "beat1",
    title: "Utopia Vibes",
    producer: "BeatWave",
    image: "/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png",
    audioUrl: "/path-to-audio.mp3",
    bpm: 140,
    key: "A Minor",
    tags: ["Hip Hop", "Travis Scott Type", "Dark"],
  },
  {
    id: "beat2",
    title: "Midnight Dreams",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 95,
    key: "F Major",
    tags: ["Chill", "Drake Type", "R&B"],
  },
  {
    id: "beat3",
    title: "Future Bounce",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 128,
    key: "G Minor",
    tags: ["Techno", "EDM", "Club"],
  },
  {
    id: "beat4",
    title: "Astral Plane",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 85,
    key: "C Major",
    tags: ["Lo-Fi", "Chill", "Study"],
  },
  {
    id: "beat5",
    title: "Street Dreams",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 90,
    key: "E Minor",
    tags: ["Hip Hop", "Kendrick Type", "Lyrical"],
  },
  {
    id: "beat6",
    title: "Neon Lights",
    producer: "BeatWave",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    audioUrl: "/path-to-audio.mp3",
    bpm: 110,
    key: "D Minor",
    tags: ["Synthwave", "Retro", "80s"],
  },
];

// Define list of genres for filter
const genres = [
  "All",
  "Hip Hop",
  "Trap",
  "R&B",
  "Pop",
  "EDM",
  "Lo-Fi",
  "Drill",
  "Synthwave"
];

const keys = [
  "All",
  "C Major",
  "C Minor",
  "D Major",
  "D Minor",
  "E Major",
  "E Minor",
  "F Major",
  "F Minor",
  "G Major",
  "G Minor",
  "A Major",
  "A Minor",
  "B Major",
  "B Minor"
];

const Beats = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedKey, setSelectedKey] = useState("All");
  const [bpmRange, setBpmRange] = useState([70, 160]);
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
                <Music className="text-beatwave-500" />
                Beats
              </h1>
              <p className="text-muted-foreground">
                Browse and download free beats for your next project
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search beats..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Beats</SheetTitle>
                  </SheetHeader>
                  
                  <div className="py-4">
                    <h3 className="font-medium mb-2">Genre</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {genres.map((genre) => (
                        <Button
                          key={genre}
                          variant={selectedGenre === genre ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedGenre(genre)}
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                    
                    <h3 className="font-medium mb-2">BPM Range</h3>
                    <div className="px-2 mb-6">
                      <Slider
                        defaultValue={bpmRange}
                        min={60}
                        max={200}
                        step={1}
                        onValueChange={(values) => setBpmRange(values)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{bpmRange[0]} BPM</span>
                        <span>{bpmRange[1]} BPM</span>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mb-2">Key</h3>
                    <div className="flex flex-wrap gap-2">
                      {keys.map((key) => (
                        <Button
                          key={key}
                          variant={selectedKey === key ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedKey(key)}
                        >
                          {key}
                        </Button>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedGenre("All");
                        setSelectedKey("All");
                        setBpmRange([70, 160]);
                      }}
                    >
                      <X size={16} className="mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>
      
      {/* Beats Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <AdBanner type="header" className="mb-8" />
          
          {selectedGenre !== "All" && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm">Filtered by:</span>
              <div className="flex gap-2">
                <span className="beat-tag">
                  {selectedGenre}
                  <button 
                    className="ml-2 text-xs"
                    onClick={() => setSelectedGenre("All")}
                  >
                    ×
                  </button>
                </span>
                {selectedKey !== "All" && (
                  <span className="beat-tag">
                    {selectedKey}
                    <button 
                      className="ml-2 text-xs"
                      onClick={() => setSelectedKey("All")}
                    >
                      ×
                    </button>
                  </span>
                )}
                <span className="beat-tag">
                  {bpmRange[0]}-{bpmRange[1]} BPM
                </span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beats.map((beat, index) => (
              <React.Fragment key={beat.id}>
                <BeatCard {...beat} />
                {/* Insert ad after every 4 beats */}
                {(index + 1) % 4 === 0 && index !== 0 && index !== beats.length - 1 && (
                  <AdBanner type="content" className="lg:col-span-4 my-2" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Showing 6 of 24 beats
            </p>
            <Button>
              Load More Beats
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Beats;
