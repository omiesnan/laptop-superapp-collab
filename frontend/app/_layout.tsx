import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '../src/context/LanguageContext';
import { COLORS } from '../src/constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="checker" />
          <Stack.Screen name="optimization" />
          <Stack.Screen name="install-guide" />
          <Stack.Screen name="download-center" />
          <Stack.Screen name="license" />
        </Stack>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
