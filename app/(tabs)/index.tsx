import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideos } from '../../hooks/useVideos';
import { Video as VideoType } from '../../lib/supabase';

// Use window dimensions to reflect current visible area
// Recomputes on layout changes to keep the video perfectly fitted.
function useScreenSize() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  return { 
    width, 
    height,
    isLandscape,
    // In landscape, use full screen dimensions
    videoWidth: isLandscape ? width : width,
    videoHeight: isLandscape ? height : height
  };
}

export default function VideoFeedScreen() {
  const { width, height, isLandscape, videoWidth, videoHeight } = useScreenSize();
  const { videos, isLoading, likeVideo } = useVideos();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoPlayers = useRef<{ [key: string]: any }>({});
  const insets = useSafeAreaInsets();
  // Calculate target height based on orientation
  const TAB_BAR_HEIGHT = isLandscape ? 0 : 64; // Hide tab bar in landscape
  const targetHeight = isLandscape 
    ? height // Full height in landscape
    : Math.max(0, height - insets.top - (insets.bottom + TAB_BAR_HEIGHT));

  const handleVideoPress = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = (videoId: string) => {
    likeVideo(videoId);
  };

  // Effect to control video playback when current video or play state changes
  React.useEffect(() => {
    videos.forEach((video, index) => {
      const player = videoPlayers.current[video.id];
      if (player) {
        if (index === currentVideoIndex && isPlaying) {
          player.play();
        } else {
          player.pause();
        }
      }
    });
  }, [currentVideoIndex, isPlaying, videos]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const currentIndex = viewableItems[0].index;
      setCurrentVideoIndex(currentIndex);
      
      // Pause all videos except the current one
      videos.forEach((video, index) => {
        const player = videoPlayers.current[video.id];
        if (player) {
          if (index === currentIndex && isPlaying) {
            player.play();
          } else {
            player.pause();
          }
        }
      });
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const VideoItem = ({ item, index }: { item: VideoType; index: number }) => {
    const isCurrentVideo = index === currentVideoIndex;
    const player = useVideoPlayer(item.video_url, (player) => {
      player.loop = true;
      player.muted = false;
    });
    
    // Store player reference for external control
    videoPlayers.current[item.id] = player;
    
    // Control playback based on current video and play state
    React.useEffect(() => {
      if (isCurrentVideo && isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }, [isCurrentVideo, isPlaying, player]);
    
    return (
      <View style={[styles.slideBase, { width: videoWidth, height: targetHeight || videoHeight }]}>
        {/* Video Player */}
        <VideoView
          style={{ width: videoWidth, height: targetHeight || videoHeight }}
          player={player}
          nativeControls={false}
        />

        {/* Overlay Content */}
        <View style={styles.overlayBottomContainer}>
          {/* Right Side Actions */}
          <View style={[
            styles.actionsColumn, 
            { 
              bottom: isLandscape ? 16 : 32 + insets.bottom, 
              right: isLandscape ? 16 : 16,
              zIndex: 3 
            }
          ]}>
            <TouchableOpacity
              onPress={() => handleLike(item.id)}
              style={styles.center}
            >
              <View style={styles.actionCircle}>
                <Ionicons name="heart" size={32} color="white" />
              </View>
              <Text style={styles.actionLabel}>
                {item.likes_count.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.center} onPress={() => { /* Placeholder comment action */ }}>
              <View style={styles.actionCircle}>
                <Ionicons name="chatbubble" size={32} color="white" />
              </View>
              <Text style={styles.actionLabel}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.center}>
              <View style={styles.actionCircle}>
                <Ionicons name="share" size={32} color="white" />
              </View>
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Content */}
          <View style={[
            styles.bottomContent, 
            { 
              paddingBottom: isLandscape ? 20 : 40 + insets.bottom, 
              paddingRight: isLandscape ? 120 : 80, // More space for actions in landscape
              zIndex: 3 
            }
          ]}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: item.user?.avatar_url || 'https://picsum.photos/100/100' }}
                style={styles.userAvatar}
              />
              <Text style={styles.username}>
                @{item.user?.username}
              </Text>
            </View>
            
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={styles.metricsRow}>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>
                  Score: {item.score}
                </Text>
              </View>
              <Text style={styles.views}>
                {item.views_count.toLocaleString()} views
              </Text>
            </View>
          </View>
        </View>

        {/* Play/Pause Overlay */}
        <TouchableOpacity
          onPress={handleVideoPress}
          style={[styles.absoluteFill, styles.center, { backgroundColor: isPlaying ? 'transparent' : 'rgba(0,0,0,0.3)', zIndex: 1 }]}
        >
          {!isPlaying && (
            <View style={styles.playOverlayButton}>
              <Ionicons name="play" size={48} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <View style={[styles.screen, styles.center, styles.emptyState]}>
        <View style={styles.emptyStateContent}>
          <Ionicons name="videocam-outline" size={80} color="#6b7280" />
          <Text style={styles.emptyStateTitle}>No Videos Yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Be the first to upload a dance video and start the competition!
          </Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => router.push('/(tabs)/upload')}
          >
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>Upload Your First Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => <VideoItem item={item} index={index} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={targetHeight || videoHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({ length: (targetHeight || videoHeight), offset: (targetHeight || videoHeight) * index, index })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  center: { justifyContent: 'center', alignItems: 'center' },
  slideBase: { position: 'relative' },
  overlayBottomContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, justifyContent: 'flex-end' },
  actionsColumn: { position: 'absolute', alignItems: 'center', gap: 16 },
  actionCircle: { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 999, padding: 12, marginBottom: 4 },
  actionLabel: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  bottomContent: { padding: 16 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  // Empty State Styles
  emptyState: { backgroundColor: '#111827' },
  emptyStateContent: { alignItems: 'center', paddingHorizontal: 32 },
  emptyStateTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginTop: 16, marginBottom: 8 },
  emptyStateSubtitle: { fontSize: 16, color: '#9ca3af', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  uploadButton: { 
    backgroundColor: '#a855f7', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 25,
    gap: 8
  },
  uploadButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  title: { color: '#ffffff', fontSize: 16, marginBottom: 8 },
  description: { color: '#D1D5DB', fontSize: 13, marginBottom: 8 },
  metricsRow: { flexDirection: 'row', alignItems: 'center' },
  scorePill: { backgroundColor: '#9333EA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 12 },
  scorePillText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  views: { color: '#9CA3AF', fontSize: 12 },
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  center: { justifyContent: 'center', alignItems: 'center' },
  playOverlayButton: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, padding: 20 },
  loadingText: { color: '#ffffff', fontSize: 16 },
});
