import { Stack } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import "./globals.css";

function AppLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <View className={theme.name === 'dark' ? 'dark' : ''} style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
