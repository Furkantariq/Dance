import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useVideos } from '../../hooks/useVideos';

export default function UploadScreen() {
  const { createVideo, isLoading } = useVideos() as any;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1 });
    if (res.canceled) return;
    const asset = res.assets[0];
    try {
      const thumb = await VideoThumbnails.getThumbnailAsync(asset.uri, { time: 1000 });
      setThumbnailUrl(thumb.uri);
      // Upload file to storage
      setUploading(true);
      setProgress(0);
      // For now, just use the local URI as the video URL
      // In a real app, you'd upload to Supabase storage
      setVideoUrl(asset.uri);
      setProgress(100);
      Alert.alert('Video Selected', 'Video selected successfully. You can submit it now.');
    } catch (err: any) {
      Alert.alert('Pick/Upload Failed', err?.message || 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !videoUrl) {
      Alert.alert('Missing info', 'Title and Video URL are required.');
      return;
    }
    try {
      await createVideo({ title, description, videoUrl, thumbnailUrl });
      Alert.alert('Success', 'Video submitted! It will appear in the feed.');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
    } catch (err: any) {
      Alert.alert('Upload Failed', err?.message || 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Submit External Video</Text>
          <Text style={styles.subtitle}>Paste a public MP4 URL (as required by task).</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} placeholder="Amazing Hip Hop" placeholderTextColor="#9CA3AF" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Short description" placeholderTextColor="#9CA3AF" value={description} onChangeText={setDescription} />
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryButton} onPress={pickVideo} disabled={uploading}>
              <Text style={styles.secondaryButtonText}>{uploading ? 'Uploading...' : 'Pick from Gallery'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.helper}>Or paste a direct MP4 URL:</Text>
            <TextInput style={styles.input} placeholder="https://.../video.mp4" placeholderTextColor="#9CA3AF" value={videoUrl} onChangeText={setVideoUrl} autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thumbnail URL (optional)</Text>
            <TextInput style={styles.input} placeholder="https://.../thumb.jpg" placeholderTextColor="#9CA3AF" value={thumbnailUrl} onChangeText={setThumbnailUrl} autoCapitalize="none" autoCorrect={false} />
          </View>

          <TouchableOpacity style={[styles.button, (isLoading || uploading) && styles.buttonDisabled]} onPress={handleSubmit} disabled={isLoading || uploading}>
            <Text style={styles.buttonText}>{isLoading ? 'Submitting...' : 'Submit Video'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', padding: 16 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#9CA3AF', marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  helper: { color: '#9CA3AF', marginBottom: 6 },
  label: { color: '#ffffff', marginBottom: 6 },
  input: { backgroundColor: '#1F2937', color: '#ffffff', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#374151' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  secondaryButton: { backgroundColor: '#374151', paddingVertical: 12, borderRadius: 12, alignItems: 'center', flex: 1 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '600' },
  button: { backgroundColor: '#9333EA', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
});


