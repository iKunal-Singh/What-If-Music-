
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileIcon, MusicIcon, ImageIcon, FileTextIcon, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Upload {
  name: string;
  type?: string;
  size?: number;
  created_at?: string;
  id?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
  last_modified?: string;
}

interface FileListing {
  bucket: string;
  files: Upload[];
}

const DashboardUploads = () => {
  const fetchAllUploads = async (): Promise<FileListing[]> => {
    try {
      // Get all storage buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw bucketsError;
      }
      
      if (!buckets || buckets.length === 0) {
        return [];
      }
      
      // For each bucket, get its files
      const fileListings = await Promise.all(
        buckets.map(async (bucket) => {
          const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list();
          
          if (filesError) {
            console.error(`Error fetching files from ${bucket.name}:`, filesError);
            return { bucket: bucket.name, files: [] };
          }
          
          return { 
            bucket: bucket.name, 
            files: files || [] 
          };
        })
      );
      
      return fileListings;
    } catch (error) {
      console.error('Error fetching uploads:', error);
      throw error;
    }
  };

  // Use react-query for data fetching with caching and automatic refetching
  const { data: fileListings, isLoading, error } = useQuery({
    queryKey: ['uploads'],
    queryFn: fetchAllUploads,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Format file size to readable format
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date to readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get appropriate icon based on file type
  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return <ImageIcon size={16} />;
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) return <MusicIcon size={16} />;
    if (['txt', 'pdf', 'doc', 'docx'].includes(ext || '')) return <FileTextIcon size={16} />;
    return <FileIcon size={16} />;
  };

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };
  
  // Flatten all files from all buckets into a single array
  const allFiles = fileListings?.flatMap(listing => 
    listing.files.map(file => ({
      ...file,
      bucket: listing.bucket,
      path: `${listing.bucket}/${file.name}`
    }))
  ) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex space-y-2">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-md flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>Error loading files. Please try again later.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Path</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No uploads found
                    </TableCell>
                  </TableRow>
                ) : (
                  allFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.name)}
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {getFileExtension(file.name)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.metadata?.size)}</TableCell>
                      <TableCell>{formatDate(file.created_at || file.last_modified)}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[200px]">
                        {file.path}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardUploads;
