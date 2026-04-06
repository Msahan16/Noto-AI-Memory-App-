import { useAuthStore } from '@/store/authStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ title: 'Note Details' }} />
      </Stack>
    </ThemeProvider>
  );
}
