import React from 'react';
import { Stack } from 'expo-router';

const EventLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: 'Редактировать событие',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            />
        </Stack>
    );
};

export default EventLayout; 