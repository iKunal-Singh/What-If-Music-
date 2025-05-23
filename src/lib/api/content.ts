
import { supabase } from '@/integrations/supabase/client';
import { Beat, CoverArt, Remix } from '@/lib/api';

// CRUD operations for beats
export const createBeat = async (beat: Omit<Beat, 'id' | 'created_at' | 'updated_at' | 'downloads'>) => {
  const { data, error } = await supabase
    .from('beats')
    .insert(beat)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const updateBeat = async (id: string, beat: Partial<Beat>) => {
  const { data, error } = await supabase
    .from('beats')
    .update(beat)
    .eq('id', id)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteBeat = async (id: string) => {
  const { error } = await supabase
    .from('beats')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

// CRUD operations for remixes
export const createRemix = async (remix: Omit<Remix, 'id' | 'created_at' | 'updated_at' | 'downloads'>) => {
  const { data, error } = await supabase
    .from('remixes')
    .insert(remix)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const updateRemix = async (id: string, remix: Partial<Remix>) => {
  const { data, error } = await supabase
    .from('remixes')
    .update(remix)
    .eq('id', id)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteRemix = async (id: string) => {
  const { error } = await supabase
    .from('remixes')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

// CRUD operations for cover art
export const createCoverArt = async (coverArt: Omit<CoverArt, 'id' | 'created_at' | 'updated_at' | 'downloads'>) => {
  const { data, error } = await supabase
    .from('cover_art')
    .insert(coverArt)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const updateCoverArt = async (id: string, coverArt: Partial<CoverArt>) => {
  const { data, error } = await supabase
    .from('cover_art')
    .update(coverArt)
    .eq('id', id)
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteCoverArt = async (id: string) => {
  const { error } = await supabase
    .from('cover_art')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

// File upload operations
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File,
  options = {}
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      ...options,
    });

  if (error) throw error;
  return data;
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Analytics operations
export const getContentStats = async () => {
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
};
