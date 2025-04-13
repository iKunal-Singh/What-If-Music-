
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import AudioPlayer from '../common/AudioPlayer';
import DownloadGate from '../common/DownloadGate';

interface BeatProps {
  id: string;
  title: string;
  producer: string;
  image: string;
  audioUrl: string;
  bpm: number;
  key: string;
  tags: string[];
}

const BeatCard = ({ id, title, producer, image, audioUrl, bpm, key, tags }: BeatProps) => {
  const handleDownload = () => {
    console.log(`Downloading beat: ${id}`);
  };

  return (
    <Card className="overflow-hidden music-card">
      <div className="aspect-square relative overflow-hidden rounded-md mb-3">
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
      
      <h3 className="font-medium truncate mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">by {producer}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag) => (
          <span key={tag} className="beat-tag">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <span className="font-medium">BPM:</span> {bpm}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Key:</span> {key}
        </div>
      </div>
      
      <AudioPlayer 
        audioUrl={audioUrl}
        title={title}
        artist={producer}
      />
      
      <div className="mt-4">
        <DownloadGate 
          title={title}
          fileType="Beat"
          onDownload={handleDownload}
        />
      </div>
    </Card>
  );
};

export default BeatCard;
