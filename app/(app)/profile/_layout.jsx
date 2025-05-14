// dogpad.mobile/app/(app)/profile/_layout.jsx
import { Stack } from 'expo-router';
import useThemeStore from '../../../stores/ThemeStore';

export default function ProfileLayout() {
    const { theme } = useThemeStore();
    
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
} 