// AI Weather Chatbot Service
import { fetchWeather } from './fetchWeather';

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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotResponse {
  message: string;
  isLoading: boolean;
  error?: string;
}

// Function to detect and extract location mentions from user messages
function extractLocationFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Common patterns for asking about other locations
  const locationPatterns = [
    /(?:weather in|weather at|how is|how's|what's.*weather.*in|what about|tell me about.*weather.*in)\s+([a-zA-Z\s,]+?)(?:\?|$|,|\s+weather|\s+like|\s+today|\s+now)/i,
    /(?:in|at)\s+([a-zA-Z\s,]+?)(?:\s+weather|\s+today|\s+now|\?|$)/i,
    /([a-zA-Z\s,]+?)(?:\s+weather|\s+temperature|\s+climate)(?:\?|$)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const location = match[1].trim();
      // Filter out common words that aren't locations
      const excludeWords = ['the', 'weather', 'today', 'now', 'like', 'there', 'here', 'it', 'this', 'that', 'good', 'bad', 'nice', 'hot', 'cold'];
      if (!excludeWords.includes(location.toLowerCase()) && location.length > 2) {
        return location;
      }
    }
  }
  
  return null;
}

// Function to fetch weather data for a mentioned location
async function fetchWeatherForLocation(location: string): Promise<WeatherData | null> {
  try {
    const weatherData = await fetchWeather(location, 'metric');
    return {
      temp: weatherData.temp,
      description: weatherData.description,
      city: weatherData.city,
      country: weatherData.country,
      humidity: weatherData.humidity,
      windSpeed: weatherData.windSpeed,
      windDirection: weatherData.windDirection,
      feelsLike: weatherData.feelsLike,
      pressure: weatherData.pressure,
      visibility: weatherData.visibility,
    };
  } catch (error) {
    console.error('Error fetching weather for location:', location, error);
    return null;
  }
}

// Main chatbot function
export async function askWeatherChatbot(
  userMessage: string,
  weatherData: WeatherData | null,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Check if user is asking about a different location
    const mentionedLocation = extractLocationFromMessage(userMessage);
    let contextWeatherData = weatherData;
    
    if (mentionedLocation) {
      const locationWeatherData = await fetchWeatherForLocation(mentionedLocation);
      if (locationWeatherData) {
        contextWeatherData = locationWeatherData;
      }
    }

    // First try OpenAI GPT for intelligent responses
    const aiResponse = await getOpenAIChatResponse(userMessage, contextWeatherData, conversationHistory, mentionedLocation);
    if (aiResponse) {
      return aiResponse;
    }

    // Fallback to rule-based responses
    return getSmartFallbackResponse(userMessage, contextWeatherData, mentionedLocation);

  } catch (error) {
    console.error('Chatbot error:', error);
    return getSmartFallbackResponse(userMessage, weatherData);
  }
}

