// components/AboutScreen.tsx
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { useRef, useEffect } from "react";

interface AboutScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AboutScreen({ isVisible, onClose }: AboutScreenProps) {
  const aboutSlideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(aboutSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      Animated.timing(aboutSlideAnim, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: aboutSlideAnim }],
      }}
      className="absolute top-0 left-0 right-0 bottom-0 bg-black/95 justify-center items-center px-6"
    >
      <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-20 h-20 rounded-3xl mb-4 items-center justify-center">
            <Text className="text-white text-3xl">🌤️</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Weather App</Text>
          <Text className="text-gray-400 text-sm text-center">Your personal weather companion</Text>
        </View>

        {/* About Content */}
        <View className="space-y-6">
          <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Text className="text-white text-lg font-semibold mb-2">About This App</Text>
            <Text className="text-gray-300 text-sm leading-relaxed">
              A beautiful and intuitive weather application designed to provide you with accurate forecasts and stunning visuals.
            </Text>
          </View>

          <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Text className="text-white text-lg font-semibold mb-2">Developer</Text>
            <View className="flex-row items-center">
              <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-sm font-bold">TG</Text>
              </View>
              <View>
                <Text className="text-white text-base font-medium">Taher Guenounou</Text>
                <Text className="text-gray-400 text-sm">App Developer</Text>
              </View>
            </View>
          </View>

          <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Text className="text-white text-lg font-semibold mb-2">Features</Text>
            <Text className="text-gray-300 text-sm leading-relaxed">
              • Beautiful weather backgrounds{'\n'}
              • Real-time weather data{'\n'}
              • Intuitive user interface{'\n'}
              • Customizable settings
            </Text>
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          className="mt-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-4 active:scale-95"
          onPress={onClose}
        >
          <Text className="text-white text-center font-semibold">Close</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text className="text-gray-500 text-xs text-center mt-4">Version 1.0.0</Text>
      </View>
    </Animated.View>
  );
}