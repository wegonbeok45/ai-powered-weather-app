# AI-Powered Weather App

A modern React Native weather application with AI-powered features including intelligent weather descriptions and a conversational chatbot.

## Features

🌤️ **Real-time Weather Data** - Current weather conditions for any location worldwide
🖼️ **Dynamic Backgrounds** - Location-based background images using Unsplash API
🤖 **AI Weather Chatbot** - Conversational AI assistant for weather-related questions
📝 **Smart Descriptions** - AI-generated weather insights and recommendations
🎨 **Modern UI** - Clean, responsive design with smooth animations

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/wegonbeok45/ai-powered-weather-app.git
cd ai-powered-weather-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:
```
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Get API Keys

#### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env` file

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up and create an API key
3. Add it to your `.env` file

### 5. Run the Application
```bash
npm start
```

## Usage

1. **Search Locations**: Use the search bar to find weather for any city
2. **View Weather**: See current conditions, temperature, and details
3. **Chat with AI**: Ask the weather assistant questions like:
   - "What should I wear today?"
   - "Should I bring an umbrella?"
   - "What do you think about tomorrow?"
   - "Is it good for outdoor activities?"

## Technologies Used

- **React Native** with Expo
- **TypeScript** for type safety
- **OpenAI GPT-3.5-turbo** for AI features
- **OpenWeatherMap API** for weather data
- **Unsplash API** for dynamic backgrounds
- **NativeWind/Tailwind CSS** for styling

## Project Structure

```
├── app/
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   ├── aiWeatherDescription.ts    # AI weather descriptions
│   ├── weatherChatbot.ts          # AI chatbot service
│   ├── fetchLocationImage.ts      # Dynamic background images
│   ├── fetchWeather.ts            # Weather API integration
│   └── index.tsx                  # Main app component
├── assets/                 # Static assets
└── .env                   # Environment variables (not in repo)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
