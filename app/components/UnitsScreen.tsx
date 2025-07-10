// components/UnitsScreen.tsx
import { useContext, useEffect, useRef } from "react";
import { Animated, Easing, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

interface UnitsScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function UnitsScreen({ isVisible, onClose }: UnitsScreenProps) {
  const unitsSlideAnim = useRef(new Animated.Value(600)).current;
  const { units, toggleUnits } = useContext(ThemeContext);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(unitsSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      Animated.timing(unitsSlideAnim, {
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
              transform: [{ translateY: unitsSlideAnim }],
            }}
            className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-black/20 rounded-3xl p-8 w-full max-w-md"
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-20 h-20 rounded-3xl mb-4 items-center justify-center">
                <Text className="text-white text-3xl">🌡️</Text>
              </View>
              <Text className="text-white dark:text-black text-2xl font-bold mb-2">Units</Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm text-center">Select your preferred units</Text>
            </View>

            {/* Units Content */}
            <View className="space-y-6">
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row justify-between items-center">
                <Text className="text-white dark:text-black text-lg font-semibold">Use Imperial Units (ºF)</Text>
                <Switch
                  value={units === 'imperial'}
                  onValueChange={toggleUnits}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={units === 'imperial' ? '#f4f3f4' : '#f4f3f4'}
                />
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