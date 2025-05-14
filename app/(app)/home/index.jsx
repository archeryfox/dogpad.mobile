// dogpad.mobile/app/(app)/home/index.jsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import EventList from '../../../components/EventList';
import useEventStore from '../../../stores/EventStore';
import useAuthStore from '../../../stores/AuthStore';
import useThemeStore from '../../../stores/ThemeStore';
import Header from '../../../components/navigation/Header';

const HomeScreen = () => {
    const router = useRouter();
    const { events, isLoading, error, fetchEvents } = useEventStore();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        console.log('HomeScreen: Component mounted, fetching events');
        const loadEvents = async () => {
            try {
                await fetchEvents();
                console.log('HomeScreen: Successfully loaded events:', events.length);
            } catch (err) {
                console.error('HomeScreen: Error fetching events:', err);
            } finally {
                setIsFirstLoad(false);
            }
        };

        loadEvents();
    }, [fetchEvents]);

    const renderHeader = () => (
        <Header 
            title="Главная" 
        />
    );

    const renderContent = () => {
        // Показываем индикатор загрузки при первой загрузке
        if (isFirstLoad && isLoading) {
            return (
                <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Загрузка событий...</Text>
                </View>
            );
        }

        return (
            <View style={styles.contentContainer}>
                <EventList 
                    events={events} 
                    isLoading={isLoading} 
                    onRefresh={fetchEvents}
                />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={[{ key: 'header' }, { key: 'content' }]}
                renderItem={({ item }) => {
                    if (item.key === 'header') {
                        return renderHeader();
                    } else {
                        return renderContent();
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
    contentContainer: {
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
    }
});

export default HomeScreen; 