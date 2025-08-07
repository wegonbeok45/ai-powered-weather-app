const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

export async function fetchWeather(city: string, units: 'metric' | 'imperial') {
  if (!API_KEY) {
    throw new Error('API key is missing. Please check your .env file.');
  }
  // Get weather data using city name
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
  );

  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather');
  }

  const weatherData = await weatherRes.json();

  return {
    temp: weatherData.main.temp,
    description: weatherData.weather[0].description,
    city: weatherData.name,
    country: weatherData.sys.country,
    icon: weatherData.weather[0].icon,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    windDirection: weatherData.wind.deg,
    uvIndex: null, // UV index is not available in this endpoint
    feelsLike: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
  };
}

export async function fetchWeatherByCoords(lat: number, lon: number, units: 'metric' | 'imperial') {
  if (!API_KEY) {
    throw new Error('API key is missing. Please check your .env file.');
  }
  // Get weather data using coordinates
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  );

  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather');
  }

  const weatherData = await weatherRes.json();

  return {
    temp: weatherData.main.temp,
    description: weatherData.weather[0].description,
    city: weatherData.name,
    country: weatherData.sys.country,
    icon: weatherData.weather[0].icon,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    windDirection: weatherData.wind.deg,
    uvIndex: null, // UV index is not available in this endpoint
    feelsLike: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
  };
}
