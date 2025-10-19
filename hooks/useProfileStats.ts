import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useProfileStats = (userId?: string) => {
  return useQuery({
    queryKey: ['profileStats', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;

      // Get user's videos count
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get user's total score (sum of all video scores)
      const { data: videos } = await supabase
        .from('videos')
        .select('score')
        .eq('user_id', userId);

      const totalScore = videos?.reduce((sum, video) => sum + (video.score || 0), 0) || 0;

      // Get followers count (users who liked this user's videos)
      const { count: followersCount } = await supabase
        .from('videos')
        .select('likes_count', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Calculate total followers (simplified - using total likes as proxy)
      const { data: userVideos } = await supabase
        .from('videos')
        .select('likes_count')
        .eq('user_id', userId);

      const totalFollowers = userVideos?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0;

      // Following count (simplified - using a fixed number for now)
      // In a real app, you'd have a followers/following table
      const followingCount = Math.floor(totalFollowers * 0.7); // Rough estimate

      return {
        videos: videosCount || 0,
        followers: totalFollowers,
        following: followingCount,
        totalScore: totalScore,
      };
    },
  });
};
