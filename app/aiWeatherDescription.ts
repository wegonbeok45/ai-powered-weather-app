// AI Weather Description Service using OpenAI GPT
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  country: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  feelsLike: number;
  pressure: number;
  visibility: number;
}

interface WeatherDescription {
  description: string;
  isLoading: boolean;
  error?: string;
}

// Function to generate weather descriptions using OpenAI GPT
export async function generateWeatherDescription(weatherData: WeatherData): Promise<string> {
  try {
    // First, try using OpenAI GPT for high-quality AI descriptions
    const aiDescription = await generateWeatherDescriptionWithOpenAI(weatherData, OPENAI_API_KEY);
    if (aiDescription && aiDescription !== generateIntelligentDescription(weatherData)) {
      return aiDescription;
    }

    // Fallback to intelligent template-based descriptions
    return generateIntelligentDescription(weatherData);

  } catch (error) {
    console.error('Error generating weather description:', error);
    return generateIntelligentDescription(weatherData);
  }
}

// Enhanced function using OpenAI GPT for premium AI descriptions
export async function generateWeatherDescriptionWithOpenAI(weatherData: WeatherData, apiKey?: string): Promise<string> {
  if (!apiKey || !OPENAI_API_KEY) {
    return generateIntelligentDescription(weatherData);
  }

  try {
    const prompt = `Write a vivid, engaging paragraph describing the current weather conditions in ${weatherData.city}, ${weatherData.country}.

Current conditions:
- Temperature: ${weatherData.temp}°C (feels like ${weatherData.feelsLike}°C)
- Weather: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind: ${weatherData.windSpeed} m/s
- Visibility: ${(weatherData.visibility/1000).toFixed(1)} km

Write this as if you're a local weather reporter giving a colorful, descriptive update. Make it engaging and paint a picture of what it's like to be there right now. Keep it to 2-3 sentences and make it conversational and informative.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional weather reporter who creates engaging, descriptive weather updates. Keep responses concise but vivid, around 2-3 sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.choices && result.choices[0] && result.choices[0].message) {
        return result.choices[0].message.content.trim();
      }
    } else {
      console.error('OpenAI API error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
  }

  return generateIntelligentDescription(weatherData);
}

// Intelligent template-based descriptions as fallback
function generateIntelligentDescription(weatherData: WeatherData): string {
  const { temp, description, city, country, humidity, windSpeed, feelsLike, visibility } = weatherData;
  
  // Determine temperature feeling
  const tempFeeling = getTempFeeling(temp);
  const humidityFeeling = getHumidityFeeling(humidity);
  const windFeeling = getWindFeeling(windSpeed);
  const visibilityFeeling = getVisibilityFeeling(visibility);
  
  // Create contextual descriptions based on weather conditions
  const weatherContext = getWeatherContext(description.toLowerCase());
  
  // Generate time-aware descriptions
  const timeContext = getTimeContext();
  
  // Combine all elements into a natural description
  const descriptions = [
    `${timeContext} in ${city}, ${country}, the weather presents ${weatherContext.main}. `,
    `With temperatures at ${temp}°C (feeling like ${feelsLike}°C), it's ${tempFeeling}. `,
    `The air ${humidityFeeling} with ${humidity}% humidity, while ${windFeeling} at ${windSpeed} m/s. `,
    `${visibilityFeeling} with ${(visibility/1000).toFixed(1)} km visibility, ${weatherContext.advice}`
  ];
  
  return descriptions.join('').trim();
}

// Helper functions for intelligent descriptions
function getTempFeeling(temp: number): string {
  if (temp < 0) return "quite cold and you'll want to bundle up";
  if (temp < 10) return "chilly and a jacket would be wise";
  if (temp < 20) return "pleasantly cool and comfortable";
  if (temp < 25) return "warm and pleasant";
  if (temp < 30) return "quite warm and summery";
  return "hot and you'll want to stay hydrated";
}

function getHumidityFeeling(humidity: number): string {
  if (humidity < 30) return "feels dry and crisp";
  if (humidity < 60) return "feels comfortable";
  if (humidity < 80) return "feels a bit humid";
  return "feels quite muggy and sticky";
}

function getWindFeeling(windSpeed: number): string {
  if (windSpeed < 2) return "the air is calm and still";
  if (windSpeed < 5) return "there's a gentle breeze";
  if (windSpeed < 10) return "a moderate breeze is blowing";
  if (windSpeed < 15) return "it's quite breezy";
  return "strong winds are present";
}

function getVisibilityFeeling(visibility: number): string {
  const visKm = visibility / 1000;
  if (visKm < 1) return "Visibility is quite poor";
  if (visKm < 5) return "Visibility is limited";
  if (visKm < 10) return "Visibility is moderate";
  return "Visibility is excellent";
}

function getWeatherContext(description: string): { main: string; advice: string } {
  if (description.includes('clear')) {
    return {
      main: "beautifully clear skies with abundant sunshine",
      advice: "making it perfect for outdoor activities and enjoying the day."
    };
  }
  if (description.includes('cloud')) {
    return {
      main: "a cloudy atmosphere with overcast skies",
      advice: "creating a soft, diffused light throughout the area."
    };
  }
  if (description.includes('rain')) {
    return {
      main: "active rainfall creating a fresh, wet environment",
      advice: "so an umbrella would be essential for any outdoor plans."
    };
  }
  if (description.includes('snow')) {
    return {
      main: "snowy conditions blanketing the landscape",
      advice: "creating a winter wonderland but requiring warm clothing."
    };
  }
  if (description.includes('mist') || description.includes('fog')) {
    return {
      main: "misty conditions creating an atmospheric, ethereal environment",
      advice: "adding a mysterious quality to the surroundings."
    };
  }
  if (description.includes('thunder') || description.includes('storm')) {
    return {
      main: "dramatic stormy weather with electrical activity",
      advice: "so it's best to stay indoors and enjoy the natural spectacle safely."
    };
  }
  
  return {
    main: `${description} conditions dominating the local weather`,
    advice: "creating the current atmospheric conditions you're experiencing."
  };
}

function getTimeContext(): string {
  const hour = new Date().getHours();
  
  if (hour < 6) return "In the early morning hours";
  if (hour < 12) return "This morning";
  if (hour < 17) return "This afternoon";
  if (hour < 21) return "This evening";
  return "Tonight";
}
