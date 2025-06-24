// components/SettingsPanel.tsx
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { useRef, useEffect } from "react";

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onMenuSelect: (option: string) => void;
}

export default function SettingsPanel({ isVisible, onClose, onMenuSelect }: SettingsPanelProps) {
  const settingsSlideAnim = useRef(new Animated.Value(-400)).current;

  const menuOptions = [
    { icon: '⚙️', title: 'Settings', subtitle: 'App preferences & configuration' },
    { icon: '👤', title: 'Account', subtitle: 'Profile & personal info' },
    { icon: 'ℹ️', title: 'About Us', subtitle: 'Learn more about our app' },
    { icon: '🌡️', title: 'Units', subtitle: 'Temperature & measurement units' },
    { icon: '📍', title: 'Locations', subtitle: 'Manage saved locations' },
    { icon: '🔔', title: 'Notifications', subtitle: 'Alert preferences' },
    { icon: '🎨', title: 'Themes', subtitle: 'Customize appearance' },
    { icon: '📞', title: 'Support', subtitle: 'Help & contact us' },
  ];

  useEffect(() => {
    if (isVisible) {
      Animated.timing(settingsSlideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      Animated.timing(settingsSlideAnim, {
        toValue: -400,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/60 justify-center items-center">
      <Animated.View
        style={{
          transform: [{ translateX: settingsSlideAnim }],
        }}
        className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl w-11/12 max-w-md max-h-4/5 p-6"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">Menu</Text>
            <Text className="text-gray-400 text-sm">Choose an option below</Text>
          </View>
          <TouchableOpacity
            className="bg-white/10 rounded-full w-10 h-10 items-center justify-center active:scale-95"
            onPress={onClose}
          >
            <Text className="text-white text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View className="flex-1">
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3 active:scale-98 active:bg-white/10"
              onPress={() => onMenuSelect(option.title)}
            >
              <View className="flex-row items-center">
                <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Text className="text-white text-lg">{option.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold">{option.title}</Text>
                  <Text className="text-gray-400 text-sm">{option.subtitle}</Text>
                </View>
                <Text className="text-gray-500 text-lg">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View className="mt-4 pt-4 border-t border-white/10">
          <Text className="text-gray-500 text-xs text-center">Weather App v1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
}