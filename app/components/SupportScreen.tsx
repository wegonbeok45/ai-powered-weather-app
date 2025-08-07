// components/SupportScreen.tsx
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface SupportScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SupportScreen({ isVisible, onClose }: SupportScreenProps) {
  const supportSlideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(supportSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      Animated.timing(supportSlideAnim, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="absolute inset-0 bg-black/80 justify-center items-center">
        <TouchableWithoutFeedback>
          <Animated.View
            style={{
              transform: [{ translateY: supportSlideAnim }],
            }}
            className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-black/20 rounded-3xl p-8 w-full max-w-md"
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-20 h-20 rounded-3xl mb-4 items-center justify-center">
                <Text className="text-white text-3xl">📞</Text>
              </View>
              <Text className="text-white dark:text-black text-2xl font-bold mb-2">Support</Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm text-center">Contact us for help</Text>
            </View>

            {/* Support Content */}
            <View className="space-y-6">
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Text className="text-white dark:text-black text-lg font-semibold mb-2">Contact Information</Text>
                <Text className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
                  Email: mohamedtaherguenounou@gmail.com{'\n'}
                  Phone: +216 53200087
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              className="mt-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-4 active:scale-95"
              onPress={onClose}
            >
              <Text className="text-white dark:text-black text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}