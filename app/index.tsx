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
import WeatherStats from "./components/WeatherStats";
import { ThemeContext } from "./context/ThemeContext";
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
  const [backgroundIndex, setBackgroundIndex] = useState(0);
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

  const backgrounds = [
    { uri: 'https://images.unsplash.com/photo-1419833479618-c595710e6711?w=800' },
    { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { uri: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800' },
    { uri: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800' },
    { uri: 'https://images.unsplash.com/photo-1485478525339-6a2d01da9492?w=800' },
    { uri: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800' },
    { uri: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800' },
  ];

  useEffect(() => {
    fetchWeatherByLocation();
  }, [units]);

  const loadWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(city, units);
      setWeatherData(data);
      setCurrentCity(city);
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

          <TouchableOpacity
            className="bg-secondary/50 border border-secondary/70 rounded-lg p-3"
            onPress={() => {
              closeSettingsPanel();
              setTimeout(() => {
                openAboutScreen();
              }, 300);
            }}
          >
            <Text className="text-textPrimary font-mono">About</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24
      }}>
        <WeatherCard
          onGenerate={handleGenerate}
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

      <View style={{
        height: 4,
        width: '100%',
        backgroundColor: 'transparent', // linear gradient is not supported this way
      }} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ImageBackground
        source={backgrounds[backgroundIndex]}
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
