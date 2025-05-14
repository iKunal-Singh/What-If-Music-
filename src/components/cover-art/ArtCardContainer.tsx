
import { useEffect, useState } from 'react';
import ArtCard from './ArtCard';
import { CoverArt, fetchCoverArt } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const ArtCardContainer = () => {
  const [coverArt, setCoverArt] = useState<CoverArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoverArt = async () => {
      try {
        setLoading(true);
        const data = await fetchCoverArt();
        setCoverArt(data);
      } catch (err) {
        console.error('Failed to load cover art:', err);
        setError('Failed to load cover art. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCoverArt();
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

  if (coverArt.length === 0) {
    return <div className="text-center text-muted-foreground">No cover art found. Check back soon!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coverArt.map((art) => (
        <ArtCard
          key={art.id}
          id={art.id}
          title={art.title}
          artist={art.artist}
          image={art.image_url}
          tags={art.tags}
        />
      ))}
    </div>
  );
};

export default ArtCardContainer;
