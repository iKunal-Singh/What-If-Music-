
import { useMemo, useState } from 'react'; // Added useState
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Added Button
import { Skeleton } from '@/components/ui/skeleton';
import { FileIcon, MusicIcon, ImageIcon, FileTextIcon, AlertCircle, LinkIcon, ShieldAlert, Trash2 } from 'lucide-react'; // Added Trash2
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Added useQueryClient
import { useAuthContext } from '@/context/AuthContext';
import { toast } from 'sonner'; // Added toast
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Added AlertDialog components


// Interface for individual file from the new edge function
interface StorageFileUID extends StorageFile { // Added uniqueKey to the interface for clarity
  bucketName: string;
  uniqueKey: string;
}

interface StorageFile {
  name: string;
  id: string | null; // id can be null
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  } | null; // metadata can be null
  public_url: string;
}

// Interface for the structure returned by the edge function
interface BucketListing {
  bucketName: string;
  files: StorageFile[];
  error?: string; // Optional error field per bucket
}

const DashboardUploads = () => {
  const { hasRole, isLoadingProfile } = useAuthContext();
  const queryClient = useQueryClient(); // Initialize queryClient
  const [fileToDelete, setFileToDelete] = useState<StorageFileUID | null>(null); // State for delete confirmation

  const canManageUploads = useMemo(() => !isLoadingProfile && hasRole(['admin', 'editor']), [isLoadingProfile, hasRole]);

  const fetchProtectedUploads = async (): Promise<BucketListing[]> => {
    if (!canManageUploads) { // Changed from canViewUploads
      // This should ideally not be called if canManageUploads is false due to query `enabled` option
      throw new Error("User not authorized to view uploads.");
    }
    const { data, error } = await supabase.functions.invoke('list-storage-files');
    if (error) {
      console.error("Error invoking list-storage-files:", error);
      throw new Error(error.message || "Failed to fetch files from edge function.");
    }
    if (!data) {
        return [];
    }
    // The function returns data directly, ensure it matches BucketListing[]
    return data as BucketListing[];
  };
  
  const { data: protectedFileListings, isLoading: isLoadingFiles, error: fetchError } = useQuery<BucketListing[], Error>({
    queryKey: ['protectedUploads'], // Ensure this matches what's invalidated
    queryFn: fetchProtectedUploads,
    enabled: canManageUploads, // Changed from canViewUploads
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleDeleteFileClick = (file: StorageFileUID) => {
    setFileToDelete(file);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    const promise = supabase.functions.invoke('delete-storage-file', {
      body: { bucketName: fileToDelete.bucketName, filePath: fileToDelete.name }, // filePath is file.name
    });

    toast.promise(promise, {
      loading: `Deleting file ${fileToDelete.name} from ${fileToDelete.bucketName}...`,
      success: (res) => {
        if (res.error) {
          throw new Error(res.data?.error || res.error?.message || 'Function error during delete');
        }
        queryClient.invalidateQueries({ queryKey: ['protectedUploads'] });
        setFileToDelete(null); // Close dialog
        return `File ${fileToDelete.name} deleted successfully.`;
      },
      error: (err) => {
        setFileToDelete(null); // Close dialog
        return `Failed to delete file: ${err.message}`;
      },
    });
  };

  const formatFileSize = (bytes: number | undefined | null) => {
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
  
  // Flatten all files from all buckets into a single array for easier rendering
  const allDisplayFiles = useMemo((): StorageFileUID[] => {
    return protectedFileListings?.flatMap(bucketListing => 
      bucketListing.files.map(file => ({
        ...file,
        bucketName: bucketListing.bucketName,
        uniqueKey: `${bucketListing.bucketName}-${file.name}-${file.id || Math.random()}` 
      }))
    ) || [];
  }, [protectedFileListings]);

  if (isLoadingProfile) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Upload Management</h1>
        <Card>
          <CardHeader><CardTitle>All Uploaded Files</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canManageUploads) { // Changed from canViewUploads
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Upload Management</h1>
        <Card>
          <CardHeader><CardTitle>All Uploaded Files</CardTitle></CardHeader>
          <CardContent>
            <div className="p-6 bg-yellow-500/10 text-yellow-700 rounded-md flex items-center space-x-3">
              <ShieldAlert size={24} />
              <div>
                <h3 className="font-semibold">Permission Denied</h3>
                <p className="text-sm">You do not have permission to manage uploaded files. Please contact an administrator if you believe this is an error.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingFiles ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : fetchError ? (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-md flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>Error loading files: {fetchError.message}. Please try again later.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Bucket</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allDisplayFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center"> {/* Adjusted colSpan */}
                      No uploads found in any monitored bucket.
                    </TableCell>
                  </TableRow>
                ) : (
                  allDisplayFiles.map((file) => (
                    <TableRow key={file.uniqueKey}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.name)}
                          <span className="font-medium truncate max-w-[150px] sm:max-w-[250px]" title={file.name}>{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{file.bucketName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {getFileExtension(file.name)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.metadata?.size)}</TableCell>
                      <TableCell>{formatDate(file.created_at || file.metadata?.lastModified)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline p-2">
                            <LinkIcon size={16} />
                          </a>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => handleDeleteFileClick(file)}
                            className="h-8 w-8"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
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
