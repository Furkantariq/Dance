import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  error,
  className = '',
}) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-white text-base mb-2 font-medium">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-gray-800 text-white px-4 py-4 rounded-xl border ${
          error ? 'border-red-500' : 'border-gray-700'
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
      {error && (
        <Text className="text-red-400 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};






