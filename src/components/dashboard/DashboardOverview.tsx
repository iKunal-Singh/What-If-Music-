
import { useEffect, useState } from 'react';
import { Activity, Music, Image, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsData {
  beatsCount: number;
  remixesCount: number;
  coverArtCount: number;
  totalDownloads: number;
  loading: boolean;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<StatsData>({
    beatsCount: 0,
    remixesCount: 0,
    coverArtCount: 0,
    totalDownloads: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts for each content type
        const [beatsData, remixesData, coverArtData, downloadsData] = await Promise.all([
          supabase.from('beats').select('id', { count: 'exact', head: true }),
          supabase.from('remixes').select('id', { count: 'exact', head: true }),
          supabase.from('cover_art').select('id', { count: 'exact', head: true }),
          supabase.from('downloads').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          beatsCount: beatsData.count || 0,
          remixesCount: remixesData.count || 0,
          coverArtCount: coverArtData.count || 0,
          totalDownloads: downloadsData.count || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

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
            {stats.loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.beatsCount}</div>
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
            {stats.loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.remixesCount}</div>
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
            {stats.loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.coverArtCount}</div>
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
            {stats.loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
