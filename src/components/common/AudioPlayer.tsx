
import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
  minimal?: boolean;
}

const AudioPlayer = ({ audioUrl, title, artist, minimal = false }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the audio element
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Wave animation bars (shown when playing)
  const WaveAnimation = () => (
    <div className={`flex items-end h-6 gap-[1px] wave-animations ${minimal ? 'w-12' : 'w-20'}`}>
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`audio-bar ${isPlaying ? 'animate-wave' : 'h-1/3'}`} 
        />
      ))}
    </div>
  );

  if (minimal) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </Button>
        <WaveAnimation />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-3 w-full">
      <div className="flex items-center gap-3">
        <Button 
          variant="default" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-beatwave-500 hover:bg-beatwave-400" 
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="truncate">
              <div className="font-medium truncate">{title}</div>
              <div className="text-xs text-muted-foreground">{artist}</div>
            </div>
            <WaveAnimation />
          </div>
          
          <div className="mt-2">
            <Slider
              defaultValue={[progress]}
              max={100}
              step={1}
              className="cursor-pointer"
              onValueChange={(val) => setProgress(val[0])}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(progress * 3)}</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </Button>
              <span>3:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default AudioPlayer;
