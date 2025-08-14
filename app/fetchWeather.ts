import { readFileSync } from 'fs';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

function getPrompt() {
  try {
    const prompt = readFileSync('./prompt.txt', 'utf-8');
    return prompt;
  } catch (err) {
    throw new Error('Failed to read prompt.txt');
  }
}

export async function fetchWeather(city: string, units: 'metric' | 'imperial') {
  if (!API_KEY) {
    throw new Error('API key is missing. Please check your .env file.');
  }

  const prompt = getPrompt(); // fetch prompt from file

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
    uvIndex: null,
    feelsLike: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
    prompt, // include the prompt from the file
  };
}

export async function fetchWeatherByCoords(lat: number, lon: number, units: 'metric' | 'imperial') {
  if (!API_KEY) {
    throw new Error('API key is missing. Please check your .env file.');
  }

  const prompt = getPrompt();

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
    uvIndex: null,
    feelsLike: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
    prompt,
  };
}
