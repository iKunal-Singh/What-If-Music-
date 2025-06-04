
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Play, Pause } from 'lucide-react';
import AudioPlayer from '../common/AudioPlayer';
import DownloadGate from '../common/DownloadGate';
import { useToast } from '@/hooks/use-toast';

interface AnimatedBeatCardProps {
  id: string;
  title: string;
  producer: string;
  image: string;
  audio: string;
  bpm?: number;
  key?: string;
  tags: string[];
}

const AnimatedBeatCard = ({ id, title, producer, image, audio, bpm, key, tags }: AnimatedBeatCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 hover:border-beatwave-500/50 transition-all duration-300">
        {/* Image Container */}
        <div className="aspect-video relative overflow-hidden rounded-t-md">
          <motion.img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Favorite Button */}
          <motion.div 
            className="absolute top-3 right-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-black/50 backdrop-blur-sm border-0 hover:bg-black/70"
              onClick={toggleFavorite}
            >
              <Heart 
                size={16} 
                className={`transition-colors duration-200 ${
                  isFavorite ? 'text-beatwave-500 fill-current' : 'text-white'
                }`}
              />
            </Button>
          </motion.div>

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 bg-beatwave-500/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play size={24} className="text-white ml-1" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <motion.h3 
            className="font-semibold text-lg truncate mb-1"
            animate={{ color: isHovered ? '#E34234' : 'currentColor' }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
          
          <p className="text-sm text-muted-foreground mb-3">by {producer}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {safelyFormattedTags.slice(0, 2).map((tag, index) => (
              <motion.span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-beatwave-500/20 hover:text-beatwave-400 cursor-pointer transition-all"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
          
          {/* BPM and Key */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            {bpm && (
              <motion.div 
                className="flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded"
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-medium">BPM:</span> {bpm}
              </motion.div>
            )}
            {key && (
              <motion.div 
                className="flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded"
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-medium">Key:</span> {key}
              </motion.div>
            )}
          </div>
          
          {/* Audio Player */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AudioPlayer 
              audioUrl={audio}
              title={title}
              artist={producer}
            />
          </motion.div>
          
          {/* Download Section */}
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <DownloadGate 
              title={title}
              fileType="Beat"
              itemId={id}
              itemType="beat"
              filePath={audio && audio.split('/').pop() || `${title.replace(/\s+/g, '-').toLowerCase()}.mp3`}
              bucket="beats"
            />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnimatedBeatCard;
