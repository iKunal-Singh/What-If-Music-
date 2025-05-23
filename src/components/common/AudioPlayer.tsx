
import React, { useState, useRef, useEffect } from 'react';
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
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });

    // Clean up
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioUrl]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle seek
  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    
    const seekTime = (value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(value);
    setCurrentTime(seekTime);
  };

  // Handle volume change
  const handleVolumeChange = (value: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = value / 100;
    setVolume(value / 100);
    
    // If volume is set to 0, mute; if unmuting, set volume back
    if (value === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
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
              value={[progress]}
              max={100}
              step={1}
              className="cursor-pointer"
              onValueChange={(val) => handleSeek(val[0])}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </Button>
              <span>{formatTime(duration)}</span>
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