// OpenAI GPT-powered chatbot responses
async function getOpenAIChatResponse(
  userMessage: string,
  weatherData: WeatherData | null,
  conversationHistory: ChatMessage[],
  mentionedLocation?: string | null
): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    return null;
  }

  try {
    // Build conversation context
    const weatherContext = weatherData ? 
      `Current weather in ${weatherData.city}, ${weatherData.country}:
- Temperature: ${weatherData.temp}°C (feels like ${weatherData.feelsLike}°C)
- Conditions: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind: ${weatherData.windSpeed} m/s
- Visibility: ${(weatherData.visibility/1000).toFixed(1)} km` : 
      "No current weather data available.";

    // Build conversation history for context
    const recentHistory = conversationHistory.slice(-6); // Last 3 exchanges
    const historyContext = recentHistory.length > 0 ? 
      `Recent conversation:\n${recentHistory.map(msg => 
        `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`
      ).join('\n')}\n\n` : '';

    const systemPrompt = `You are a professional and engaging virtual weather assistant with deep expertise in meteorology, climate science, and atmospheric patterns. Your role is to provide accurate, practical, and thoughtful weather insights in a friendly, conversational tone.

You have access to real-time weather data and can answer questions about weather in ANY location worldwide. When users ask about different countries, cities, or regions, you should provide specific weather information for those locations.

Your core capabilities include:
- Answering questions about current weather conditions anywhere in the world
- Providing weather forecasts and predictions for different locations
- Offering practical advice based on weather conditions (clothing, activities, travel)
- Explaining weather phenomena and atmospheric science concepts
- Discussing climate patterns, seasonal trends, and weather history
- Comparing weather between different locations
- Providing location-specific weather insights and recommendations

Key responsibilities:
- Answer everyday weather questions like: "Should I bring an umbrella?", "Will it rain tomorrow?", "What's the forecast this weekend?"
- Handle location-specific queries like: "What's the weather like in Paris?", "How's the climate in Japan?", "Tell me about Morocco's weather"
- Use provided weather context when available, and supplement with meteorological knowledge
- Offer both short- and long-term weather insights based on patterns and data
- Explain weather phenomena (storms, fog, cold fronts, etc.) in accessible language
- Discuss seasonal trends, climate anomalies, and unusual weather events
- Share historical weather context when relevant
- Ask engaging follow-up questions to create meaningful conversations
- Use emojis and casual language appropriately while maintaining professionalism
- Engage in thoughtful weather discussions and "what if" scenarios

Tone & Personality:
- Friendly, professional, and genuinely curious about weather
- Enthusiastic about meteorology and climate topics
- Conversational yet reliable and informative
- Helpful and practical in advice-giving
- Engaging and interactive in discussions

Current weather context:
${weatherContext}

${mentionedLocation ? `The user is asking about weather in: ${mentionedLocation}. The weather data provided above is for this location.` : ''}

Always respond helpfully by combining meteorological expertise, real-time weather data, and thoughtful human-like conversation. When users ask about different locations, acknowledge the specific place they're asking about and provide relevant, location-specific information.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${historyContext}User question: ${userMessage}` }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
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
    console.error('OpenAI chatbot error:', error);
  }

  return null;
}

// Smart fallback responses for when OpenAI is unavailable
function getSmartFallbackResponse(userMessage: string, weatherData: WeatherData | null, mentionedLocation?: string | null): string {
  const message = userMessage.toLowerCase().trim();
  
  if (!weatherData) {
    if (mentionedLocation) {
      return `I'd love to help you with weather information for ${mentionedLocation}! Unfortunately, I couldn't fetch the current weather data for that location. Please try searching for it in the main app, or ask me about a different location. 🌤️`;
    }
    return "I'd love to help with weather questions! Please search for a location first so I can give you specific advice. 🌤️";
  }

  // If user asked about a different location and we have data for it
  if (mentionedLocation && weatherData.city.toLowerCase() !== mentionedLocation.toLowerCase()) {
    return `Great question about ${mentionedLocation}! I found weather data for ${weatherData.city}, ${weatherData.country}. Right now it's ${weatherData.temp}°C with ${weatherData.description.toLowerCase()}. ${getLocationSpecificAdvice(weatherData)} What would you like to know about the weather there? 🌍`;
  }

  // Tomorrow/future questions - be more open and conversational
  if (message.includes('tomorrow') || message.includes('tmrw') || message.includes('future') || message.includes('next week') || message.includes('next month') || message.includes('next year')) {
    return getOpenMindedFutureResponse(message, weatherData);
  }

  // What to wear questions
  if (message.includes('wear') || message.includes('clothes') || message.includes('dress')) {
    return getClothingAdvice(weatherData);
  }

  // Umbrella questions
  if (message.includes('umbrella') || message.includes('rain')) {
    const needsUmbrella = weatherData.description.toLowerCase().includes('rain') || 
                         weatherData.description.toLowerCase().includes('drizzle') ||
                         weatherData.description.toLowerCase().includes('shower');
    return needsUmbrella ? 
      `Yes, definitely bring an umbrella! It's ${weatherData.description.toLowerCase()} in ${weatherData.city} right now. ☔` :
      `No umbrella needed right now! The weather is ${weatherData.description.toLowerCase()} in ${weatherData.city}. ☀️`;
  }

  // Activity questions
  if (message.includes('outside') || message.includes('outdoor') || message.includes('activity')) {
    return getActivityAdvice(weatherData);
  }

  // Temperature questions
  if (message.includes('hot') || message.includes('cold') || message.includes('temperature')) {
    return getTemperatureAdvice(weatherData);
  }

  // General weather questions - be more engaging and curious
  if (message.includes('weather') || message.includes('how') || message.includes('what') || message.includes('think') || message.includes('opinion')) {
    return getEngagingWeatherResponse(message, weatherData);
  }

  // Default friendly response - more conversational
  return `Hey! I love talking about weather! 🌤️ Right now in ${weatherData.city}, we've got ${weatherData.description.toLowerCase()} at ${weatherData.temp}°C. What's on your mind about the weather? I'm curious about your thoughts! What do you think about these conditions? 😊`;
}

