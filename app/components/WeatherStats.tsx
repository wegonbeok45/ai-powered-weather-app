// components/WeatherStats.tsx
import { Text, TouchableOpacity, View } from 'react-native';

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

interface WeatherStatsProps {
  weatherData: WeatherData | null;
  loading: boolean;
  onClose: () => void;
}

export default function WeatherStats({ weatherData, loading, onClose }: WeatherStatsProps) {
  if (loading || !weatherData) {
    return null;
  }

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };


  // Generate detailed weather stats
  const stats = [
    {
      title: 'Temperature',
      value: `${Math.round(weatherData.temp)}°C`,
      subtitle: `Feels like ${Math.round(weatherData.feelsLike)}°C`,
    },
    {
      title: 'Humidity',
      value: `${weatherData.humidity}%`,
      subtitle: 'Relative humidity',
    },
    {
      title: 'Wind',
      value: `${weatherData.windSpeed} m/s`,
      subtitle: `${getWindDirection(weatherData.windDirection)} direction`,
    },
    {
      title: 'Pressure',
      value: `${weatherData.pressure} hPa`,
      subtitle: 'Atmospheric pressure',
    },
    {
      title: 'Visibility',
      value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
      subtitle: 'Current visibility',
    },
  ];

  return (
    <View className="w-full max-w-md mx-auto bg-primary/80 rounded-2xl p-6 border border-secondary/30">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-textPrimary font-mono text-xl">Weather Details</Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-accent text-2xl">×</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap -m-2">
        {stats.map((stat, index) => (
          <View key={index} className="w-1/2 p-2">
            <View className="bg-secondary/40 rounded-lg p-4 h-full">
              <Text className="text-textSecondary font-sans text-sm">{stat.title}</Text>
              <Text className="text-textPrimary font-mono text-lg my-1">{stat.value}</Text>
              <Text className="text-accent font-sans text-xs">{stat.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}