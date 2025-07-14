// fetchWeather.ts (moved from lib/fetchWeather.ts)
const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

export async function fetchWeather(city: string, units: 'metric' | 'imperial') {
  // Get coordinates for the city
  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );

  if (!geoRes.ok) {
    throw new Error('Failed to fetch coordinates for the city');
  }

  const geoData = await geoRes.json();
  if (geoData.length === 0) {
    throw new Error('City not found');
  }

  const { lat, lon } = geoData[0];

  // Get weather data using coordinates
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}&units=${units}`
  );

  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather');
  }

  const weatherData = await weatherRes.json();

  return {
    temp: weatherData.current.temp,
    description: weatherData.current.weather[0].description,
    city: geoData[0].name,
    icon: weatherData.current.weather[0].icon,
    humidity: weatherData.current.humidity,
    windSpeed: weatherData.current.wind_speed,
    windDirection: weatherData.current.wind_deg,
    uvIndex: weatherData.current.uvi,
    feelsLike: weatherData.current.feels_like,
    pressure: weatherData.current.pressure,
    visibility: weatherData.current.visibility,
  };
}
