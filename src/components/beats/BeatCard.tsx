
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import AudioPlayer from '../common/AudioPlayer';
import DownloadGate from '../common/DownloadGate';
import { useToast } from '@/hooks/use-toast'; // Corrected import based on project structure

interface BeatProps {
  id: string;
  title: string;
  producer: string;
  image: string;
  audio: string;
  bpm?: number;
  key?: string; // Changed from key_signature
  tags: string[];
}

const BeatCard = ({ id, title, producer, image, audio, bpm, key, tags }: BeatProps) => { // Changed prop name
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast(); // Correct way to use the hook

  // Ensure tags is always an array
  const safelyFormattedTags = Array.isArray(tags) ? tags : 
    (typeof tags === 'string' ? [tags] : []);

  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    if (newFavoriteStatus) {
      toast({
        title: "Added to Favorites",
        description: `"${title}" has been added to your favorites.`,
      });
    }
    // Optionally, add a toast for un-favoriting if desired in the future
    // else {
    //   toast({
    //     title: "Removed from Favorites",
    //     description: `"${title}" has been removed from your favorites.`,
    //     variant: "destructive" // Or another appropriate variant
    //   });
    // }
  };
  
  return (
    <Card className="overflow-hidden music-card">
      <div className="aspect-video relative overflow-hidden rounded-md mb-3">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-2 right-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full opacity-80 hover:opacity-100"
            onClick={toggleFavorite}
          >
            <Heart 
              size={16} 
              className="text-beatwave-500" 
              fill={isFavorite ? "currentColor" : "none"} 
            />
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium truncate mb-1 text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mb-2">by {producer}</p>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {safelyFormattedTags.slice(0, 2).map((tag) => (
          <span key={tag} className="beat-tag text-xs">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        {bpm && (
          <div className="flex items-center gap-1">
            <span className="font-medium">BPM:</span> {bpm}
          </div>
        )}
        {key && ( // Changed from key_signature
          <div className="flex items-center gap-1">
            <span className="font-medium">Key:</span> {key} {/* Changed from key_signature */}
          </div>
        )}
      </div>
      
      <AudioPlayer 
        audioUrl={audio}
        title={title}
        artist={producer}
      />
      
      <div className="mt-3">
        <DownloadGate 
          title={title}
          fileType="Beat"
          itemId={id}
          itemType="beat"
          filePath={audio && audio.split('/').pop() || `${title.replace(/\s+/g, '-').toLowerCase()}.mp3`}
          bucket="beats"
        />
      </div>
    </Card>
  );
};

export default BeatCard;
