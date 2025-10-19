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
import tw from 'twrnc';

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
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={tw`flex-1 bg-gray-900 px-6 py-12`}>
          {/* Header */}
          <View style={tw`items-center mb-12`}>
            <Text style={tw`text-4xl font-bold text-white mb-2`}>Dance Battle</Text>
            <Text style={tw`text-lg text-gray-400`}>Welcome back!</Text>
          </View>

          {/* Login Form */}
          <View style={tw`gap-6`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-white text-base mb-2 font-medium`}>Email</Text>
              <TextInput
                style={tw`bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base`}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-white text-base mb-2 font-medium`}>Password</Text>
              <TextInput
                style={tw`bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base`}
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
              <View style={tw`bg-red-900/20 border border-red-500/50 rounded-xl p-4`}>
                <Text style={tw`text-red-400 text-center`}>
                  {error.message || 'Login failed. Please try again.'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={tw`bg-purple-600 py-4 rounded-xl ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={tw`mt-8 items-center`}>
            <Text style={tw`text-gray-400 mb-4`}>Don't have an account?</Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity style={tw`bg-transparent border border-purple-600 py-3 px-8 rounded-xl`}>
                <Text style={tw`text-purple-400 text-center font-semibold`}>
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
