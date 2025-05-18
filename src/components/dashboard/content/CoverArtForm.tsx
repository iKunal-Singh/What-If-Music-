
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CoverArt } from '@/lib/api';
import { createCoverArt, updateCoverArt, uploadFile, getFileUrl } from '@/lib/api/content';

const coverArtSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  tags: z.string().optional(),
});

type CoverArtFormValues = z.infer<typeof coverArtSchema> & {
  imageFile?: FileList;
};

interface CoverArtFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CoverArt;
}

export default function CoverArtForm({ open, onClose, onSuccess, initialData }: CoverArtFormProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<CoverArtFormValues>({
    resolver: zodResolver(coverArtSchema),
    defaultValues: {
      title: initialData?.title || '',
      artist: initialData?.artist || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
    },
  });

  const onSubmit = async (values: CoverArtFormValues) => {
    try {
      setLoading(true);
      
      let imageUrl = initialData?.image_url;
      
      // Handle image file upload if provided
      if (values.imageFile?.[0]) {
        const fileName = `${Date.now()}-${values.imageFile[0].name}`;
        const filePath = `cover-art/${fileName}`;
        await uploadFile('images', filePath, values.imageFile[0]);
        imageUrl = getFileUrl('images', filePath);
      }
      
      const coverArtData = {
        title: values.title,
        artist: values.artist,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        image_url: imageUrl,
      };
      
      if (initialData) {
        if (!imageUrl) {
          toast.error('Cover art image is required');
          setLoading(false);
          return;
        }
        await updateCoverArt(initialData.id, coverArtData);
        toast.success('Cover art updated successfully');
      } else {
        if (!imageUrl) {
          toast.error('Cover art image is required');
          setLoading(false);
          return;
        }
        await createCoverArt(coverArtData);
        toast.success('Cover art created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving cover art:', error);
      toast.error('Failed to save cover art');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Cover Art' : 'Add New Cover Art'}</DialogTitle>
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
                    <Input placeholder="Enter cover art title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist *</FormLabel>
                  <FormControl>
                    <Input placeholder="Artist name" {...field} />
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
                    <Input placeholder="Album, Single, EP (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Cover Image {!initialData && '*'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  {initialData?.image_url && (
                    <div className="text-xs text-muted-foreground">
                      Current: {initialData.image_url.split('/').pop()}
                    </div>
                  )}
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
                {initialData ? 'Update Cover Art' : 'Save Cover Art'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
