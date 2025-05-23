
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Beat } from '@/lib/api';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import BeatForm from './BeatForm';
import { deleteBeat } from '@/lib/api/content';
import APIErrorBoundary from '@/components/common/APIErrorBoundary';

interface ContentBeatsProps {
  searchResults?: Beat[];
  isSearching?: boolean;
  searchTerm?: string;
}

const ContentBeats = ({ searchResults, isSearching, searchTerm = '' }: ContentBeatsProps) => {
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [beatToDelete, setBeatToDelete] = useState<Beat | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch beats with React Query
  const { data: beats = [], isLoading, refetch } = useQuery({
    queryKey: ['beats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beats')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Beat[];
    },
    enabled: !searchTerm // Only run this query when not searching
  });

  // If we have search results and a search term, use those instead
  const displayedBeats = searchTerm && searchResults ? searchResults : beats;
  const isLoadingBeats = (searchTerm && isSearching) || (!searchTerm && isLoading);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBeat(id),
    onSuccess: () => {
      toast.success('Beat deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['beats'] });
      setBeatToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting beat:', error);
      toast.error('Failed to delete beat');
    }
  });

  const handleDeleteClick = (beat: Beat) => {
    setBeatToDelete(beat);
  };

  const confirmDelete = () => {
    if (beatToDelete) {
      deleteMutation.mutate(beatToDelete.id);
    }
  };

  const handleEditClick = (beat: Beat) => {
    setSelectedBeat(beat);
    setIsEditOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <APIErrorBoundary onReset={refetch} fallbackMessage="Failed to load beats data">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {searchTerm ? `Search Results: ${searchTerm}` : 'Beats List'}
          </h2>
          <Button className="gap-1" onClick={handleCreateClick}>
            <Plus size={16} />
            Add New Beat
          </Button>
        </div>

        {isLoadingBeats ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex space-y-2">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Producer</TableHead>
                  <TableHead>BPM</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBeats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchTerm ? (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="h-8 w-8 mb-2" />
                          <p>No beats found matching "{searchTerm}"</p>
                        </div>
                      ) : (
                        'No beats found'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedBeats.map((beat) => (
                    <TableRow key={beat.id}>
                      <TableCell className="font-medium">{beat.title}</TableCell>
                      <TableCell>{beat.producer}</TableCell>
                      <TableCell>{beat.bpm || 'N/A'}</TableCell>
                      <TableCell>{beat.key || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {beat.tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {beat.tags && beat.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{beat.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{beat.downloads}</TableCell>
                      <TableCell>{formatDate(beat.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/beats?id=${beat.id}`} target="_blank" rel="noopener noreferrer">
                              <Eye size={16} />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(beat)}>
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(beat)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create Form Dialog */}
        {isCreateOpen && (
          <BeatForm 
            open={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['beats'] })}
          />
        )}

        {/* Edit Form Dialog */}
        {selectedBeat && isEditOpen && (
          <BeatForm 
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['beats'] })}
            initialData={selectedBeat}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!beatToDelete} onOpenChange={() => setBeatToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the beat "{beatToDelete?.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </APIErrorBoundary>
  );
};

export default ContentBeats;
