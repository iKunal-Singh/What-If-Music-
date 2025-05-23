
import { useEffect, useState } from 'react';
import BeatCard from './BeatCard';
import { Beat, fetchBeats } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import ErrorBoundary from '../common/ErrorBoundary';

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
        toast.error('Failed to load beats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBeats();
  }, []);

  const LoadingSkeleton = () => (
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

  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center p-6 border border-red-200 bg-red-50 rounded-md">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-red-700 mb-2">Failed to Load Beats</h2>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-muted-foreground mb-4">No beats found. Check back soon!</div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay />;
  }

  if (beats.length === 0) {
    return <EmptyState />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default BeatCardContainer;
