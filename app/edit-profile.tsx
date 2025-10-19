import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd update the user profile in Supabase
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: user?.avatar_url || 'https://picsum.photos/150/150?random=user' }}
              style={styles.profilePicture}
            />
            <TouchableOpacity style={styles.editPictureButton}>
              <Ionicons name="camera" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changePictureButton}>
            <Text style={styles.changePictureText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#9CA3AF"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{bio.length}/200</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ''}
              editable={false}
            />
            <Text style={styles.helpText}>Email cannot be changed</Text>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="key" size={20} color="#a855f7" />
              <Text style={styles.accountItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="shield-checkmark" size={20} color="#a855f7" />
              <Text style={styles.accountItemText}>Privacy Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="notifications" size={20} color="#a855f7" />
              <Text style={styles.accountItemText}>Notification Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1F2937',
    marginBottom: 16,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#374151',
  },
  editPictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#9333EA',
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#111827',
  },
  changePictureButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9333EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changePictureText: {
    color: '#9333EA',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  disabledInput: {
    opacity: 0.6,
  },
  characterCount: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  helpText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  accountSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  accountItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountItemText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
});
