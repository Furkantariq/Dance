import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Video } from '../lib/supabase';

export default function MyVideosScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Mock data for now - in a real app, you'd fetch user's videos
  const userVideos: Video[] = [
    {
      id: '1',
      user_id: user?.id || '',
      title: 'Amazing Dance Moves',
      description: 'My latest dance performance',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail_url: 'https://picsum.photos/400/600?random=1',
      duration: 120,
      likes_count: 245,
      views_count: 1250,
      score: 850,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      user: user || undefined,
    },
    {
      id: '2',
      user_id: user?.id || '',
      title: 'Hip Hop Routine',
      description: 'Practicing my hip hop skills',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail_url: 'https://picsum.photos/400/600?random=2',
      duration: 95,
      likes_count: 189,
      views_count: 890,
      score: 720,
      created_at: '2024-01-10T15:30:00Z',
      updated_at: '2024-01-10T15:30:00Z',
      user: user || undefined,
    },
    {
      id: '3',
      user_id: user?.id || '',
      title: 'Contemporary Dance',
      description: 'Expressing emotions through movement',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail_url: 'https://picsum.photos/400/600?random=3',
      duration: 180,
      likes_count: 312,
      views_count: 2100,
      score: 950,
      created_at: '2024-01-05T20:15:00Z',
      updated_at: '2024-01-05T20:15:00Z',
      user: user || undefined,
    },
  ];

  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity style={styles.videoCard} activeOpacity={0.8}>
      <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.videoStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#ef4444" />
            <Text style={styles.statText}>{item.likes_count}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color="#6b7280" />
            <Text style={styles.statText}>{item.views_count}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={16} color="#f59e0b" />
            <Text style={styles.statText}>{item.score}</Text>
          </View>
        </View>
        <Text style={styles.videoDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Videos</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {userVideos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={64} color="#6b7280" />
            <Text style={styles.emptyTitle}>No Videos Yet</Text>
            <Text style={styles.emptyDescription}>
              Start your dance journey by uploading your first video!
            </Text>
            <TouchableOpacity 
              style={styles.uploadFirstButton}
              onPress={() => router.push('/(tabs)/upload')}
            >
              <Text style={styles.uploadFirstButtonText}>Upload Video</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={userVideos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.videoList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  uploadButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  uploadFirstButton: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  uploadFirstButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoList: {
    padding: 16,
  },
  videoCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  videoDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
});
