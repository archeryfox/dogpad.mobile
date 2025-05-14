// dogpad.mobile/app/(app)/events/[id]/index.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventDetails from '../../../../components/EventDetails';
import useEventStore from '../../../../stores/EventStore';
import useAuthStore from '../../../../stores/AuthStore';
import useThemeStore from '../../../../stores/ThemeStore';
import Header from '../../../../components/navigation/Header';

const EventDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const { currentEvent, isLoading, error, fetchEventById } = useEventStore();
    const deleteEvent = useEventStore(state => state.deleteEvent);
    const { theme } = useThemeStore();

    useEffect(() => {
        fetchEventById(id);
    }, [id]);

    useEffect(() => {
        if (error) {
            router.back();
        }
    }, [error, router]);

    const handleEdit = () => {
        router.push(`/(app)/events/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            await deleteEvent(id);
            router.back();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!currentEvent) {
        return null;
    }

    return (
        <SafeAreaView 
            edges={['bottom']} 
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <Header title={currentEvent.title || 'Событие'} />
            <EventDetails
                event={currentEvent}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOwner={currentEvent.userId === user?.id}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EventDetailScreen; 