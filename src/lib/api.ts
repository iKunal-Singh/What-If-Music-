
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Beat {
  id: string;
  title: string;
  producer: string;
  image_url: string;
  audio_url: string;
  bpm: number | null;
  key: string | null;
  tags: string[];
  description: string | null;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface Remix {
  id: string;
  title: string;
  remixer: string;
  original_artist: string;
  youtube_id: string;
  tags: string[];
  description: string | null;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface CoverArt {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  tags: string[];
  downloads: number;
  created_at: string;
  updated_at: string;
}

// Fetch all beats
export const fetchBeats = async (): Promise<Beat[]> => {
  const { data, error } = await supabase
    .from('beats')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beats:', error);
    throw error;
  }

  return data || [];
};

// Fetch all remixes
export const fetchRemixes = async (): Promise<Remix[]> => {
  const { data, error } = await supabase
    .from('remixes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching remixes:', error);
    throw error;
  }

  return data || [];
};

// Fetch all cover art
export const fetchCoverArt = async (): Promise<CoverArt[]> => {
  const { data, error } = await supabase
    .from('cover_art')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cover art:', error);
    throw error;
  }

  return data || [];
};

// Record a download
export const recordDownload = async (
  itemId: string,
  itemType: 'beat' | 'remix' | 'cover_art',
  email?: string
): Promise<void> => {
  // First, increment the download count in the appropriate table
  const tableName = itemType === 'beat' ? 'beats' : 
                   itemType === 'remix' ? 'remixes' : 'cover_art';
  
  try {
    // First, fetch the current downloads count
    const { data: itemData, error: fetchError } = await supabase
      .from(tableName)
      .select('downloads')
      .eq('id', itemId)
      .single();

    if (fetchError) {
      console.error(`Error fetching current download count:`, fetchError);
      return;
    }

    // Then update with incremented value
    const currentDownloads = itemData?.downloads || 0;
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ downloads: currentDownloads + 1 })
      .eq('id', itemId);

    if (updateError) {
      console.error(`Error incrementing download count:`, updateError);
    }

    // Then record the download in the downloads table
    const { error } = await supabase
      .from('downloads')
      .insert({
        item_id: itemId,
        item_type: itemType,
        email: email,
        user_agent: navigator.userAgent,
        ip_address: 'client-side' // Will be replaced with the actual IP on the server
      });

    if (error) {
      console.error('Error recording download:', error);
    }
  } catch (err) {
    console.error('Download recording failed:', err);
  }
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string): Promise<boolean> => {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email });

  if (error) {
    // If it's a unique violation, the user is already subscribed
    if (error.code === '23505') {
      return true; // Already subscribed is still a success
    }
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }

  return true;
};

// Generate download URL
export const getDownloadURL = async (
  bucket: string,
  path: string
): Promise<string> => {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60); // 60 seconds

  if (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }

  return data.signedUrl;
};
