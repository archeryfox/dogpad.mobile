// dogpad.mobile/app/(app)/profile/index.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Profile from '../../../components/Profile';
import useAuthStore from '../../../stores/AuthStore';
import useEventStore from '../../../stores/EventStore';
import useSubscriptionStore from '../../../stores/SubscriptionStore';
import useThemeStore from '../../../stores/ThemeStore';
import Header from '../../../components/navigation/Header';

const ProfileScreen = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { events, fetchEvents } = useEventStore();
    const { fetchSubscriptions } = useSubscriptionStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        fetchEvents();
        fetchSubscriptions();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header 
                title={user?.name ? `Профиль: ${user.name}` : 'Профиль'} 
            />
            <Profile
                user={user}
                onLogout={handleLogout}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ProfileScreen; 