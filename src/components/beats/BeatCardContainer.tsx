
import { useEffect, useState } from 'react';
import BeatCard from './BeatCard';
import { Beat, fetchBeats } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const BeatCardContainer = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBeats = async () => {
      try {
        setLoading(true);
        const data = await fetchBeats();
        setBeats(data);
      } catch (err) {
        console.error('Failed to load beats:', err);
        setError('Failed to load beats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBeats();
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

  if (beats.length === 0) {
    return <div className="text-center text-muted-foreground">No beats found. Check back soon!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {beats.map((beat) => (
        <BeatCard
          key={beat.id}
          id={beat.id}
          title={beat.title}
          producer={beat.producer}
          image={beat.image_url}
          audio={beat.audio_url}
          bpm={beat.bpm || undefined}
          key_signature={beat.key || undefined}
          tags={beat.tags}
        />
      ))}
    </div>
  );
};

export default BeatCardContainer;
