import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme, StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
  },
});

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme}>
        <RootNavigator />
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
