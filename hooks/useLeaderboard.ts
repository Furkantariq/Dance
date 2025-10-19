import { useQuery } from '@tanstack/react-query';
import { LeaderboardEntry, supabase } from '../lib/supabase';

export const useLeaderboard = () => {
  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true });

      if (error) throw error;
      const rows = (data || []) as any[];
      return rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        video_id: r.video_id,
        score: Number(r.score ?? 0),
        rank: Number(r.rank ?? 0),
        user: {
          id: r.user_id,
          email: r.email,
          username: r.username,
          full_name: r.full_name,
          avatar_url: r.avatar_url,
          created_at: r.user_created_at,
          updated_at: r.user_updated_at,
        },
        video: {
          id: r.video_id,
          user_id: r.user_id,
          title: r.video_title,
          description: r.video_description,
          video_url: r.video_url,
          thumbnail_url: r.thumbnail_url,
          duration: Number(r.duration ?? 0),
          likes_count: Number(r.likes_count ?? 0),
          views_count: Number(r.views_count ?? 0),
          score: Number(r.score ?? 0),
          created_at: r.video_created_at,
          updated_at: r.video_updated_at,
        },
      }));
    },
  });

  return {
    leaderboard: leaderboard || [],
    isLoading,
    error,
  };
};



