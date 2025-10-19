import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kdasznasmlspfyxtlgsr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkYXN6bmFzbWxzcGZ5eHRsZ3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzUzODUsImV4cCI6MjA3NjIxMTM4NX0.nBW_OoNU0QcayVAiOdcQj8Bf7GxtP4qkUARXhirYFg8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  likes_count: number;
  views_count: number;
  score: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  video_id: string;
  score: number;
  rank: number;
  user: User;
  video: Video;
}
