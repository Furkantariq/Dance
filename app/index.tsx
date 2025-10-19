import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { session, isLoading } = useAuth();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  useEffect(() => {
    // Only start timer after auth state is loaded
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (session) {
          router.replace('/(tabs)'); // User is logged in, go to main app
        } else {
          router.replace('/auth/login'); // User not logged in, go to login
        }
      }, 3000); // 3 second splash screen
      
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [session, isLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Image source={require('../assets/images/splash-icon.png')} style={styles.logo} />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Dance Battle</Text>
          <Text style={styles.subtitle}>Where dancers compete</Text>
        </View>
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 100,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#9333EA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
});
