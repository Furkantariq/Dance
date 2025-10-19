import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Linking,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProfileStats } from '../../hooks/useProfileStats';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { data: stats, isLoading: statsLoading } = useProfileStats(user?.id);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth/login');
            } catch (error) {
              // If it's just a session missing error, that's fine - user is already signed out
              if ((error as any)?.message?.includes('Auth session missing')) {
                router.replace('/auth/login');
                return;
              }
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Helper function to format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleRateApp = async () => {
    try {
      // For iOS App Store
      const iosUrl = 'https://apps.apple.com/app/id123456789'; // Replace with actual App Store URL
      // For Android Play Store
      const androidUrl = 'https://play.google.com/store/apps/details?id=com.onlyfansderek.Dance';
      
      const url = Platform.OS === 'ios' ? iosUrl : androidUrl;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Rate App', 'Thank you for your support! Please rate us on the App Store or Google Play Store.');
      }
    } catch (error) {
      Alert.alert('Rate App', 'Thank you for your support! Please rate us on the App Store or Google Play Store.');
    }
  };

  const handleShareApp = async () => {
    try {
      const shareOptions = {
        message: 'Check out Dance Battle - the ultimate dance competition app! Show your moves and compete with dancers worldwide. Download now!',
        url: 'https://dancebattle.app', // Replace with actual app URL
        title: 'Dance Battle App',
      };
      
      await Share.share(shareOptions);
    } catch (error) {
      Alert.alert('Share App', 'Thank you for sharing Dance Battle with your friends!');
    }
  };

  const profileStats = [
    { 
      label: 'Videos', 
      value: statsLoading ? '...' : (stats?.videos || 0).toString(), 
      icon: 'videocam' 
    },
    { 
      label: 'Followers', 
      value: statsLoading ? '...' : formatNumber(stats?.followers || 0), 
      icon: 'people' 
    },
    { 
      label: 'Following', 
      value: statsLoading ? '...' : formatNumber(stats?.following || 0), 
      icon: 'person-add' 
    },
    { 
      label: 'Total Score', 
      value: statsLoading ? '...' : formatNumber(stats?.totalScore || 0), 
      icon: 'trophy' 
    },
  ];

  const menuItems = [
    { label: 'Edit Profile', icon: 'create', onPress: () => router.push('/edit-profile') },
    { label: 'My Videos', icon: 'videocam', onPress: () => router.push('/my-videos') },
    { label: 'Settings', icon: 'settings', onPress: () => router.push('/settings') },
    { label: 'Help & Support', icon: 'help-circle', onPress: () => Alert.alert('Help', 'Contact us at support@dancebattle.com') },
  ];

  return (
    <ScrollView style={styles.screen}>
      {/* Header */}
      <View style={styles.headerSurface}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCenter}>
          <Image
            source={{ uri: user?.avatar_url || 'https://picsum.photos/150/150?random=user' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user?.full_name || 'Dance Enthusiast'}
          </Text>
          <Text style={styles.username}>
            @{user?.username || 'dancer123'}
          </Text>
          <Text style={styles.bio}>
            {user?.bio || 'Welcome to the dance battle! Show your moves and compete with dancers worldwide.'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSurface}>
        <View style={styles.statsRow}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIconSurface}>
                <Ionicons name={stat.icon as any} size={20} color="#a855f7" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconSurface}>
              <Ionicons name={item.icon as any} size={20} color="#a855f7" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfoContainer}>
        <View style={styles.appInfoSurface}>
          <Text style={styles.appInfoTitle}>
            Dance Battle App
          </Text>
          <Text style={styles.appInfoSubtitle}>
            Version 1.0.0 - Built with React Native & Expo
          </Text>
          <View style={styles.appInfoActions}>
            <TouchableOpacity style={styles.primaryPill} onPress={handleRateApp}>
              <Text style={styles.primaryPillText}>Rate App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryPill} onPress={handleShareApp}>
              <Text style={styles.secondaryPillText}>Share App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#111827' },
  headerSurface: { backgroundColor: '#1F2937', paddingHorizontal: 16, paddingVertical: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  profileCenter: { alignItems: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 16 },
  name: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  username: { color: '#9CA3AF', fontSize: 16, marginBottom: 12 },
  bio: { color: '#D1D5DB', textAlign: 'center', paddingHorizontal: 16 },
  statsSurface: { backgroundColor: '#1F2937', marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statIconSurface: { backgroundColor: 'rgba(168,85,247,0.2)', borderRadius: 999, padding: 8, marginBottom: 8 },
  statValue: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#9CA3AF', fontSize: 12 },
  menuContainer: { marginTop: 12, paddingHorizontal: 16 },
  menuItem: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  menuIconSurface: { backgroundColor: '#374151', borderRadius: 999, padding: 8, marginRight: 12 },
  menuLabel: { color: '#ffffff', fontSize: 16, flex: 1 },
  appInfoContainer: { marginTop: 24, paddingHorizontal: 16, paddingBottom: 24 },
  appInfoSurface: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, alignItems: 'center' },
  appInfoTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  appInfoSubtitle: { color: '#9CA3AF', textAlign: 'center', marginBottom: 16 },
  appInfoActions: { flexDirection: 'row', gap: 12 },
  primaryPill: { backgroundColor: '#9333EA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginRight: 12 },
  primaryPillText: { color: '#ffffff', fontWeight: '600' },
  secondaryPill: { backgroundColor: '#374151', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  secondaryPillText: { color: '#ffffff', fontWeight: '600' },
});
