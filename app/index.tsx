// Index.tsx (Main component)
import * as Location from 'expo-location';
import { useContext, useEffect, useState } from "react";
import { Alert, ImageBackground, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import AboutScreen from "./components/AboutScreen";
import HomeScreen from "./components/HomeScreen";
import Modal from './components/Modal';
import SettingsPanel from "./components/SettingsPanel";
import SupportScreen from "./components/SupportScreen";
import UnitsScreen from "./components/UnitsScreen";
import WeatherCard from "./components/WeatherCard";
import WeatherChatbot from "./components/WeatherChatbot";
import WeatherStats from "./components/WeatherStats";
import { ThemeContext } from "./context/ThemeContext";
import { fetchLocationImageAdvanced } from "./fetchLocationImage";
import { fetchWeather, fetchWeatherByCoords } from "./fetchWeather";


interface WeatherData {
  temp: number;
  description: string;
  city: string;
  country: string;
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
  const { theme, units } = useContext(ThemeContext);
  const [currentBackground, setCurrentBackground] = useState({ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' });
  const [showHome, setShowHome] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showUnits, setShowUnits] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showWeatherStats, setShowWeatherStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState("London");
  const [searchQuery, setSearchQuery] = useState("");

  const openHomeScreen = () => setShowHome(true);
  const closeHomeScreen = () => setShowHome(false);
  const openSettingsPanel = () => setShowSettings(true);
  const closeSettingsPanel = () => setShowSettings(false);
  const openAboutScreen = () => setShowAbout(true);
  const closeAboutScreen = () => setShowAbout(false);
  const openSupportScreen = () => setShowSupport(true);
  const closeSupportScreen = () => setShowSupport(false);
  const openUnitsScreen = () => setShowUnits(true);
  const closeUnitsScreen = () => setShowUnits(false);

  // Function to update background based on location - now works for ANY city worldwide
  const updateLocationBackground = async (cityName: string) => {
    try {
      const locationImage = await fetchLocationImageAdvanced(cityName);
      setCurrentBackground(locationImage);
    } catch (error) {
      console.error('Error updating background:', error);
      // Keep current background if fetch fails
    }
  };


  useEffect(() => {
    fetchWeatherByLocation();
  }, [units]);

  // Load default location background on app initialization
  useEffect(() => {
    const loadDefaultBackground = async () => {
      try {
        // Load background for the default city (London)
        await updateLocationBackground(currentCity);
      } catch (error) {
        console.error('Error loading default background:', error);
      }
    };
    
    loadDefaultBackground();
  }, []); // Run only once on component mount

  const loadWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(city, units);
      setWeatherData(data);
      setCurrentCity(city);
      // Update background based on the new city
      await updateLocationBackground(city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        Alert.alert('Permission denied', 'Permission to access location was denied');
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const data = await fetchWeatherByCoords(location.coords.latitude, location.coords.longitude, units);
      setWeatherData(data);
      setCurrentCity(data.city);
      // Update background based on the detected location
      await updateLocationBackground(data.city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleMenuOption = (option: string) => {
    console.log(`${option} selected`);
    if (option === 'About Us') {
      closeSettingsPanel();
      setTimeout(() => {
        openAboutScreen();
      }, 300);
    } else if (option === 'Support') {
      closeSettingsPanel();
      setTimeout(() => {
        openSupportScreen();
      }, 300);
    } else if (option === 'Units') {
      closeSettingsPanel();
      setTimeout(() => {
        openUnitsScreen();
      }, 300);
    } else {
      closeSettingsPanel();
    }
  };

  const handleSearch = (city: string) => {
    if (city.trim()) {
      loadWeatherData(city.trim());
    }
  };

  const toggleWeatherStats = () => {
    setShowWeatherStats(!showWeatherStats);
  };

  const renderContent = () => (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>

      {/* Header */}
      <View className="pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-secondary/50 border border-secondary/70 rounded-lg p-3"
            onPress={openSettingsPanel}
          >
            <Text className="text-textPrimary text-xl">☰</Text>
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <View className="flex-row items-center bg-secondary/50 border border-secondary/70 rounded-lg">
              <TextInput
                className="flex-1 text-textPrimary font-sans px-4 py-3"
                placeholder="Search location..."
                placeholderTextColor="#778DA9"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch(searchQuery)}
                returnKeyType="search"
                onKeyPress={(e) => {
                  if (e.nativeEvent.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                autoCorrect={true}
              />
              <TouchableOpacity
                className="p-3"
                onPress={() => handleSearch(searchQuery)}
              >
                <Text className="text-textPrimary font-mono">Search</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>

      {/* Main content */}
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20
      }}>
        <WeatherCard
          onGenerate={() => {}} // Empty function since button is removed
          weatherData={weatherData}
          loading={loading}
          error={error}
          onToggleStats={toggleWeatherStats}
          statsVisible={showWeatherStats}
        />
        
        <Modal isVisible={showWeatherStats} onClose={toggleWeatherStats}>
          <WeatherStats weatherData={weatherData} loading={loading} onClose={toggleWeatherStats} />
        </Modal>
      </View>

      {/* Chatbot at the bottom */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 }}>
        <WeatherChatbot
          weatherData={weatherData}
          isVisible={true}
          onClose={() => {}}
          embedded={true}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ImageBackground
        source={currentBackground}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {renderContent()}
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
        <SupportScreen
          isVisible={showSupport}
          onClose={closeSupportScreen}
        />
        <UnitsScreen
          isVisible={showUnits}
          onClose={closeUnitsScreen}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
