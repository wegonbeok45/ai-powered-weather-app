// components/WeatherCard.tsx
import { ActivityIndicator, Text, TouchableOpacity, UIManager, View } from 'react-native';

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

interface WeatherCardProps {
  onGenerate: () => void;
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  onToggleStats: () => void;
  statsVisible: boolean;
}

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WeatherCard({ onGenerate, weatherData, loading, error, onToggleStats, statsVisible }: WeatherCardProps) {
  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°C`;
  };

  const capitalizeDescription = (description: string) => {
    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  return (
    <View className="bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-3xl p-6 backdrop-blur-sm mb-8 w-full max-w-xs">
      {loading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white/70 dark:text-black/70 mt-4 text-base">Loading weather...</Text>
        </View>
      ) : error ? (
        <View className="items-center py-8">
          <Text className="text-red-400 dark:text-red-500 text-base text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-white/20 rounded-xl px-4 py-2"
            onPress={() => window.location.reload()}
          >
            <Text className="text-white dark:text-black text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : weatherData ? (
        <View className="items-center">
          {/* Weather Icon - you can replace this with actual weather icons */}
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">
              {weatherData.icon.includes('01') ? '☀️' : 
               weatherData.icon.includes('02') ? '⛅' :
               weatherData.icon.includes('03') || weatherData.icon.includes('04') ? '☁️' :
               weatherData.icon.includes('09') || weatherData.icon.includes('10') ? '🌧️' :
               weatherData.icon.includes('11') ? '⛈️' :
               weatherData.icon.includes('13') ? '❄️' :
               weatherData.icon.includes('50') ? '🌫️' : '🌤️'}
            </Text>
          </View>
          
          {/* Temperature */}
          <Text className="text-white dark:text-black text-5xl font-light mb-2">
            {formatTemperature(weatherData.temp)}
          </Text>
          
          {/* Description */}
          <Text className="text-white/80 dark:text-black/80 text-lg mb-4 text-center">
            {capitalizeDescription(weatherData.description)}
          </Text>
          
          {/* Additional Weather Info */}
          <View className="w-full mt-6 space-y-4">
            <TouchableOpacity
              className="bg-white/10 rounded-xl p-3 flex-row justify-between items-center"
              onPress={onToggleStats}
              activeOpacity={0.8}
            >
              <Text className="text-white dark:text-black font-semibold">View Stats</Text>
              <Text className={`text-white dark:text-black text-xl transition-transform duration-300 ${statsVisible ? 'rotate-180' : ''}`}>
                ▼
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl px-6 py-3 active:scale-95 items-center"
              onPress={onGenerate}
            >
              <Text className="text-white dark:text-black font-semibold text-base">Change Background</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="items-center py-8">
          <Text className="text-white/70 dark:text-black/70 text-base">No weather data available</Text>
        </View>
      )}
    </View>
  );
}