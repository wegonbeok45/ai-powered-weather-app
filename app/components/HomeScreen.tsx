// components/HomeScreen.tsx
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { useRef, useEffect } from "react";

interface HomeScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function HomeScreen({ isVisible, onClose }: HomeScreenProps) {
  const slideAnim = useRef(new Animated.Value(-600)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -600,
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
        transform: [{ translateY: slideAnim }],
      }}
      className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 justify-center items-center px-6"
    >
      <View className="bg-white/10 p-6 rounded-3xl w-full max-w-md">
        <Text className="text-white text-xl mb-4 font-semibold">Yo, welcome home 👋</Text>
        <Text className="text-gray-400">Here's some cool stuff you can explore.</Text>

        <TouchableOpacity
          className="mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 p-3 rounded-xl active:scale-95"
          onPress={onClose}
        >
          <Text className="text-white text-center">Close</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}