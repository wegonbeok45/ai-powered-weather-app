// components/WeatherStats.tsx
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Weather Details</Text>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statBlock, index === stats.length - 1 && { marginBottom: 0 }]}>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
              </View>
            </View>
            {index < stats.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statBlock: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 2,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  statSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 12,
  },
});