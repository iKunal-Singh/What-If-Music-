
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { CoverArt } from '@/lib/api';

const ContentCoverArt = () => {
  const [coverArts, setCoverArts] = useState<CoverArt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoverArts();
  }, []);

  const fetchCoverArts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cover_art')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setCoverArts(data || []);
    } catch (error) {
      console.error('Error fetching cover arts:', error);
      toast.error('Failed to load cover arts');
    } finally {
      setLoading(false);
    }
  };

  const deleteCoverArt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cover_art')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Cover art deleted successfully');
      setCoverArts(coverArts.filter(art => art.id !== id));
    } catch (error) {
      console.error('Error deleting cover art:', error);
      toast.error('Failed to delete cover art');
    }
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
        <Button className="gap-1">
          <Plus size={16} />
          Add New Cover Art
        </Button>
      </div>

      {loading ? (
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
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteCoverArt(art.id)}
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
    </div>
  );
};

export default ContentCoverArt;
