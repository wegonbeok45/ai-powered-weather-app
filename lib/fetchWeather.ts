// utils/fetchWeather.ts
const API_KEY = 'b98c785f67dc6717cd38b6e888045398';

export async function fetchWeather(city: string, units: 'metric' | 'imperial') {
  // Get coordinates for the city
  const geoRes = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
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