// Helper functions for specific advice
function getClothingAdvice(weatherData: WeatherData): string {
  const temp = weatherData.temp;
  const desc = weatherData.description.toLowerCase();
  
  if (temp < 0) {
    return `Bundle up! At ${temp}°C with ${desc}, you'll want heavy winter clothes, coat, gloves, and warm boots. 🧥❄️`;
  } else if (temp < 10) {
    return `Dress warmly! At ${temp}°C with ${desc}, wear a jacket or coat with layers underneath. 🧥`;
  } else if (temp < 20) {
    return `Light layers work well! At ${temp}°C with ${desc}, try a sweater or light jacket you can remove if needed. 👕`;
  } else if (temp < 25) {
    return `Perfect weather for comfortable clothes! At ${temp}°C with ${desc}, a t-shirt and light pants should be great. 👕`;
  } else {
    return `Stay cool! At ${temp}°C with ${desc}, light, breathable clothing and don't forget sunscreen! ☀️👕`;
  }
}

function getActivityAdvice(weatherData: WeatherData): string {
  const temp = weatherData.temp;
  const desc = weatherData.description.toLowerCase();
  
  if (desc.includes('rain') || desc.includes('storm')) {
    return `Indoor activities might be better today with ${desc} in ${weatherData.city}. Great time for museums, shopping, or cozy indoor plans! 🏠`;
  } else if (temp > 15 && temp < 28) {
    return `Perfect weather for outdoor activities! At ${temp}°C with ${desc}, it's great for walks, sports, or outdoor dining. 🌞`;
  } else if (temp < 5) {
    return `Bundle up if going outside! At ${temp}°C, outdoor activities are possible but dress very warmly. ❄️`;
  } else {
    return `The weather is ${desc} at ${temp}°C - outdoor activities are definitely possible with the right preparation! 🌤️`;
  }
}

function getTemperatureAdvice(weatherData: WeatherData): string {
  const temp = weatherData.temp;
  const feelsLike = weatherData.feelsLike;
  
  if (temp < 0) {
    return `It's quite cold at ${temp}°C (feels like ${feelsLike}°C) in ${weatherData.city}. Stay warm and limit time outdoors! ❄️`;
  } else if (temp < 10) {
    return `It's chilly at ${temp}°C (feels like ${feelsLike}°C) in ${weatherData.city}. A good day for warm drinks and cozy clothes! ☕`;
  } else if (temp < 25) {
    return `Nice temperature at ${temp}°C (feels like ${feelsLike}°C) in ${weatherData.city}. Very comfortable for most activities! 😊`;
  } else {
    return `It's warm at ${temp}°C (feels like ${feelsLike}°C) in ${weatherData.city}. Stay hydrated and seek shade when possible! ☀️`;
  }
}

function getGeneralAdvice(weatherData: WeatherData): string {
  const desc = weatherData.description.toLowerCase();
  const humidity = weatherData.humidity;
  
  if (desc.includes('clear') || desc.includes('sunny')) {
    return "Perfect day to enjoy the sunshine!";
  } else if (desc.includes('cloud')) {
    return "Nice overcast day, great for outdoor activities without harsh sun.";
  } else if (desc.includes('rain')) {
    return "Don't forget your umbrella if you're heading out!";
  } else if (humidity > 80) {
    return "It's quite humid, so you might feel warmer than the actual temperature.";
  } else {
    return "Have a great day!";
  }
}

