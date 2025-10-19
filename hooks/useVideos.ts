import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, Video } from '../lib/supabase';

export const useVideos = () => {
  const queryClient = useQueryClient();

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async (): Promise<Video[]> => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const likeVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      // First get the current likes count
      const { data: video, error: fetchError } = await supabase
        .from('videos')
        .select('likes_count')
        .eq('id', videoId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Then update with incremented count
      const { error } = await supabase
        .from('videos')
        .update({ likes_count: (video.likes_count || 0) + 1 })
        .eq('id', videoId);
      
      if (error) throw error;
      return videoId;
    },
    onSuccess: (videoId) => {
      queryClient.setQueryData(['videos'], (oldVideos: Video[] | undefined) => {
        if (!oldVideos) return oldVideos;
        return oldVideos.map(video => 
          video.id === videoId 
            ? { ...video, likes_count: video.likes_count + 1 }
            : video
        );
      });
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: async ({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration = 0,
      score = 0,
    }: {
      title: string;
      description?: string;
      videoUrl: string;
      thumbnailUrl?: string;
      duration?: number;
      score?: number;
    }) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title,
          description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          duration,
          score,
        })
        .select('*')
        .single();
      if (error) throw error;
      return data as Video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  return {
    videos: videos || [],
    isLoading,
    error,
    likeVideo: likeVideoMutation.mutate,
    createVideo: createVideoMutation.mutateAsync,
  };
};



