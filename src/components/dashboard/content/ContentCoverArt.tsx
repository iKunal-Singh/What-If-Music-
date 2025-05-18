
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { CoverArt } from '@/lib/api';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import CoverArtForm from './CoverArtForm';
import { deleteCoverArt } from '@/lib/api/content';

const ContentCoverArt = () => {
  const [selectedCoverArt, setSelectedCoverArt] = useState<CoverArt | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [coverArtToDelete, setCoverArtToDelete] = useState<CoverArt | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch cover arts with React Query
  const { data: coverArts = [], isLoading } = useQuery({
    queryKey: ['coverArts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cover_art')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as CoverArt[];
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCoverArt(id),
    onSuccess: () => {
      toast.success('Cover art deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['coverArts'] });
      setCoverArtToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting cover art:', error);
      toast.error('Failed to delete cover art');
    }
  });

  const handleDeleteClick = (coverArt: CoverArt) => {
    setCoverArtToDelete(coverArt);
  };

  const confirmDelete = () => {
    if (coverArtToDelete) {
      deleteMutation.mutate(coverArtToDelete.id);
    }
  };

  const handleEditClick = (coverArt: CoverArt) => {
    setSelectedCoverArt(coverArt);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Cover Art List</h2>
        <Button className="gap-1" onClick={handleCreateClick}>
          <Plus size={16} />
          Add New Cover Art
        </Button>
      </div>

      {isLoading ? (
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
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coverArts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No cover arts found
                  </TableCell>
                </TableRow>
              ) : (
                coverArts.map((art) => (
                  <TableRow key={art.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage src={art.image_url} alt={art.title} />
                        <AvatarFallback className="rounded-md">ART</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{art.title}</TableCell>
                    <TableCell>{art.artist}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {art.tags?.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {art.tags && art.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{art.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{art.downloads}</TableCell>
                    <TableCell>{formatDate(art.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/cover-art?id=${art.id}`} target="_blank" rel="noopener noreferrer">
                            <Eye size={16} />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(art)}>
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(art)}
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
        <CoverArtForm 
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['coverArts'] })}
        />
      )}

      {/* Edit Form Dialog */}
      {selectedCoverArt && isEditOpen && (
        <CoverArtForm 
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['coverArts'] })}
          initialData={selectedCoverArt}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!coverArtToDelete} onOpenChange={() => setCoverArtToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the cover art "{coverArtToDelete?.title}". This action cannot be undone.
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
  );
};

export default ContentCoverArt;