function getOpenMindedFutureResponse(message: string, weatherData: WeatherData): string {
  const temp = weatherData.temp;
  const desc = weatherData.description.toLowerCase();
  const season = getCurrentSeason();
  const city = weatherData.city;
  
  // Determine the time frame they're asking about
  if (message.includes('tomorrow') || message.includes('tmrw')) {
    return `Interesting question about tomorrow in ${city}! 🤔 Looking at today's ${desc} at ${temp}°C, I'm thinking tomorrow could go a few ways. Weather patterns here suggest ${getTomorrowPrediction(desc, temp, season)}. What's your gut feeling about it? Do you sense any changes coming? 🌤️`;
  }
  
  if (message.includes('next week')) {
    return `Ooh, next week is fascinating to think about! 📅 Based on current ${desc} conditions and typical ${season} patterns in ${city}, I'm imagining we might see ${getWeeklyPrediction(season, temp)}. Weather can be so unpredictable though - what do you think will happen? Any weather intuition? 🌦️`;
  }
  
  if (message.includes('next month')) {
    return `Next month is exciting to speculate about! 🗓️ We're in ${season} now, so I'm thinking ${getMonthlyPrediction(season, city)} could be on the horizon. Climate patterns suggest ${getSeasonalTrend(season)}. What's your prediction? Do you feel any seasonal shifts coming? 🍂❄️🌸☀️`;
  }
  
  if (message.includes('next year')) {
    return `Wow, next year! That's some long-term thinking! 🌍 Climate-wise, I'm curious about how ${city} will evolve. With current global patterns, we might see ${getYearlyPrediction(city, season)}. It's fascinating how weather cycles work over years! What do you think - will next year be warmer, cooler, or more unpredictable? I love pondering these big weather questions! 🌡️📊`;
  }
  
  // General future question
  return `That's such a thoughtful question about the future! 🔮 Weather is endlessly fascinating to predict. Based on what I see in ${city} right now (${desc}, ${temp}°C), I'm thinking ${getGeneralFuturePrediction(desc, temp, season)}. But honestly, weather surprises us all the time! What's your take on where the weather is heading? Do you notice any patterns? 🌈`;
}

function getTomorrowPrediction(desc: string, temp: number, season: string): string {
  if (desc.includes('clear')) return "we might get another beautiful clear day, though atmospheric pressure could shift things";
  if (desc.includes('cloud')) return "clouds might persist or break up - depends on the pressure systems moving through";
  if (desc.includes('rain')) return "the rain could continue or clear up - weather fronts are always shifting";
  return "conditions could evolve in interesting ways - weather is so dynamic!";
}

function getWeeklyPrediction(season: string, temp: number): string {
  const predictions = [
    "some interesting temperature swings as pressure systems move through",
    "typical seasonal patterns with maybe a surprise or two",
    "the usual dance between high and low pressure systems",
    "some fascinating atmospheric changes - weather never stays the same!"
  ];
  return predictions[Math.floor(Math.random() * predictions.length)];
}

function getMonthlyPrediction(season: string, city: string): string {
  if (season === 'winter') return "deeper winter patterns, maybe some interesting cold snaps or warm spells";
  if (season === 'spring') return "beautiful spring transitions with warming trends and fresh growth energy";
  if (season === 'summer') return "peak summer vibes with heat waves and maybe some dramatic thunderstorms";
  return "autumn's gorgeous color-changing weather with crisp, dynamic conditions";
}

function getSeasonalTrend(season: string): string {
  const trends = [
    "natural seasonal progression with some delightful surprises",
    "the usual seasonal rhythm with nature's beautiful timing",
    "interesting climate patterns that make each season unique",
    "the wonderful unpredictability that makes weather so fascinating"
  ];
  return trends[Math.floor(Math.random() * trends.length)];
}

function getYearlyPrediction(city: string, season: string): string {
  const predictions = [
    "more extreme weather events as climate patterns evolve",
    "interesting seasonal shifts and maybe some record-breaking moments",
    "the ongoing dance between traditional patterns and climate change",
    "fascinating new weather phenomena as our atmosphere continues changing"
  ];
  return predictions[Math.floor(Math.random() * predictions.length)];
}

function getGeneralFuturePrediction(desc: string, temp: number, season: string): string {
  return "weather will keep doing what it does best - surprising us with its complexity and beauty";
}

