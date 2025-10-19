import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import '../../global.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await signIn({ email, password });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err?.message || 'Invalid email or password');
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-900 px-6 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-4xl font-bold text-white mb-2">Dance Battle</Text>
            <Text className="text-lg text-gray-400">Welcome back!</Text>
          </View>

          {/* Login Form */}
          <View className="gap-6">
            <View className="mb-4">
              <Text className="text-white text-base mb-2 font-medium">Email</Text>
              <TextInput
                className="bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-4">
              <Text className="text-white text-base mb-2 font-medium">Password</Text>
              <TextInput
                className="bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {error && (
              <View className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                <Text className="text-red-400 text-center">
                  {error.message || 'Login failed. Please try again.'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              className={`bg-purple-600 py-4 rounded-xl ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-gray-400 mb-4">Don't have an account?</Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity className="bg-transparent border border-purple-600 py-3 px-8 rounded-xl">
                <Text className="text-purple-400 text-center font-semibold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
