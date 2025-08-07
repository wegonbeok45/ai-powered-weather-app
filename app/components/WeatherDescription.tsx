// WeatherDescription.tsx - Component to display AI-generated weather descriptions
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

interface WeatherDescriptionProps {
  description: string;
  loading: boolean;
  onRefresh?: () => void;
}

export default function WeatherDescription({ description, loading, onRefresh }: WeatherDescriptionProps) {
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <View className="bg-secondary/30 border border-secondary/50 rounded-2xl p-4 mx-6 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-textPrimary font-semibold text-lg">Weather Insights</Text>
          <View className="bg-primary/20 px-2 py-1 rounded-full">
            <Text className="text-primary text-xs font-medium">AI Generated</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-center py-8">
          <View className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
          <Text className="text-textSecondary text-sm">Generating weather insights...</Text>
        </View>
      </View>
    );
  }

  if (!description) {
    return null;
  }

  return (
    <View className="bg-secondary/30 border border-secondary/50 rounded-2xl p-4 mx-6 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-textPrimary font-semibold text-lg">Weather Insights</Text>
        <View className="flex-row items-center">
          <View className="bg-primary/20 px-2 py-1 rounded-full mr-2">
            <Text className="text-primary text-xs font-medium">AI Generated</Text>
          </View>
          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              className="bg-secondary/50 p-2 rounded-full"
            >
              <Text className="text-textPrimary text-xs">🔄</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView
        className="max-h-32"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <Text className="text-textPrimary text-sm leading-6 font-sans opacity-90">
          {description}
        </Text>
      </ScrollView>
      
      {/* Subtle fade indicator for scrollable content */}
      <View
        className="absolute bottom-4 left-4 right-4 h-2 bg-secondary/10 rounded-full opacity-30"
      />
    </View>
  );
}