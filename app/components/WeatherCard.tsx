// components/Weather.tsx
import { useContext } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  country: string;
  icon: string;
}

interface WeatherCardProps {
  onGenerate: () => void;
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  onToggleStats: () => void;
  statsVisible: boolean;
  onUseCurrentLocation?: () => void;
  aiDescription?: string;
  descriptionLoading?: boolean;
  onRefreshDescription?: () => Promise<void>;
}

export default function WeatherCard({ onGenerate, weatherData, loading, error, onToggleStats, statsVisible, onUseCurrentLocation, aiDescription, descriptionLoading, onRefreshDescription }: WeatherCardProps) {
  const { units } = useContext(ThemeContext);

  const formatTemperature = (temp: number) => {
    const unitSymbol = units === 'metric' ? '°C' : '°F';
    return `${Math.round(temp)}${unitSymbol}`;
  };

  const capitalizeDescription = (description: string) => {
    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  return (
    <View className="bg-primary/50 border border-secondary/30 rounded-2xl p-8 backdrop-blur-md mb-8 w-full max-w-sm shadow-lg">
      {loading ? (
        <View className="items-center justify-center h-64">
          <ActivityIndicator size="large" color="#778DA9" />
          <Text className="text-accent font-mono mt-4">Loading Weather...</Text>
        </View>
      ) : error ? (
        <View className="items-center justify-center h-64">
          <Text className="text-red-400 text-center mb-4 font-mono">{error}</Text>
          <TouchableOpacity
            className="bg-accent/30 rounded-lg px-4 py-2 border border-accent/50"
            onPress={() => window.location.reload()}
          >
            <Text className="text-textPrimary font-mono">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : weatherData ? (
        <View className="items-center">
          <View className="w-24 h-24 bg-secondary/40 rounded-full items-center justify-center mb-4">
            <Text className="text-5xl">
              {weatherData.icon.includes('01') ? '☀️' :
               weatherData.icon.includes('02') ? '⛅' :
               weatherData.icon.includes('03') || weatherData.icon.includes('04') ? '☁️' :
               weatherData.icon.includes('09') || weatherData.icon.includes('10') ? '🌧️' :
               weatherData.icon.includes('11') ? '⛈️' :
               weatherData.icon.includes('13') ? '❄️' :
               weatherData.icon.includes('50') ? '🌫️' : '🌤️'}
            </Text>
          </View>
          
          <Text className="text-textPrimary text-7xl font-thin font-mono">
            {formatTemperature(weatherData.temp)}
          </Text>
          
          <Text className="text-textSecondary text-2xl font-sans capitalize mb-2">
            {weatherData.description}
          </Text>
          
          <Text className="text-accent text-lg font-mono mb-6">
            {weatherData.city}, {weatherData.country}
          </Text>
          
          <View className="w-full">
            <TouchableOpacity
              className="bg-secondary/50 border border-secondary/70 rounded-lg py-3 w-full items-center"
              onPress={onToggleStats}
            >
              <Text className="text-textPrimary font-mono">{statsVisible ? 'Hide Details' : 'Show Details'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="items-center justify-center h-64">
          <Text className="text-accent font-mono">No weather data available.</Text>
        </View>
      )}
    </View>
  );
}
