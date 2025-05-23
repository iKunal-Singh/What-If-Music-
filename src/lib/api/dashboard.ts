
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Beat, Remix, CoverArt } from '@/lib/api';

/**
 * Dashboard API utilities for data fetching and CRUD operations
 */

// Fetch dashboard statistics
export const fetchDashboardStats = async () => {
  try {
    const [beatsCount, remixesCount, coverArtCount, downloadsCount] = await Promise.all([
      supabase.from('beats').select('id', { count: 'exact', head: true }),
      supabase.from('remixes').select('id', { count: 'exact', head: true }),
      supabase.from('cover_art').select('id', { count: 'exact', head: true }),
      supabase.from('downloads').select('id', { count: 'exact', head: true })
    ]);

    return {
      beatsCount: beatsCount.count || 0,
      remixesCount: remixesCount.count || 0,
      coverArtCount: coverArtCount.count || 0,
      downloadsCount: downloadsCount.count || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // toast.error('Failed to load dashboard statistics'); // Removed
    throw error;
  }
};

// Fetch recent download activity
export const fetchRecentDownloads = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('downloads')
      .select(`
        id, 
        item_id, 
        item_type, 
        created_at,
        beats!inner(title, producer),
        remixes!inner(title, remixer),
        cover_art!inner(title, artist)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent downloads:', error);
    // toast.error('Failed to load recent download activity'); // Removed
    throw error;
  }
};

// Fetch top downloaded content
export const fetchTopDownloads = async (limit = 5) => {
  try {
    const [topBeats, topRemixes, topCoverArt] = await Promise.all([
      supabase
        .from('beats')
        .select('id, title, producer, downloads')
        .order('downloads', { ascending: false })
        .limit(limit),
      supabase
        .from('remixes')
        .select('id, title, remixer, downloads')
        .order('downloads', { ascending: false })
        .limit(limit),
      supabase
        .from('cover_art')
        .select('id, title, artist, downloads')
        .order('downloads', { ascending: false })
        .limit(limit)
    ]);

    return {
      topBeats: topBeats.data || [],
      topRemixes: topRemixes.data || [],
      topCoverArt: topCoverArt.data || []
    };
  } catch (error) {
    console.error('Error fetching top downloads:', error);
    // toast.error('Failed to load top downloaded content'); // Removed
    throw error;
  }
};

// Search across all content types
export const searchContent = async (query: string) => {
  try {
    const [beats, remixes, coverArt] = await Promise.all([
      supabase
        .from('beats')
        .select('*')
        .or(`title.ilike.%${query}%,producer.ilike.%${query}%`)
        .limit(10),
      supabase
        .from('remixes')
        .select('*')
        .or(`title.ilike.%${query}%,remixer.ilike.%${query}%,original_artist.ilike.%${query}%`)
        .limit(10),
      supabase
        .from('cover_art')
        .select('*')
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
        .limit(10)
    ]);

    return {
      beats: beats.data || [],
      remixes: remixes.data || [],
      coverArt: coverArt.data || []
    };
  } catch (error) {
    console.error('Error searching content:', error);
    // toast.error('Search failed'); // Removed
    throw error;
  }
};
