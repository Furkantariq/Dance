import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase, User } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 0, // Always fetch fresh session data
    gcTime: 0, // Don't cache session data
  });

  // Load current user profile from public.users when session exists
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session!.user!.id)
        .single();
      if (error) throw error;
      setUser(data as User);
      return data as User;
    },
  });

  // Derive a user object from session metadata if profile record is not yet created
  const derivedUser: User | null = user || ((session as any)?.user
    ? {
        id: (session as any).user.id,
        email: (session as any).user.email || '',
        username: ((session as any).user.user_metadata as any)?.username || '',
        full_name: ((session as any).user.user_metadata as any)?.full_name || '',
        avatar_url: ((session as any).user.user_metadata as any)?.avatar_url,
        bio: ((session as any).user.user_metadata as any)?.bio,
        created_at: '',
        updated_at: '',
      }
    : null);

  // Keep React Query cache in sync with Supabase auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      queryClient.setQueryData(['session'], newSession);
      
      // Clear user state when signed out
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, username, fullName, bio }: {
      email: string;
      password: string;
      username: string;
      fullName: string;
      bio?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            bio: bio || '',
          },
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      // Check if there's actually a session to sign out from
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No active session to sign out from');
        return;
      }
      
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        // If session is already missing, that's actually fine for signOut
        if ((error as any)?.message?.includes('Auth session missing')) {
          console.log('Session already cleared, continuing with signOut');
          return;
        }
        throw error;
      }
    },
    onSuccess: async () => {
      setUser(null);
      // Clear specific queries and invalidate session
      queryClient.removeQueries({ queryKey: ['session'] });
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      
      // Clear AsyncStorage to remove any persisted session data
      try {
        const keys = await AsyncStorage.getAllKeys();
        const supabaseKeys = keys.filter(key => key.includes('supabase') || key.includes('sb-'));
        if (supabaseKeys.length > 0) {
          await AsyncStorage.multiRemove(supabaseKeys);
        }
      } catch (error) {
        console.log('Error clearing AsyncStorage:', error);
      }
    },
    onError: (error) => {
      // Only log non-session-missing errors
      if (!(error as any)?.message?.includes('Auth session missing')) {
        console.error('Sign out error:', error);
      }
    },
  });

  return {
    user: derivedUser,
    session,
    // Expose async variants so callers can await and catch errors properly
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isLoading: sessionLoading || signUpMutation.isPending || signInMutation.isPending || signOutMutation.isPending,
    error: signUpMutation.error || signInMutation.error || signOutMutation.error,
  };
};



