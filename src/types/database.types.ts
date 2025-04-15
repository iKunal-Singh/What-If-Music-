
export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Track = {
  id: string;
  title: string;
  producer_id: string;
  description: string | null;
  bpm: number | null;
  key: string | null;
  audio_url: string | null;
  cover_art_url: string | null;
  tags: string[] | null;
  price: number;
  created_at: string;
  updated_at: string;
};

export type Playlist = {
  id: string;
  title: string;
  user_id: string;
  description: string | null;
  is_public: boolean;
  cover_art_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PlaylistTrack = {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  created_at: string;
};

