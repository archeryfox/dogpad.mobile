// dogpad.mobile/app/(app)/events/index.jsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import EventList from '../../../components/EventList';
import useEventStore from '../../../stores/EventStore';
import useThemeStore from '../../../stores/ThemeStore';
import Header from '../../../components/navigation/Header';
import { Ionicons } from '@expo/vector-icons';

const EventsScreen = () => {
    const router = useRouter();
    const fetchEvents = useEventStore(state => state.fetchEvents);
    const isLoading = useEventStore(state => state.isLoading);
    const error = useEventStore(state => state.error);
    const { theme } = useThemeStore();
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        console.log('EventsScreen: Component mounted, fetching events');
        const loadEvents = async () => {
            try {
                await fetchEvents();
                console.log('EventsScreen: Successfully loaded events');
            } catch (err) {
                console.error('EventsScreen: Error fetching events:', err);
            } finally {
                setIsFirstLoad(false);
            }
        };

        loadEvents();
    }, [fetchEvents]);

    const renderHeader = () => (
        <Header 
            title="События"
        />
    );

    const renderEventsList = () => {
        if (isFirstLoad && isLoading) {
            return (
                <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Загрузка событий...</Text>
                </View>
            );
        }
        
        return (
            <View style={styles.eventsListContainer}>
                <EventList 
                    isLoading={isLoading} 
                    onRefresh={fetchEvents}
                />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={[{ key: 'header' }, { key: 'events' }]}
                renderItem={({ item }) => {
                    if (item.key === 'header') {
                        return renderHeader();
                    } else {
                        return renderEventsList();
                    }
                }}
                keyExtractor={item => item.key}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
    },
    eventsListContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    }
});

export default EventsScreen;