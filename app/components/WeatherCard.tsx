// components/WeatherCard.tsx
import { Text, View, TouchableOpacity } from "react-native";

interface WeatherCardProps {
  onGenerate: () => void;
}

export default function WeatherCard({ onGenerate }: WeatherCardProps) {
  return (
    <>
      <View className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 backdrop-blur-xl w-full max-w-sm">
        <View className="items-center">
          <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-16 h-16 rounded-2xl mb-6 items-center justify-center">
            <Text className="text-white text-2xl">⚡</Text>
          </View>
          <Text className="text-white text-8xl font-thin tracking-tighter">--°</Text>
          <Text className="text-gray-400 text-lg mt-2">Awaiting Location</Text>
          <View className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6 mb-4"></View>
          <Text className="text-gray-500 text-sm">Ready to generate forecast</Text>
        </View>
      </View>

      <TouchableOpacity 
        className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full w-24 h-24 shadow-2xl active:scale-95 mb-8 items-center justify-center"
        onPress={onGenerate}
      >
        <Text className="text-white text-2xl">✨</Text>
      </TouchableOpacity>
    </>
  );
}