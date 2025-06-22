import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { useState } from "react";
import "./globals.css";

export default function Index() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  const backgrounds = [
    null,
    { uri: 'https://images.unsplash.com/photo-1419833479618-c595710e6711?w=800' },
    { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { uri: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800' },
    { uri: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800' },
  ];
  
  const handleGenerate = () => {
    setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
  };
  
  const renderContent = () => (
    <View className="flex-1">
      <View className="absolute top-20 right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></View>
      <View className="absolute top-40 left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></View>
      <View className="absolute bottom-32 right-8 w-28 h-28 bg-cyan-500/20 rounded-full blur-xl"></View>
      
      {backgroundIndex !== 0 && (
        <View className="absolute inset-0 bg-black/40"></View>
      )}
      
      <View className="pt-16 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            className="bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur-sm active:scale-95"
            onPress={() => console.log('Menu pressed')}
          >
            <Text className="text-white text-sm font-medium">Menu</Text>
          </TouchableOpacity>
          
          <View className="flex-1 mx-4">
            <View className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
              <Text className="text-gray-400 text-base">Search location...</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            className="bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur-sm active:scale-95"
            onPress={() => console.log('About Us pressed')}
          >
            <Text className="text-white text-sm font-medium">About</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 backdrop-blur-xl w-full max-w-sm">
          <View className="items-center">
            <View className="bg-gradient-to-r from-purple-500 to-cyan-500 w-16 h-16 rounded-2xl mb-6 items-center justify-center">
              <Text className="text-white text-2xl">⚡</Text>
            </View>
            <Text className="text-white text-8xl font-thin tracking-tighter">--°</Text>
            <Text className="text-gray-400 text-lg mt-2">Awaiting Location</Text>
            <View className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6 mb-4"></View>
            <Text className="text-gray-500 text-sm">Ready to generate forecast</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full w-24 h-24 shadow-2xl active:scale-95 mb-8 items-center justify-center"
          onPress={handleGenerate}
        >
          <Text className="text-white text-2xl">✨</Text>
        </TouchableOpacity>
        
        <View className="w-full px-2">
          <View className="flex-row justify-between">
            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 mr-2 backdrop-blur-sm">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">Humidity</Text>
              <Text className="text-white text-2xl font-semibold">--%</Text>
            </View>
            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 mx-1 backdrop-blur-sm">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">Wind</Text>
              <Text className="text-white text-2xl font-semibold">--</Text>
            </View>
            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 ml-2 backdrop-blur-sm">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">UV Index</Text>
              <Text className="text-white text-2xl font-semibold">--</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500"></View>
    </View>
  );
  
  return (
    <View className="flex-1 bg-black">
      {backgroundIndex === 0 ? (
        renderContent()
      ) : (
        <ImageBackground 
          source={backgrounds[backgroundIndex]}
          className="flex-1"
          resizeMode="cover"
        >
          {renderContent()}
        </ImageBackground>
      )}
    </View>
  );
}