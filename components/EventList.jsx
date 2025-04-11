import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import EventCard from './cards/EventCard';
import EventFilters from './filters/EventFilters';
import useAuthStore from '../stores/AuthStore';
import useEventStore from '../stores/EventStore';
import useSubscriptionStore from '../stores/SubscriptionStore';
import useThemeStore from '../stores/ThemeStore';
import styles from '../styles/EventListStyles';

const EventList = ({ events: propEvents, isLoading, onRefresh }) => {
    const router = useRouter();
    const { user } = useAuthStore();
    const { error, fetchEvents, filteredEvents } = useEventStore();
    const { subscriptions, addSubscription, deleteSubscription } = useSubscriptionStore();
    const { theme } = useThemeStore();
    const [refreshing, setRefreshing] = React.useState(false);

    // Используем либо переданные события (props), либо отфильтрованные из store
    const events = propEvents || filteredEvents;

    React.useEffect(() => {
        console.log('EventList: Rendering with events:', events?.length || 0);
    }, [events]);

    const handleRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            if (onRefresh) {
                await onRefresh();
            } else {
                await fetchEvents();
            }
        } catch (err) {
            console.error('Failed to refresh events:', err);
        } finally {
            setRefreshing(false);
        }
    }, [onRefresh, fetchEvents]);

    const handlePressEvent = (eventId) => {
        // Используем правильный путь для route в Expo Router
        router.push({
            pathname: "/(app)/events/[id]",
            params: { id: eventId }
        });
    };

    const handleRetry = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            fetchEvents();
        }
    };

    const handleSubscribe = (eventId) => {
        if (!user) {
            alert("Пожалуйста, войдите в систему для подписки!");
            return;
        }
        addSubscription({ eventId: eventId, userId: user.id });
    };

    const handleUnsubscribe = (eventId) => {
        if (!user) return;
        
        const subscription = subscriptions.find(
            sub => sub.eventId === eventId && sub.userId === user.id
        );
        
        if (subscription) {
            deleteSubscription(subscription.id);
        }
    };

    const isSubscribed = (eventId) => {
        return subscriptions.some(sub => sub.eventId === eventId && sub.userId === user?.id);
    };

    const renderContent = () => {
        if (isLoading && !refreshing) {
            return (
                <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.text }]}>Загрузка событий...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
                    <TouchableOpacity 
                        style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} 
                        onPress={handleRetry}
                    >
                        <Text style={[styles.retryButtonText, { color: theme.colors.buttonText }]}>Попробовать снова</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        if (!events || events.length === 0) {
            return (
                <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Событий пока нет</Text>
                    <TouchableOpacity 
                        style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} 
                        onPress={handleRetry}
                    >
                        <Text style={[styles.retryButtonText, { color: theme.colors.buttonText }]}>Обновить</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    console.log('EventList: Rendering event:', item.id, item.name);
                    return (
                        <EventCard
                            event={item}
                            onPress={() => handlePressEvent(item.id)}
                            user={user}
                            isSubscribed={isSubscribed(item.id)}
                            onSubscribe={handleSubscribe}
                            onUnsubscribe={handleUnsubscribe}
                        />
                    );
                }}
                contentContainerStyle={[styles.listContainer, { backgroundColor: theme.colors.background }]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            />
        );
    };

    // Если события переданы через props, не показываем фильтры
    // (например, в профиле пользователя или на странице подписок)
    if (propEvents) {
        return renderContent();
    }

    // В основной ленте показываем фильтры
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <EventFilters />
            {renderContent()}
        </View>
    );
};

export default EventList; 