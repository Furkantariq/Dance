import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

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
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming Soon', 'Account deletion will be available in a future update.');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    isDestructive = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, isDestructive && styles.destructiveIcon]}>
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={isDestructive ? '#ef4444' : '#a855f7'} 
          />
        </View>
        <View style={styles.settingItemText}>
          <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent || (onPress && (
        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Get notified about new videos and updates"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#374151', true: '#9333EA' }}
                thumbColor="#ffffff"
              />
            }
          />

          <SettingItem
            icon="play"
            title="Auto-play Videos"
            subtitle="Automatically play videos in feed"
            rightComponent={
              <Switch
                value={autoPlayEnabled}
                onValueChange={setAutoPlayEnabled}
                trackColor={{ false: '#374151', true: '#9333EA' }}
                thumbColor="#ffffff"
              />
            }
          />

          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Use dark theme"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#374151', true: '#9333EA' }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            icon="person"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => router.push('/edit-profile')}
          />

          <SettingItem
            icon="key"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon!')}
          />

          <SettingItem
            icon="shield-checkmark"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon!')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon="help-circle"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => Alert.alert('Help', 'Contact us at support@dancebattle.com')}
          />

          <SettingItem
            icon="document-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => Alert.alert('Terms', 'Terms of service will be available soon!')}
          />

          <SettingItem
            icon="lock-closed"
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            onPress={() => Alert.alert('Privacy', 'Privacy policy will be available soon!')}
          />

          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Rate us on the App Store"
            onPress={() => Alert.alert('Rate App', 'Thank you for your support!')}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <SettingItem
            icon="log-out"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleSignOut}
            isDestructive
          />

          <SettingItem
            icon="trash"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            isDestructive
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Dance Battle App</Text>
          <Text style={styles.appVersionText}>Version 1.0.0</Text>
          <Text style={styles.appBuildText}>Built with React Native & Expo</Text>
        </View>
      </ScrollView>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingItem: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  settingItemText: {
    flex: 1,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  destructiveText: {
    color: '#ef4444',
  },
  settingSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  appInfoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  appVersionText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 2,
  },
  appBuildText: {
    color: '#6b7280',
    fontSize: 12,
  },
});
