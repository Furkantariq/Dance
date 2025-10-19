import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import '../global.css';
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
    <View className="flex-1 bg-gray-900">
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View 
          className="bg-gray-800 rounded-full p-6 mb-8 shadow-lg"
          style={{ 
            transform: [{ scale: pulseAnim }],
            shadowColor: '#9333EA',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Image 
            source={require('../assets/images/splash-icon.png')} 
            className="w-30 h-30"
            style={{ resizeMode: 'contain' }}
          />
        </Animated.View>
        
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-white mb-2 text-center">Dance Battle</Text>
          <Text className="text-lg text-gray-400 text-center">Where dancers compete</Text>
        </View>
        
        {isLoading && (
          <View className="bg-gray-800 rounded-xl px-6 py-3">
            <Text className="text-base text-white font-medium">Loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
}
