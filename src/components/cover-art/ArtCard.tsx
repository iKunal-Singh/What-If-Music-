
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DownloadGate from '../common/DownloadGate';

interface ArtProps {
  id: string;
  title: string;
  artist: string;
  image: string;
  tags: string[];
}

const ArtCard = ({ id, title, artist, image, tags }: ArtProps) => {
  const [showPreview, setShowPreview] = useState(false);
  
  // File path would be the relative path within the storage bucket
  const filePath = `${id}/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  
  return (
    <>
      <Card className="overflow-hidden music-card group">
        <div className="aspect-square relative overflow-hidden rounded-md mb-3">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-full" 
              onClick={() => setShowPreview(true)}
            >
              <Eye size={16} className="mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        <h3 className="font-medium truncate mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">by {artist}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="beat-tag">
              {tag}
            </span>
          ))}
        </div>
        
        <div>
          <DownloadGate 
            title={title}
            fileType="Cover Art"
            itemId={id}
            itemType="cover_art"
            filePath={filePath}
            bucket="cover_art"
          />
        </div>
      </Card>
      
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[700px] p-1">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-50 rounded-full bg-black/50 hover:bg-black/70" 
            onClick={() => setShowPreview(false)}
          >
            <X size={18} />
          </Button>
          
          <div className="w-full">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-auto object-contain rounded-md" 
            />
          </div>
          
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">by {artist}</p>
            
            <div className="mt-4">
              <DownloadGate 
                title={title}
                fileType="Cover Art (High Resolution)"
                itemId={id}
                itemType="cover_art"
                filePath={filePath}
                bucket="cover_art"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtCard;
