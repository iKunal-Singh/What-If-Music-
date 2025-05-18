
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Music, Image, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getContentStats } from '@/lib/api/content';

const DashboardOverview = () => {
  const { 
    data: stats, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getContentStats,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Subscribe to realtime changes
  useEffect(() => {
    // Setup realtime subscription for all content tables
    const beatsChannel = supabase
      .channel('public:beats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beats' }, () => {
        refetch();
      })
      .subscribe();

    const remixesChannel = supabase
      .channel('public:remixes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'remixes' }, () => {
        refetch();
      })
      .subscribe();
      
    const coverArtChannel = supabase
      .channel('public:cover_art')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cover_art' }, () => {
        refetch();
      })
      .subscribe();
      
    const downloadsChannel = supabase
      .channel('public:downloads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'downloads' }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(beatsChannel);
      supabase.removeChannel(remixesChannel);
      supabase.removeChannel(coverArtChannel);
      supabase.removeChannel(downloadsChannel);
    };
  }, [refetch]);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error('Failed to load dashboard statistics');
      console.error('Error fetching stats:', error);
    }
  }, [error]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Beats Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Beats</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.beatsCount || 0}</div>
            )}
          </CardContent>
        </Card>

        {/* Remixes Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Remixes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.remixesCount || 0}</div>
            )}
          </CardContent>
        </Card>

        {/* Cover Art Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Cover Arts</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.coverArtCount || 0}</div>
            )}
          </CardContent>
        </Card>

        {/* Downloads Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.downloadsCount || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
