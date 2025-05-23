
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      beats: {
        Row: {
          id: string
          title: string
          producer: string
          image_url: string | null
          audio_url: string | null
          bpm: number | null
          key: string | null
          tags: string[]
          description: string | null
          downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          producer: string
          image_url?: string | null
          audio_url?: string | null
          bpm?: number | null
          key?: string | null
          tags?: string[]
          description?: string | null
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          producer?: string
          image_url?: string | null
          audio_url?: string | null
          bpm?: number | null
          key?: string | null
          tags?: string[]
          description?: string | null
          downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      remixes: {
        Row: {
          id: string
          title: string
          remixer: string
          original_artist: string
          youtube_id: string | null
          tags: string[]
          description: string | null
          downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          remixer: string
          original_artist: string
          youtube_id?: string | null
          tags?: string[]
          description?: string | null
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          remixer?: string
          original_artist?: string
          youtube_id?: string | null
          tags?: string[]
          description?: string | null
          downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      cover_art: {
        Row: {
          id: string
          title: string
          artist: string
          image_url: string
          tags: string[]
          downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          image_url: string
          tags?: string[]
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          image_url?: string
          tags?: string[]
          downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          item_id: string
          item_type: string
          email: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          item_type: string
          email?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          item_type?: string
          email?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          role: 'admin' | 'editor' | 'user'; // Added role
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'editor' | 'user' | null; // Added role
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'editor' | 'user' | null; // Added role
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          opted_in: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          opted_in?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          opted_in?: boolean
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Beat = Database['public']['Tables']['beats']['Row']
export type Remix = Database['public']['Tables']['remixes']['Row']
export type CoverArt = Database['public']['Tables']['cover_art']['Row']
export type Download = Database['public']['Tables']['downloads']['Row']
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']
