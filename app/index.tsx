// Index.tsx (Main component)
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { useState, useRef, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import SettingsPanel from "./components/SettingsPanel";
import AboutScreen from "./components/AboutScreen";
import WeatherCard from "./components/Weather";
import WeatherStats from "./components/WeatherStats";
import { fetchWeather } from "./fetchWeather";
import "./globals.css";

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number | null;
  feelsLike: number;
  pressure: number;
  visibility: number;
}

export default function Index() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showHome, setShowHome] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState("London"); // Default city
  
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

  // Load weather data when app starts
  useEffect(() => {
    loadWeatherData(currentCity);
  }, []);

  const loadWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCurrentCity(city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Handle search functionality
  const handleSearch = (city: string) => {
    if (city.trim()) {
      loadWeatherData(city.trim());
    }
  };

  const renderContent = () => (
    <View className="flex-1">
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
            <TouchableOpacity 
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm"
              onPress={() => {
                // You can implement a search modal here or make this a TextInput
                // For now, let's add some quick city options
                const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
                const randomCity = cities[Math.floor(Math.random() * cities.length)];
                handleSearch(randomCity);
              }}
            >
              <Text className="text-gray-400 text-base">
                {weatherData ? `${weatherData.city}` : 'Search location...'}
              </Text>
            </TouchableOpacity>
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
        <WeatherCard 
          onGenerate={handleGenerate}
          weatherData={weatherData}
          loading={loading}
          error={error}
        />
        <WeatherStats weatherData={weatherData} loading={loading} />
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