// components/WeatherStats.tsx
import { Text, View } from 'react-native';

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
}

export default function WeatherStats({ weatherData, loading }: WeatherStatsProps) {
  if (loading || !weatherData) {
    return null;
  }

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };

  const getUVLevel = (uv: number | null) => {
    if (uv === null) return 'Unknown';
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
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
      title: 'UV Index',
      value: weatherData.uvIndex !== null ? weatherData.uvIndex.toFixed(1) : 'N/A',
      subtitle: weatherData.uvIndex !== null ? getUVLevel(weatherData.uvIndex) : 'Data unavailable',
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
    <View className="w-full max-w-sm">
      <View className="bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 rounded-2xl p-6 backdrop-blur-sm">
        <Text className="text-white dark:text-black text-lg font-semibold mb-4">Weather Details</Text>
        
        {stats.map((stat, index) => (
          <View key={index} className="mb-4 last:mb-0">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white/60 dark:text-black/60 text-sm mb-1">{stat.title}</Text>
                <Text className="text-white dark:text-black text-base font-medium">{stat.value}</Text>
                <Text className="text-white/40 dark:text-black/40 text-xs mt-1">{stat.subtitle}</Text>
              </View>
            </View>
            {index < stats.length - 1 && (
              <View className="h-px bg-white/10 dark:bg-black/10 mt-4" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}