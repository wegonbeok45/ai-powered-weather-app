// Index.tsx (Main component)
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { useState, useRef } from "react";
import HomeScreen from "./components/HomeScreen";
import SettingsPanel from "./components/SettingsPanel";
import AboutScreen from "./components/AboutScreen";
import WeatherCard from "./components/WeatherCard";
import WeatherStats from "./components/WeatherStats";
import "./globals.css";

export default function Index() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showHome, setShowHome] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const openHomeScreen = () => setShowHome(true);
  const closeHomeScreen = () => setShowHome(false);
  const openSettingsPanel = () => setShowSettings(true);
  const closeSettingsPanel = () => setShowSettings(false);
  const openAboutScreen = () => setShowAbout(true);
  const closeAboutScreen = () => setShowAbout(false);

  const backgrounds = [
    null,
    { uri: 'https://images.unsplash.com/photo-1419833479618-c595710e6711?w=800' },
    { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { uri: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800' },
    { uri: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800' },
  ];

  const handleGenerate = () => {
    setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
  };

  const handleMenuOption = (option: string) => {
    console.log(`${option} selected`);
    if (option === 'About Us') {
      closeSettingsPanel();
      setTimeout(() => {
        openAboutScreen();
      }, 300);
    } else {
      closeSettingsPanel();
    }
  };

  const renderContent = () => (
    <View className="flex-1">
      {}
      

      {backgroundIndex !== 0 && (
        <View className="absolute inset-0 bg-black/40"></View>
      )}

      {/* Header */}
      <View className="pt-16 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            className="bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur-sm active:scale-95"
            onPress={openSettingsPanel}
          >
            <Text className="text-white text-sm font-medium">Menu</Text>
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <View className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
              <Text className="text-gray-400 text-base">Search location...</Text>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur-sm active:scale-95"
            onPress={openAboutScreen}
          >
            <Text className="text-white text-sm font-medium">About</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View className="flex-1 justify-center items-center px-6">
        <WeatherCard onGenerate={handleGenerate} />
        <WeatherStats />
      </View>

      <View className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500"></View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      {backgroundIndex === 0 ? (
        renderContent()
      ) : (
        <ImageBackground 
          source={backgrounds[backgroundIndex]}
          className="flex-1"
          resizeMode="cover"
        >
          {renderContent()}
        </ImageBackground>
      )}

      <SettingsPanel 
        isVisible={showSettings}
        onClose={closeSettingsPanel}
        onMenuSelect={handleMenuOption}
      />

      <AboutScreen 
        isVisible={showAbout}
        onClose={closeAboutScreen}
      />

      <HomeScreen 
        isVisible={showHome}
        onClose={closeHomeScreen}
      />
    </View>
  );
}