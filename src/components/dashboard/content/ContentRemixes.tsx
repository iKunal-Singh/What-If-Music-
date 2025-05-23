
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Remix } from '@/lib/api';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import RemixForm from './RemixForm';
import { deleteRemix } from '@/lib/api/content';
import APIErrorBoundary from '@/components/common/APIErrorBoundary';

interface ContentRemixesProps {
  searchResults?: Remix[];
  isSearching?: boolean;
  searchTerm?: string;
}

const ContentRemixes = ({ searchResults, isSearching, searchTerm = '' }: ContentRemixesProps) => {
  const [selectedRemix, setSelectedRemix] = useState<Remix | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [remixToDelete, setRemixToDelete] = useState<Remix | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch remixes with React Query
  const { data: remixes = [], isLoading, refetch } = useQuery({
    queryKey: ['remixes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remixes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Remix[];
    },
    enabled: !searchTerm // Only run this query when not searching
  });

  // If we have search results and a search term, use those instead
  const displayedRemixes = searchTerm && searchResults ? searchResults : remixes;
  const isLoadingRemixes = (searchTerm && isSearching) || (!searchTerm && isLoading);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRemix(id),
    onSuccess: () => {
      toast.success('Remix deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['remixes'] });
      setRemixToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting remix:', error);
      toast.error('Failed to delete remix');
    }
  });

  const handleDeleteClick = (remix: Remix) => {
    setRemixToDelete(remix);
  };

  const confirmDelete = () => {
    if (remixToDelete) {
      deleteMutation.mutate(remixToDelete.id);
    }
  };

  const handleEditClick = (remix: Remix) => {
    setSelectedRemix(remix);
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
    <APIErrorBoundary onReset={refetch} fallbackMessage="Failed to load remixes data">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {searchTerm ? `Search Results: ${searchTerm}` : 'Remixes List'}
          </h2>
          <Button className="gap-1" onClick={handleCreateClick}>
            <Plus size={16} />
            Add New Remix
          </Button>
        </div>

        {isLoadingRemixes ? (
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
                  <TableHead>Remixer</TableHead>
                  <TableHead>Original Artist</TableHead>
                  <TableHead>YouTube ID</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedRemixes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchTerm ? (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="h-8 w-8 mb-2" />
                          <p>No remixes found matching "{searchTerm}"</p>
                        </div>
                      ) : (
                        'No remixes found'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedRemixes.map((remix) => (
                    <TableRow key={remix.id}>
                      <TableCell className="font-medium">{remix.title}</TableCell>
                      <TableCell>{remix.remixer}</TableCell>
                      <TableCell>{remix.original_artist}</TableCell>
                      <TableCell>{remix.youtube_id ? remix.youtube_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {remix.tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {remix.tags && remix.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{remix.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{remix.downloads}</TableCell>
                      <TableCell>{formatDate(remix.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/remixes?id=${remix.id}`} target="_blank" rel="noopener noreferrer">
                              <Eye size={16} />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(remix)}>
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(remix)}
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
          <RemixForm 
            open={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['remixes'] })}
          />
        )}

        {/* Edit Form Dialog */}
        {selectedRemix && isEditOpen && (
          <RemixForm 
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['remixes'] })}
            initialData={selectedRemix}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!remixToDelete} onOpenChange={() => setRemixToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the remix "{remixToDelete?.title}". This action cannot be undone.
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

export default ContentRemixes;
