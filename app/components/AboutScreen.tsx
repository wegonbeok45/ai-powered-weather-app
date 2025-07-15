// components/AboutScreen.tsx
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "./Modal";

interface AboutScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AboutScreen({ isVisible, onClose }: AboutScreenProps) {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="bg-primary/80 backdrop-blur-xl border border-secondary/30 rounded-2xl w-11/12 max-w-md p-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-textPrimary font-mono text-xl">About Us</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-accent text-2xl">×</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-textSecondary font-sans mb-4">
          This weather application is built with React Native and Expo, providing real-time weather data from the OpenWeatherMap API.
        </Text>
        <Text className="text-textSecondary font-sans">
          Version: 1.0.0
        </Text>
      </View>
    </Modal>
  );
}