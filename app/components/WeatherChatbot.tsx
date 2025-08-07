// WeatherChatbot.tsx - Interactive AI Weather Chatbot Component
import { useContext, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { generateWeatherDescription } from "../aiWeatherDescription";
import { ThemeContext } from "../context/ThemeContext";
import { askWeatherChatbot, generateMessageId } from "../weatherChatbot";

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

interface WeatherChatbotProps {
  weatherData: WeatherData | null;
  isVisible: boolean;
  onClose: () => void;
  embedded?: boolean;
}

export default function WeatherChatbot({ weatherData, isVisible, onClose, embedded = false }: WeatherChatbotProps) {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [initialMessageGenerated, setInitialMessageGenerated] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate initial AI weather description when weather data is available
  useEffect(() => {
    const generateInitialMessage = async () => {
      if (weatherData && !initialMessageGenerated) {
        setIsLoading(true);
        try {
          const description = await generateWeatherDescription(weatherData);
          const initialMessage: ChatMessage = {
            id: generateMessageId(),
            text: description + "\n\nFeel free to ask me anything about the weather! 🌤️",
            isUser: false,
            timestamp: new Date()
          };
          setMessages([initialMessage]);
          setInitialMessageGenerated(true);
        } catch (error) {
          console.error('Error generating initial weather description:', error);
          const fallbackMessage: ChatMessage = {
            id: generateMessageId(),
            text: `Current weather in ${weatherData.city}: ${weatherData.temp}°C, ${weatherData.description}. What would you like to know about the weather? 🌤️`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages([fallbackMessage]);
          setInitialMessageGenerated(true);
        } finally {
          setIsLoading(false);
        }
      } else if (!weatherData && !initialMessageGenerated) {
        // Fallback when no weather data is available
        const fallbackMessage: ChatMessage = {
          id: generateMessageId(),
          text: "Hi! I'm your weather assistant! 🌤️ Search for a location to get started, then ask me anything about the weather!",
          isUser: false,
          timestamp: new Date()
        };
        setMessages([fallbackMessage]);
        setInitialMessageGenerated(true);
      }
    };

    generateInitialMessage();
  }, [weatherData, initialMessageGenerated]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Get AI response
      const response = await askWeatherChatbot(inputText.trim(), weatherData, messages);
      
      const botMessage: ChatMessage = {
        id: generateMessageId(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        text: "Sorry, I'm having trouble right now. Please try again! 😅",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: generateMessageId(),
        text: "Chat cleared! What would you like to know about the weather? 🌤️",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  if (!isVisible) return null;

  if (embedded) {
    return (
      <View className="bg-primary/50 border border-secondary/30 rounded-2xl overflow-hidden">
        {/* Compact Header */}
        <View className="bg-secondary/60 px-4 py-3 flex-row items-center justify-between border-b border-secondary/30">
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">🤖</Text>
            <Text className="text-textPrimary font-semibold text-sm">Weather Assistant</Text>
          </View>
          <TouchableOpacity
            onPress={clearChat}
            className="bg-accent/20 px-2 py-1 rounded-lg"
          >
            <Text className="text-accent text-xs font-medium">Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Compact Messages - Fixed height */}
        <ScrollView
          ref={scrollViewRef}
          className="px-3 py-3 max-h-40"
          showsVerticalScrollIndicator={false}
        >
          {messages.slice(-3).map((message) => (
            <View
              key={message.id}
              className={`mb-2 ${message.isUser ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[85%] px-3 py-2 rounded-xl ${
                  message.isUser
                    ? 'bg-accent/80 rounded-br-md'
                    : 'bg-secondary/60 rounded-bl-md'
                }`}
              >
                <Text
                  className={`text-xs leading-4 ${
                    message.isUser ? 'text-white' : 'text-textPrimary'
                  }`}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
          
          {isLoading && (
            <View className="items-start mb-2">
              <View className="bg-secondary/60 px-3 py-2 rounded-xl rounded-bl-md">
                <Text className="text-textSecondary text-xs">Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Compact Input */}
        <View className="bg-secondary/30 px-3 py-3 border-t border-secondary/30">
          <View className="flex-row items-center bg-primary/50 rounded-xl px-3 py-2 border border-secondary/30">
            <TextInput
              className="flex-1 text-textPrimary font-sans text-sm"
              placeholder="Ask about weather..."
              placeholderTextColor="#778DA9"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`ml-2 px-3 py-1 rounded-lg ${
                inputText.trim() && !isLoading
                  ? 'bg-accent/80'
                  : 'bg-secondary/30'
              }`}
            >
              <Text
                className={`font-medium text-xs ${
                  inputText.trim() && !isLoading
                    ? 'text-white'
                    : 'text-textSecondary'
                }`}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="absolute inset-0 bg-black/90 flex-1"
    >
      <View className="flex-1 bg-primary/95 m-4 rounded-3xl overflow-hidden">
        {/* Header */}
        <View className="bg-secondary/80 px-6 py-4 flex-row items-center justify-between border-b border-secondary/30">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">🤖</Text>
            <View>
              <Text className="text-textPrimary font-semibold text-lg">Weather Assistant</Text>
              <Text className="text-textSecondary text-sm">
                {weatherData ? `${weatherData.city}, ${weatherData.country}` : 'Ask me about weather!'}
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={clearChat}
              className="bg-accent/20 px-3 py-2 rounded-lg mr-2"
            >
              <Text className="text-accent text-xs font-medium">Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="bg-red-500/20 px-3 py-2 rounded-lg"
            >
              <Text className="text-red-400 text-xs font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-accent/80 rounded-br-md'
                    : 'bg-secondary/60 rounded-bl-md'
                }`}
              >
                <Text
                  className={`text-sm leading-5 ${
                    message.isUser ? 'text-white' : 'text-textPrimary'
                  }`}
                >
                  {message.text}
                </Text>
              </View>
              <Text className="text-textSecondary text-xs mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-secondary/60 px-4 py-3 rounded-2xl rounded-bl-md">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-textSecondary rounded-full mr-1 opacity-60" />
                  <View className="w-2 h-2 bg-textSecondary rounded-full mr-1 opacity-40" />
                  <View className="w-2 h-2 bg-textSecondary rounded-full opacity-20" />
                  <Text className="text-textSecondary text-sm ml-2">Thinking...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-secondary/50 px-4 py-4 border-t border-secondary/30">
          <View className="flex-row items-center bg-primary/50 rounded-2xl px-4 py-2 border border-secondary/30">
            <TextInput
              className="flex-1 text-textPrimary font-sans py-2"
              placeholder="Ask about weather... (e.g., 'what should I wear?')"
              placeholderTextColor="#778DA9"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`ml-2 px-4 py-2 rounded-xl ${
                inputText.trim() && !isLoading
                  ? 'bg-accent/80'
                  : 'bg-secondary/30'
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  inputText.trim() && !isLoading
                    ? 'text-white'
                    : 'text-textSecondary'
                }`}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Quick suggestions */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            {[
              "What do you think about tomorrow?",
              "What about next year?",
              "What's your weather opinion?",
              "How do you feel about this weather?",
              "Should I bring an umbrella?"
            ].map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setInputText(suggestion)}
                className="bg-accent/20 px-3 py-2 rounded-full mr-2"
                disabled={isLoading}
              >
                <Text className="text-accent text-xs font-medium">
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}