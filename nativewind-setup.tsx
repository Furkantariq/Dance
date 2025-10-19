import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import '../global.css';

export default function App() {
  return (
    <View className="flex-1 bg-gray-900 items-center justify-center">
      <Text className="text-white text-2xl font-bold">Dance Battle</Text>
      <StatusBar style="auto" />
    </View>
  );
}
