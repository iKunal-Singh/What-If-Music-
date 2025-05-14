
import { useEffect, useState } from 'react';
import RemixCard from './RemixCard';
import { Remix, fetchRemixes } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const RemixCardContainer = () => {
  const [remixes, setRemixes] = useState<Remix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRemixes = async () => {
      try {
        setLoading(true);
        const data = await fetchRemixes();
        setRemixes(data);
      } catch (err) {
        console.error('Failed to load remixes:', err);
        setError('Failed to load remixes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRemixes();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (remixes.length === 0) {
    return <div className="text-center text-muted-foreground">No remixes found. Check back soon!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {remixes.map((remix) => (
        <RemixCard
          key={remix.id}
          id={remix.id}
          title={remix.title}
          remixer={remix.remixer}
          originalArtist={remix.original_artist}
          youtubeId={remix.youtube_id}
          tags={remix.tags}
        />
      ))}
    </div>
  );
};

export default RemixCardContainer;
