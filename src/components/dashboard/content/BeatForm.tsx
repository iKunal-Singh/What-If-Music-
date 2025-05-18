
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
import { Beat } from '@/lib/api';
import { createBeat, updateBeat, uploadFile, getFileUrl } from '@/lib/api/content';

const beatSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  producer: z.string().min(1, 'Producer is required'),
  bpm: z.string().optional(),
  key: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type BeatFormValues = z.infer<typeof beatSchema> & {
  audioFile?: FileList;
  imageFile?: FileList;
};

interface BeatFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Beat;
}

export default function BeatForm({ open, onClose, onSuccess, initialData }: BeatFormProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<BeatFormValues>({
    resolver: zodResolver(beatSchema),
    defaultValues: {
      title: initialData?.title || '',
      producer: initialData?.producer || '',
      bpm: initialData?.bpm ? String(initialData.bpm) : '',
      key: initialData?.key || '',
      description: initialData?.description || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
    },
  });

  const onSubmit = async (values: BeatFormValues) => {
    try {
      setLoading(true);
      
      let audioUrl = initialData?.audio_url;
      let imageUrl = initialData?.image_url;
      
      // Handle audio file upload if provided
      if (values.audioFile?.[0]) {
        const fileName = `${Date.now()}-${values.audioFile[0].name}`;
        const filePath = `beats/${fileName}`;
        await uploadFile('beats', filePath, values.audioFile[0]);
        audioUrl = getFileUrl('beats', filePath);
      }
      
      // Handle image file upload if provided
      if (values.imageFile?.[0]) {
        const fileName = `${Date.now()}-${values.imageFile[0].name}`;
        const filePath = `images/${fileName}`;
        await uploadFile('images', filePath, values.imageFile[0]);
        imageUrl = getFileUrl('images', filePath);
      }
      
      const beatData = {
        title: values.title,
        producer: values.producer,
        bpm: values.bpm ? parseInt(values.bpm) : null,
        key: values.key || null,
        description: values.description || null,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        audio_url: audioUrl,
        image_url: imageUrl,
      };
      
      if (initialData) {
        await updateBeat(initialData.id, beatData);
        toast.success('Beat updated successfully');
      } else {
        await createBeat(beatData);
        toast.success('Beat created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving beat:', error);
      toast.error('Failed to save beat');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Beat' : 'Add New Beat'}</DialogTitle>
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
                    <Input placeholder="Enter beat title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="producer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producer *</FormLabel>
                  <FormControl>
                    <Input placeholder="Producer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BPM</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input placeholder="C Minor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Trap, Hip Hop, 90bpm (comma separated)" {...field} />
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
                      placeholder="Enter beat description" 
                      {...field}
                      rows={3} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="audioFile"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Audio File {!initialData && '*'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="audio/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  {initialData?.audio_url && (
                    <div className="text-xs text-muted-foreground">
                      Current: {initialData.audio_url.split('/').pop()}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
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
                {initialData ? 'Update Beat' : 'Save Beat'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
