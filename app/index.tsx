// Index.tsx (Main component)
import { useContext, useEffect, useState } from "react";
import { ImageBackground, LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import { fetchWeather } from "../lib/fetchWeather";
import AboutScreen from "./components/AboutScreen";
import HomeScreen from "./components/HomeScreen";
import SettingsPanel from "./components/SettingsPanel";
import WeatherCard from "./components/WeatherCard";
import WeatherStats from "./components/WeatherStats";
import { ThemeContext } from "./context/ThemeContext";

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
  const { theme } = useContext(ThemeContext);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showHome, setShowHome] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showWeatherStats, setShowWeatherStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState("London");

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

  const handleSearch = (city: string) => {
    if (city.trim()) {
      loadWeatherData(city.trim());
    }
  };

  const toggleWeatherStats = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowWeatherStats(!showWeatherStats);
  };

  const renderContent = () => (
    <View style={{ flex: 1 }}>
      {backgroundIndex !== 0 && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }} />
      )}

      {/* Header */}
      <View style={{ paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 16,
              padding: 12
            }}
            onPress={openSettingsPanel}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500'
            }}>Menu</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12
              }}
              onPress={() => {
                const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
                const randomCity = cities[Math.floor(Math.random() * cities.length)];
                handleSearch(randomCity);
              }}
            >
              <Text style={{
                color: 'rgba(156, 163, 175, 1)',
                fontSize: 16
              }}>
                {weatherData ? `${weatherData.city}` : 'Search location...'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 16,
              padding: 12
            }}
            onPress={openAboutScreen}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500'
            }}>About</Text>
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
        {showWeatherStats && <WeatherStats weatherData={weatherData} loading={loading} />}
      </View>

      <View style={{
        height: 4,
        width: '100%',
        backgroundColor: 'transparent', // linear gradient is not supported this way
      }} />
    </View>
  );

  return (
    <View style={{ flex: 1 }} className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
      {backgroundIndex === 0 ? (
        renderContent()
      ) : (
        <ImageBackground
          source={backgrounds[backgroundIndex]!}
          style={{ flex: 1 }}
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
