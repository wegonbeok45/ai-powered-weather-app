// Index.tsx (Main component)
import { Text, View, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import SettingsPanel from "./components/SettingsPanel";
import AboutScreen from "./components/AboutScreen";
import WeatherCard from "./components/Weather";
import WeatherStats from "./components/WeatherStats";
import { fetchWeather } from "./fetchWeather";
import { getCurrentLocation, reverseGeocode, checkLocationPermission } from "./services/LocationServices";
import "./globals.css";

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  icon: string;
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
  const [locationLoading, setLocationLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  
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

  // Check location permission on app start
  useEffect(() => {
    checkLocationPermission().then(setHasLocationPermission);
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

  // Enhanced: Load weather data using coordinates with better error handling
  const loadWeatherByCoords = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get address from coordinates
      const address = await reverseGeocode(latitude, longitude);
      const cityName = address?.city || address?.subregion || address?.region || address?.name;
      
      if (cityName) {
        const data = await fetchWeather(cityName);
        setWeatherData(data);
        setCurrentCity(cityName);
      } else {
        throw new Error('Unable to determine city from location');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced: Get current location weather with better feedback
  const getCurrentLocationWeather = async () => {
    try {
      setLocationLoading(true);
      setError(null);
      
      const coords = await getCurrentLocation();
      await loadWeatherByCoords(coords.latitude, coords.longitude);
      
      // Update permission status
      setHasLocationPermission(true);
    } catch (error) {
      console.error('Location error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown location error';
      
      if (errorMessage.includes('permission')) {
        Alert.alert(
          'Location Permission Required', 
          'To get weather for your current location, please grant location permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: getCurrentLocationWeather }
          ]
        );
      } else {
        Alert.alert(
          'Location Error', 
          'Unable to get your location. Please make sure location services are enabled.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLocationLoading(false);
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
    } else if (option === 'Use My Location') {
      closeSettingsPanel();
      getCurrentLocationWeather();
    } else {
      closeSettingsPanel();
    }
  };

  // Enhanced: Handle search functionality with better city suggestions
  const handleSearch = (city: string) => {
    if (city.trim()) {
      loadWeatherData(city.trim());
    }
  };

  // Enhanced: Better city suggestions based on popular weather locations
  const getRandomCity = () => {
    const cities = [
      'London', 'New York', 'Tokyo', 'Paris', 'Sydney',
      'Berlin', 'Toronto', 'Dubai', 'Singapore', 'Barcelona',
      'Rome', 'Amsterdam', 'Stockholm', 'Copenhagen', 'Vienna'
    ];
    return cities[Math.floor(Math.random() * cities.length)];
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
                const randomCity = getRandomCity();
                handleSearch(randomCity);
              }}
            >
              <Text className="text-gray-400 text-base">
                {weatherData ? `${weatherData.city}` : 'Search location...'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Enhanced: Location button with better visual feedback */}
          <TouchableOpacity 
            className={`border border-white/20 rounded-2xl p-3 backdrop-blur-sm active:scale-95 mr-2 ${
              hasLocationPermission ? 'bg-green-500/20' : 'bg-white/10'
            }`}
            onPress={getCurrentLocationWeather}
            disabled={locationLoading}
          >
            <Text className="text-white text-sm font-medium">
              {locationLoading ? '📍...' : hasLocationPermission ? '📍✓' : '📍'}
            </Text>
          </TouchableOpacity>

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
          loading={loading || locationLoading}
          error={error}
        />
        <WeatherStats weatherData={weatherData} loading={loading || locationLoading} />
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