function getEngagingWeatherResponse(message: string, weatherData: WeatherData): string {
  const temp = weatherData.temp;
  const desc = weatherData.description.toLowerCase();
  const city = weatherData.city;
  
  // Check if they're asking for opinions or thoughts
  if (message.includes('think') || message.includes('opinion')) {
    const thoughts = [
      `Honestly, I think this ${desc} weather in ${city} is pretty fascinating! At ${temp}°C, it's got that ${getWeatherPersonality(desc, temp)} vibe. What's your take on it?`,
      `You know what I think about this ${desc} at ${temp}°C? It's got character! ${getWeatherMood(desc)} What do you think - does this weather match your mood today?`,
      `My thoughts on ${city}'s ${desc} weather? It's telling a story! ${getWeatherStory(desc, temp)} What story do you think this weather is telling?`,
      `I find this ${desc} weather really interesting! ${getWeatherPhilosophy(desc, temp)} What's your philosophy on weather like this?`
    ];
    return thoughts[Math.floor(Math.random() * thoughts.length)] + " 🤔💭";
  }
  
  // General engaging responses
  const responses = [
    `Right now in ${city}, we've got ${desc} at ${temp}°C - and I'm genuinely curious what you think about it! ${getWeatherQuestion(desc)} 🌤️`,
    `This ${desc} weather in ${city} (${temp}°C) has me thinking... ${getWeatherWonder(desc, temp)} What's your weather intuition telling you? 🤨`,
    `${city}'s showing us ${desc} at ${temp}°C today! ${getWeatherExcitement(desc)} What catches your attention about this weather? 🌈`,
    `I love how ${city} is giving us ${desc} weather at ${temp}°C! ${getWeatherAppreciation(desc, temp)} What do you appreciate about conditions like this? ✨`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function getWeatherPersonality(desc: string, temp: number): string {
  if (desc.includes('clear')) return "confident and bright";
  if (desc.includes('cloud')) return "mysterious and contemplative";
  if (desc.includes('rain')) return "dramatic and refreshing";
  if (desc.includes('snow')) return "magical and serene";
  return "unique and intriguing";
}

function getWeatherMood(desc: string): string {
  if (desc.includes('clear')) return "It feels optimistic and energizing!";
  if (desc.includes('cloud')) return "There's something cozy and introspective about it.";
  if (desc.includes('rain')) return "It's got that cleansing, renewal energy.";
  return "It has its own special atmosphere!";
}

function getWeatherStory(desc: string, temp: number): string {
  if (desc.includes('clear')) return "It's like nature is showing off, putting on a perfect display!";
  if (desc.includes('cloud')) return "The clouds are painting abstract art across the sky.";
  if (desc.includes('rain')) return "It's nature's way of washing the world clean and fresh.";
  return "Every weather pattern has its own narrative unfolding.";
}

function getWeatherPhilosophy(desc: string, temp: number): string {
  const philosophies = [
    "I believe every weather pattern teaches us something about change and adaptation.",
    "Weather reminds us that beauty comes in so many different forms.",
    "There's something profound about how weather connects us all to the same atmosphere.",
    "Weather is like nature's mood ring - always shifting, always expressing something new."
  ];
  return philosophies[Math.floor(Math.random() * philosophies.length)];
}

function getWeatherQuestion(desc: string): string {
  if (desc.includes('clear')) return "Do you feel that energy boost that clear skies bring?";
  if (desc.includes('cloud')) return "Do you find cloudy weather peaceful or gloomy?";
  if (desc.includes('rain')) return "Are you a rain lover or do you prefer sunshine?";
  return "How does this weather make you feel?";
}

function getWeatherWonder(desc: string, temp: number): string {
  const wonders = [
    "isn't it amazing how weather can completely change our day's energy?",
    "I wonder what atmospheric forces are dancing together to create this!",
    "it's fascinating how weather patterns travel across continents to reach us.",
    "weather is like nature's daily surprise - never quite the same twice!"
  ];
  return wonders[Math.floor(Math.random() * wonders.length)];
}

function getWeatherExcitement(desc: string): string {
  if (desc.includes('clear')) return "Those clear skies are absolutely gorgeous!";
  if (desc.includes('cloud')) return "I love how clouds create such dynamic skyscapes!";
  if (desc.includes('rain')) return "Rain has such a refreshing, life-giving energy!";
  return "Every type of weather has its own special beauty!";
}

function getWeatherAppreciation(desc: string, temp: number): string {
  const appreciations = [
    "There's something wonderful about experiencing all of nature's moods.",
    "Weather keeps life interesting - imagine if it was the same every day!",
    "Each weather pattern brings its own gifts and lessons.",
    "Weather connects us to the bigger rhythms of our planet."
  ];
  return appreciations[Math.floor(Math.random() * appreciations.length)];
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

// Helper function for location-specific advice
function getLocationSpecificAdvice(weatherData: WeatherData): string {
  const temp = weatherData.temp;
  const desc = weatherData.description.toLowerCase();
  
  if (desc.includes('rain')) {
    return "You might want to bring an umbrella if you're planning to visit!";
  } else if (temp < 10) {
    return "It's quite chilly there, so pack some warm clothes!";
  } else if (temp > 25) {
    return "It's nice and warm there - perfect weather to enjoy!";
  } else {
    return "The weather looks quite pleasant there!";
  }
}

// Generate a unique ID for chat messages
export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}