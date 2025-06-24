// components/WeatherStats.tsx
import { Text, View } from "react-native";

export default function WeatherStats() {
  return (
    <View className="w-full px-2">
      <View className="flex-row justify-between">
        <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 mr-2 backdrop-blur-sm">
          <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">Humidity</Text>
          <Text className="text-white text-2xl font-semibold">--%</Text>
        </View>
        <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 mx-1 backdrop-blur-sm">
          <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">Wind</Text>
          <Text className="text-white text-2xl font-semibold">--</Text>
        </View>
        <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 ml-2 backdrop-blur-sm">
          <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">UV Index</Text>
          <Text className="text-white text-2xl font-semibold">--</Text>
        </View>
      </View>
    </View>
  );
}