
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import AudioPlayer from '../common/AudioPlayer';
import DownloadGate from '../common/DownloadGate';
import { toast } from '@/components/ui/use-toast';

interface BeatProps {
  id: string;
  title: string;
  producer: string;
  image: string;
  audio: string;  // Changed from audioUrl to match usage
  bpm?: number;    // Made optional with ?
  key_signature?: string;  // Changed from key to match usage
  tags: string[];
}

const BeatCard = ({ id, title, producer, image, audio, bpm, key_signature, tags }: BeatProps) => {
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
          >
            <Heart size={16} className="text-beatwave-500" />
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium truncate mb-1 text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mb-2">by {producer}</p>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.slice(0, 2).map((tag) => (
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
        {key_signature && (
          <div className="flex items-center gap-1">
            <span className="font-medium">Key:</span> {key_signature}
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
