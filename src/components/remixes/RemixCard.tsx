
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import DownloadGate from '../common/DownloadGate';

interface RemixProps {
  id: string;
  title: string;
  remixer: string;
  originalArtist: string;
  youtubeId: string;
  tags: string[];
}

const RemixCard = ({ id, title, remixer, originalArtist, youtubeId, tags }: RemixProps) => {
  // File path would be the relative path within the storage bucket
  const filePath = `${id}/${title.toLowerCase().replace(/\s+/g, '-')}.mp3`;

  return (
    <Card className="overflow-hidden music-card">
      <div className="aspect-video relative overflow-hidden rounded-md mb-3 bg-black">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="absolute inset-0"
        ></iframe>
      </div>
      
      <h3 className="font-medium truncate mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        by {remixer} • Original: {originalArtist}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag) => (
          <span key={tag} className="beat-tag">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="text-xs bg-secondary/40 p-2 rounded-md mb-4 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-yellow-500" />
        <div>
          <strong>Fair Use Notice:</strong> Vocals used under Fair Use for non-profit, 
          promotional purposes only. Do not monetize.
        </div>
      </div>
      
      <div>
        <DownloadGate 
          title={title}
          fileType="Remix"
          itemId={id}
          itemType="remix"
          filePath={filePath}
          bucket="remixes"
        />
      </div>
    </Card>
  );
};

export default RemixCard;
