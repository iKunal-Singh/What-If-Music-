import { useEffect, useState } from 'react';
import BeatCard from './BeatCard';
import { Beat, fetchBeats, BeatFilters } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle, XCircle } from 'lucide-react';
import ErrorBoundary from '../common/ErrorBoundary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

const BeatCardContainer = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bpmFilter, setBpmFilter] = useState('');
  const [keyFilter, setKeyFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');

  const debouncedBpm = useDebounce(bpmFilter, 500);
  const debouncedKey = useDebounce(keyFilter, 500);
  const debouncedTags = useDebounce(tagsFilter, 500);

  const loadBeats = async (filters?: BeatFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBeats(filters);
      setBeats(data);
    } catch (err) {
      console.error('Failed to load beats:', err);
      const errorMessage = (err instanceof Error ? err.message : 'An unknown error occurred');
      setError(`Failed to load beats: ${errorMessage}. Please try again later.`);
      toast.error(`Failed to load beats: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentFilters: BeatFilters = {};
    const bpm = parseInt(debouncedBpm, 10);
    if (!isNaN(bpm) && bpm > 0) {
      currentFilters.bpm = bpm;
    }
    if (debouncedKey.trim()) {
      currentFilters.key = debouncedKey.trim();
    }
    if (debouncedTags.trim()) {
      currentFilters.tags = debouncedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }
    loadBeats(currentFilters);
  }, [debouncedBpm, debouncedKey, debouncedTags]);

  const handleClearFilters = () => {
    setBpmFilter('');
    setKeyFilter('');
    setTagsFilter('');
    // The useEffect above will handle re-fetching with empty filters
  };
  
  const hasActiveFilters = bpmFilter || keyFilter || tagsFilter;

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
    <div className="flex flex-col items-center justify-center p-6 border border-destructive/50 bg-destructive/10 rounded-md">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-bold text-destructive mb-2">Failed to Load Beats</h2>
      <p className="text-destructive/80 mb-4">{error}</p>
      <Button
        onClick={() => loadBeats()} 
        variant="destructive"
      >
        Try Again
      </Button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-muted-foreground mb-4">
        {hasActiveFilters ? "No beats found matching your filters." : "No beats found. Check back soon!"}
      </div>
      {hasActiveFilters && (
        <Button variant="outline" onClick={handleClearFilters} className="gap-2">
          <XCircle size={16} /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="mb-8 p-4 border rounded-lg bg-card shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label htmlFor="bpmFilter" className="text-sm font-medium text-muted-foreground">BPM</label>
            <Input
              id="bpmFilter"
              type="number"
              placeholder="e.g., 120"
              value={bpmFilter}
              onChange={(e) => setBpmFilter(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="keyFilter" className="text-sm font-medium text-muted-foreground">Key</label>
            <Input
              id="keyFilter"
              type="text"
              placeholder="e.g., C Minor"
              value={keyFilter}
              onChange={(e) => setKeyFilter(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="tagsFilter" className="text-sm font-medium text-muted-foreground">Tags (comma-separated)</label>
            <Input
              id="tagsFilter"
              type="text"
              placeholder="e.g., trap, lofi, chill"
              value={tagsFilter}
              onChange={(e) => setTagsFilter(e.target.value)}
              className="h-10"
            />
          </div>
          <Button onClick={handleClearFilters} variant="outline" className="h-10 md:self-end">
            Clear Filters
          </Button>
        </div>
      </div>

      {loading && <LoadingSkeleton />}
      {!loading && error && <ErrorDisplay />}
      {!loading && !error && beats.length === 0 && <EmptyState />}
      {!loading && !error && beats.length > 0 && (
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
            key={beat.key || undefined} // Changed from key_signature
              tags={beat.tags}
            />
          ))}
        </div>
      )}
    </ErrorBoundary>
  );
};

export default BeatCardContainer;
