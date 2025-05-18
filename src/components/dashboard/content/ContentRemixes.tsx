
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Remix } from '@/lib/api';

const ContentRemixes = () => {
  const [remixes, setRemixes] = useState<Remix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRemixes();
  }, []);

  const fetchRemixes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('remixes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setRemixes(data || []);
    } catch (error) {
      console.error('Error fetching remixes:', error);
      toast.error('Failed to load remixes');
    } finally {
      setLoading(false);
    }
  };

  const deleteRemix = async (id: string) => {
    try {
      const { error } = await supabase
        .from('remixes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Remix deleted successfully');
      setRemixes(remixes.filter(remix => remix.id !== id));
    } catch (error) {
      console.error('Error deleting remix:', error);
      toast.error('Failed to delete remix');
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
        <h2 className="text-xl font-semibold">Remixes List</h2>
        <Button className="gap-1">
          <Plus size={16} />
          Add New Remix
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
              {remixes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No remixes found
                  </TableCell>
                </TableRow>
              ) : (
                remixes.map((remix) => (
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
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteRemix(remix.id)}
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

export default ContentRemixes;
