
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Remix } from '@/lib/api';
import { createRemix, updateRemix } from '@/lib/api/content';

const remixSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  remixer: z.string().min(1, 'Remixer is required'),
  original_artist: z.string().min(1, 'Original artist is required'),
  youtube_id: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type RemixFormValues = z.infer<typeof remixSchema>;

interface RemixFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Remix;
}

export default function RemixForm({ open, onClose, onSuccess, initialData }: RemixFormProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<RemixFormValues>({
    resolver: zodResolver(remixSchema),
    defaultValues: {
      title: initialData?.title || '',
      remixer: initialData?.remixer || '',
      original_artist: initialData?.original_artist || '',
      youtube_id: initialData?.youtube_id || '',
      description: initialData?.description || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
    },
  });

  const onSubmit = async (values: RemixFormValues) => {
    try {
      setLoading(true);
      
      const remixData = {
        title: values.title,
        remixer: values.remixer,
        original_artist: values.original_artist,
        youtube_id: values.youtube_id || null,
        description: values.description || null,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      if (initialData) {
        await updateRemix(initialData.id, remixData);
        toast.success('Remix updated successfully');
      } else {
        await createRemix(remixData);
        toast.success('Remix created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving remix:', error);
      toast.error('Failed to save remix');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Remix' : 'Add New Remix'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter remix title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="remixer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remixer *</FormLabel>
                  <FormControl>
                    <Input placeholder="Remixer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="original_artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Artist *</FormLabel>
                  <FormControl>
                    <Input placeholder="Original artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="youtube_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube ID</FormLabel>
                  <FormControl>
                    <Input placeholder="dQw4w9WgXcQ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Pop, EDM, House (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter remix description" 
                      {...field}
                      rows={3} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {initialData ? 'Update Remix' : 'Save Remix'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
