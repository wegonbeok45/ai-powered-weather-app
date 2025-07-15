// components/SettingsPanel.tsx
import { useContext } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import Modal from "./Modal";

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onMenuSelect: (option: string) => void;
}

export default function SettingsPanel({ isVisible, onClose, onMenuSelect }: SettingsPanelProps) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const menuOptions = [
    { icon: '👤', title: 'Account', subtitle: 'Profile & personal info' },
    { icon: '📍', title: 'Locations', subtitle: 'Manage saved locations' },
    { icon: '🔔', title: 'Notifications', subtitle: 'Alert preferences' },
    { icon: '🌡️', title: 'Units', subtitle: 'Temperature & measurement units' },
    { icon: '🎨', title: 'Themes', subtitle: 'Customize appearance' },
    { icon: '⚙️', title: 'Settings', subtitle: 'App preferences & configuration' },
    { icon: 'ℹ️', title: 'About Us', subtitle: 'Learn more about our app' },
    { icon: '📞', title: 'Support', subtitle: 'Help & contact us' },
  ];

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="bg-primary/80 backdrop-blur-xl border border-secondary/30 rounded-2xl w-11/12 max-w-md max-h-[85vh] p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-textPrimary text-2xl font-bold font-mono">Menu</Text>
            <Text className="text-accent text-sm font-sans">Choose an option below</Text>
          </View>
          <TouchableOpacity
            className="bg-secondary/50 rounded-full w-10 h-10 items-center justify-center active:scale-95"
            onPress={onClose}
          >
            <Text className="text-textPrimary text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <ScrollView className="flex-1 -mx-6 px-6">
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center p-4 rounded-lg active:bg-secondary/50"
              onPress={() => onMenuSelect(option.title)}
            >
              <Text className="text-2xl mr-4">{option.icon}</Text>
              <View className="flex-1">
                <Text className="text-textPrimary text-base font-semibold font-sans">{option.title}</Text>
                <Text className="text-accent text-sm font-sans">{option.subtitle}</Text>
              </View>
              <Text className="text-accent text-lg">›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Theme Toggle */}
        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-secondary/50">
          <Text className="text-textPrimary text-base font-semibold font-sans">Dark Mode</Text>
          <Switch
            value={theme.name === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={theme.name === 'dark' ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        {/* Footer */}
        <View className="mt-4 pt-4 border-t border-secondary/50">
          <Text className="text-accent text-xs text-center font-mono">Weather App v1.0.0</Text>
        </View>
      </View>
    </Modal>
  );
}