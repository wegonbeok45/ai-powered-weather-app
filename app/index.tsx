import { Text, View, TouchableOpacity, ImageBackground, Animated, Easing } from "react-native";
import { useState, useRef } from "react";
import "./globals.css";

export default function Index() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showHome, setShowHome] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const slideAnim = useRef(new Animated.Value(-600)).current;
  const settingsSlideAnim = useRef(new Animated.Value(-400)).current;
  const aboutSlideAnim = useRef(new Animated.Value(600)).current;

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

  const openHomeScreen = () => {
    setShowHome(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeHomeScreen = () => {
    Animated.timing(slideAnim, {
      toValue: -600,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setShowHome(false);
    });
  };

  const openSettingsPanel = () => {
    setShowSettings(true);
    Animated.timing(settingsSlideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const closeSettingsPanel = () => {
    Animated.timing(settingsSlideAnim, {
      toValue: -400,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      setShowSettings(false);
    });
  };

  const openAboutScreen = () => {
    setShowAbout(true);
    Animated.timing(aboutSlideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeAboutScreen = () => {
    Animated.timing(aboutSlideAnim, {
      toValue: 600,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setShowAbout(false);
    });
  };

  const handleMenuOption = (option) => {
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
      <View className="absolute top-20 right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></View>
      <View className="absolute top-40 left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></View>
      <View className="absolute bottom-32 right-8 w-28 h-28 bg-cyan-500/20 rounded-full blur-xl"></View>

      {backgroundIndex !== 0 && (
        <View className="absolute inset-0 bg-black/40"></View>
      )}

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

      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 backdrop-blur-xl w-full max-w-sm">
          <View className="items-center">
            <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-16 h-16 rounded-2xl mb-6 items-center justify-center">
              <Text className="text-white text-2xl">⚡</Text>
            </View>
            <Text className="text-white text-8xl font-thin tracking-tighter">--°</Text>
            <Text className="text-gray-400 text-lg mt-2">Awaiting Location</Text>
            <View className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6 mb-4"></View>
            <Text className="text-gray-500 text-sm">Ready to generate forecast</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full w-24 h-24 shadow-2xl active:scale-95 mb-8 items-center justify-center"
          onPress={handleGenerate}
        >
          <Text className="text-white text-2xl">✨</Text>
        </TouchableOpacity>

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
      </View>

      <View className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500"></View>
    </View>
  );

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

      {/* Settings Panel */}
      {showSettings && (
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
                onPress={closeSettingsPanel}
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
                  onPress={() => handleMenuOption(option.title)}
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
      )}

      {/* About Us Screen */}
      {showAbout && (
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
              onPress={closeAboutScreen}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text className="text-gray-500 text-xs text-center mt-4">Version 1.0.0</Text>
          </View>
        </Animated.View>
      )}

      {/* Original Home Screen */}
      {showHome && (
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
              onPress={closeHomeScreen}
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}