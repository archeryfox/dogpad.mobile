import { Stack } from 'expo-router';

export default function EventsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'События',
                    headerShown: false,                    
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            />
            <Stack.Screen
                name="subscriptions"
                options={{
                    title: 'Мои подписки',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            />
            
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 