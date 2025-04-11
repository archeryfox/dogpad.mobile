import React from 'react';
import { Stack } from 'expo-router';
import TabNavigator from '../../components/navigation/TabNavigator';

export default function AppLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="index" screenOptions={{
                headerShown: false
            }} />

            <Stack.Screen name="events" options={{
                headerShown: false
            }} />
            <Stack.Screen name="profile"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
} 