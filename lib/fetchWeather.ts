// utils/fetchWeather.ts
const API_KEY = 'b98c785f67dc6717cd38b6e888045398';

export async function fetchWeather(city: string) {
  // Get current weather data
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather');
  }

  const weatherData = await weatherRes.json();
  
  // Get UV index using coordinates from the weather data
  const uvRes = await fetch(
    `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
  );
  
  let uvIndex = null;
  if (uvRes.ok) {
    const uvData = await uvRes.json();
    uvIndex = uvData.value;
  }

  return {
    temp: weatherData.main.temp,
    description: weatherData.weather[0].description,
    city: weatherData.name,
    icon: weatherData.weather[0].icon,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    windDirection: weatherData.wind.deg,
    uvIndex: uvIndex,
    feelsLike: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
  };
}