import { PreferencesProvider, Theme } from '@/components/preferences-provider';
import { QueryBoundaries } from '@/components/query-boundaries';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DarkTheme, DefaultTheme } from '@/constants/router-theme';
import { AuthProvider } from '@/features/auth/components/auth-provider';
import { PushNotificationProvider } from '@/features/push-notification/components/push-notification-provider';
import { SocketProvider } from '@/features/socket/components/socket-provider';
import '@/global.css';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

LogBox.ignoreAllLogs(true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 60000,
    },
  },
});

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

export default function RootLayout() {
  const [theme, setTheme] = useState<Theme>();
  const colorScheme = useColorScheme();
  const colorSchemeRef = useRef(colorScheme);
  // const state = useNavigationState((state) => state);
  // console.log(state);

  const [loaded] = useFonts({
    SpaceMono: require('@assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = (await AsyncStorage.getItem('theme')) as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(colorSchemeRef.current || 'light');
      }
    };

    loadTheme();
  }, []);

  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);

    if (newTheme) {
      AsyncStorage.setItem('theme', newTheme);
    } else {
      AsyncStorage.removeItem('theme');
    }
  }, []);

  if (!loaded || !theme) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <GluestackUIProvider mode={theme}>
        <QueryClientProvider client={queryClient}>
          <QueryBoundaries>
            <AuthProvider>
              <PushNotificationProvider>
                <SocketProvider>
                  <PreferencesProvider theme={theme} updateTheme={updateTheme}>
                    <BottomSheetModalProvider>
                      <KeyboardProvider>
                        <NavigationThemeProvider
                          value={theme === 'dark' ? DarkTheme : DefaultTheme}>
                          <StatusBar style="auto" />
                          <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
                          </Stack>
                        </NavigationThemeProvider>
                      </KeyboardProvider>
                    </BottomSheetModalProvider>
                  </PreferencesProvider>
                </SocketProvider>
              </PushNotificationProvider>
            </AuthProvider>
          </QueryBoundaries>
        </QueryClientProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
