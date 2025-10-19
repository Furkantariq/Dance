import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import '../../global.css';
import tw from 'twrnc';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600';
      case 'secondary':
        return 'bg-gray-600';
      case 'outline':
        return 'bg-transparent border border-purple-600';
      default:
        return 'bg-purple-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2';
      case 'md':
        return 'px-6 py-3';
      case 'lg':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return 'text-purple-400';
      default:
        return 'text-white';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      style={tw`${getVariantClasses()} ${getSizeClasses()} rounded-xl items-center justify-center ${
        (disabled || loading) ? 'opacity-50' : ''
      } ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={tw`${getTextColor()} ${getTextSize()} font-semibold`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};








