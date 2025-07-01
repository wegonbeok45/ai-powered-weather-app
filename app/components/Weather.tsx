// components/WeatherCard.tsx
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  icon: string;
}

interface WeatherCardProps {
  onGenerate: () => void;
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export default function WeatherCard({ onGenerate, weatherData, loading, error }: WeatherCardProps) {
  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°C`;
  };

  const capitalizeDescription = (description: string) => {
    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  return (
    <View className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm mb-8 w-full max-w-sm">
      {loading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white/70 mt-4 text-base">Loading weather...</Text>
        </View>
      ) : error ? (
        <View className="items-center py-8">
          <Text className="text-red-400 text-base text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-white/20 rounded-xl px-4 py-2"
            onPress={() => window.location.reload()}
          >
            <Text className="text-white text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : weatherData ? (
        <View className="items-center">
          {/* Weather Icon - you can replace this with actual weather icons */}
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
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
          <Text className="text-white text-6xl font-light mb-2">
            {formatTemperature(weatherData.temp)}
          </Text>
          
          {/* Description */}
          <Text className="text-white/80 text-xl mb-4 text-center">
            {capitalizeDescription(weatherData.description)}
          </Text>
          
          {/* City */}
          <Text className="text-white/60 text-base mb-6">
            {weatherData.city}
          </Text>
          
          {/* Generate Button */}
          <TouchableOpacity
            className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl px-8 py-4 active:scale-95"
            onPress={onGenerate}
          >
            <Text className="text-white font-semibold text-base">Change Background</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center py-8">
          <Text className="text-white/70 text-base">No weather data available</Text>
        </View>
      )}
    </View>
  );
}