
import { useEffect, useState } from 'react';
import RemixCard from './RemixCard';
import { Remix, fetchRemixes } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import ErrorBoundary from '../common/ErrorBoundary';

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
        toast.error('Failed to load remixes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRemixes();
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
      <h2 className="text-xl font-bold text-red-700 mb-2">Failed to Load Remixes</h2>
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
      <div className="text-muted-foreground mb-4">No remixes found. Check back soon!</div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay />;
  }

  if (remixes.length === 0) {
    return <EmptyState />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default RemixCardContainer;
