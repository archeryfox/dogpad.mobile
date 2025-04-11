import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useAuthStore from '../stores/AuthStore';
import useThemeStore from '../stores/ThemeStore';

const RootLayout = () => {
    const { user, checkAuth } = useAuthStore();
    const { theme, isDarkMode, toggleTheme } = useThemeStore();
    const colorScheme = useColorScheme();

    useEffect(() => {
        checkAuth();
    }, []);

    // Можно добавить автоматическую синхронизацию с системной темой
    useEffect(() => {
        if (colorScheme === 'dark' && !isDarkMode) {
            toggleTheme();
        } else if (colorScheme === 'light' && isDarkMode) {
            toggleTheme();
        }
    }, [colorScheme]);

    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                    },
                    headerTintColor: theme.colors.text,
                    headerShown: false,
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    contentStyle: {
                        backgroundColor: '#000000',
                    },
                }}
            >
                {!user ? (
                    <Stack.Screen
                        name="(auth)"
                        options={{
                            headerShown: false,
                        }}
                    />
                ) : (
                    <Stack.Screen
                        name="(app)"
                        options={{
                            headerShown: false,
                        }}
                    />
                )}
            </Stack>
        </SafeAreaProvider>
    );
};

export default RootLayout; 