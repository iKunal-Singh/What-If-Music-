
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileIcon, MusicIcon, ImageIcon, FileTextIcon } from 'lucide-react';

interface Upload {
  name: string;
  type: string;
  size: number;
  created_at: string;
  path: string;
}

const DashboardUploads = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example mock data since we can't directly fetch from directory
    const mockUploads = [
      {
        name: 'beat-cover-1.png',
        type: 'image/png',
        size: 1024 * 1024 * 2.3, // 2.3MB
        created_at: '2025-05-10T12:30:00Z',
        path: '/lovable-uploads/6f3af6e6-2893-440a-9d49-fee740ae1d20.png'
      },
      {
        name: 'remix-sample.mp3',
        type: 'audio/mpeg',
        size: 1024 * 1024 * 5.7, // 5.7MB
        created_at: '2025-05-08T14:25:00Z',
        path: '/lovable-uploads/a7fff71b-527c-4120-8fec-0607c49ea7c9.png'
      },
      {
        name: 'artwork-design.jpg',
        type: 'image/jpeg',
        size: 1024 * 1024 * 1.8, // 1.8MB
        created_at: '2025-05-07T09:15:00Z',
        path: '/lovable-uploads/d1f0893d-51ba-442a-9e6c-b70b5cb19c05.png'
      }
    ];
    
    // Simulate API call
    setTimeout(() => {
      setUploads(mockUploads);
      setLoading(false);
    }, 1000);
  }, []);

  // Format file size to readable format
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get appropriate icon based on file type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={16} />;
    if (type.startsWith('audio/')) return <MusicIcon size={16} />;
    if (type.startsWith('text/')) return <FileTextIcon size={16} />;
    return <FileIcon size={16} />;
  };

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex space-y-2">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
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
                {uploads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No uploads found
                    </TableCell>
                  </TableRow>
                ) : (
                  uploads.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {getFileExtension(file.name)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{formatDate(file.created_at)}</TableCell>
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
