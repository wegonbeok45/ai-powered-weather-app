// utils/fetchWeather.ts
const API_KEY = 'b98c785f67dc6717cd38b6e888045398';

export async function fetchWeather(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch weather');
  }

  const data = await res.json();
  return {
    temp: data.main.temp,
    description: data.weather[0].description,
    city: data.name,
    icon: data.weather[0].icon,
  };
}
