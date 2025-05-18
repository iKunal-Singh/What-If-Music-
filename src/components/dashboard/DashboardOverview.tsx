
import { useEffect, useState } from 'react';
import { Activity, Music, Image, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface StatsData {
  beatsCount: number;
  remixesCount: number;
  coverArtCount: number;
  totalDownloads: number;
}

const fetchStats = async (): Promise<StatsData> => {
  try {
    // Fetch counts for each content type
    const [beatsData, remixesData, coverArtData, downloadsData] = await Promise.all([
      supabase.from('beats').select('id', { count: 'exact', head: true }),
      supabase.from('remixes').select('id', { count: 'exact', head: true }),
      supabase.from('cover_art').select('id', { count: 'exact', head: true }),
      supabase.from('downloads').select('id', { count: 'exact', head: true })
    ]);

    // Check for errors
    if (beatsData.error) throw new Error(beatsData.error.message);
    if (remixesData.error) throw new Error(remixesData.error.message);
    if (coverArtData.error) throw new Error(coverArtData.error.message);
    if (downloadsData.error) throw new Error(downloadsData.error.message);

    return {
      beatsCount: beatsData.count || 0,
      remixesCount: remixesData.count || 0,
      coverArtCount: coverArtData.count || 0,
      totalDownloads: downloadsData.count || 0
    };
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    toast.error('Failed to load dashboard statistics');
    throw error;
  }
};

const DashboardOverview = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchStats,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

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
              <div className="text-2xl font-bold">{stats?.totalDownloads || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
