import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardEntry } from '../../lib/supabase';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Ionicons name="trophy" size={24} color="#FFD700" />;
    case 2:
      return <Ionicons name="medal" size={24} color="#C0C0C0" />;
    case 3:
      return <Ionicons name="medal" size={24} color="#CD7F32" />;
    default:
      return (
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{rank}</Text>
        </View>
      );
  }
};

const getCardStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return { backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.5)' };
    case 2:
      return { backgroundColor: 'rgba(156, 163, 175, 0.15)', borderColor: 'rgba(156, 163, 175, 0.5)' };
    case 3:
      return { backgroundColor: 'rgba(234, 88, 12, 0.15)', borderColor: 'rgba(234, 88, 12, 0.5)' };
    default:
      return { backgroundColor: 'rgba(31, 41, 55, 0.6)', borderColor: 'rgba(55, 65, 81, 0.6)' };
  }
};

export default function LeaderboardScreen() {
  const { leaderboard, isLoading, error } = useLeaderboard();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would refetch data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    return (
      <TouchableOpacity
        style={[styles.card, getCardStyle(item.rank)]}
        activeOpacity={0.7}
      >
        <View style={styles.rowCenter}>
          {/* Rank */}
          <View style={styles.rankIcon}>{getRankIcon(item.rank)}</View>

          {/* User Avatar */}
          <Image
            source={{ uri: item.user.avatar_url || 'https://picsum.photos/100/100' }}
            style={styles.avatar}
          />

          {/* User Info */}
          <View style={styles.flex1}>
            <Text style={styles.name}>{item.user.full_name}</Text>
            <Text style={styles.username}>@{item.user.username}</Text>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {item.video.title}
            </Text>
          </View>

          {/* Score */}
          <View style={styles.alignEnd}>
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
            </View>
            <View style={styles.likesRow}>
              <Ionicons name="heart" size={16} color="#ef4444" />
              <Text style={styles.likesText}>
                {item.video.likes_count.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
      <Text style={styles.headerSubtitle}>Top performers in the dance competition</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorScreen}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorTitle}>Error Loading Leaderboard</Text>
        <Text style={styles.errorSubtitle}>Please check your connection and try again</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#a855f7"
            colors={['#a855f7']}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111827',
  },
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankIcon: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  flex1: { flex: 1 },
  name: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
  },
  username: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  videoTitle: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 4,
  },
  alignEnd: { alignItems: 'flex-end' },
  scorePill: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  scoreText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  likesRow: { flexDirection: 'row', alignItems: 'center' },
  likesText: { color: '#9CA3AF', fontSize: 12, marginLeft: 4 },
  errorScreen: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  errorSubtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  rankBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#4B5563',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
