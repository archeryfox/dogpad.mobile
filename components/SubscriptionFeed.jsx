// dogpad.mobile/components/SubscriptionFeed.jsx
import React, { useEffect, Fragment } from 'react';
import { View, Text } from 'react-native';
import useAuthStore from '../stores/AuthStore';
import useSubscriptionStore from '../stores/SubscriptionStore';
import useEventStore from '../stores/EventStore';
import useThemeStore from '../stores/ThemeStore';
import useNotificationStore from '../stores/NotificationStore';
import EventList from './EventList';
import styles from '../styles/SubscriptionFeedStyles';

const SubscriptionFeed = ({ inProfile }) => {
    const { user } = useAuthStore();
    const { subscriptions, fetchSubscriptions, deleteSubscription, addSubscription } = useSubscriptionStore();
    const { events, fetchEvents, isLoading, error } = useEventStore();
    const { theme } = useThemeStore();
    const { showNotification } = useNotificationStore();

    useEffect(() => {
        console.log('SubscriptionFeed: Fetching events and subscriptions');
        fetchEvents();
        fetchSubscriptions();
    }, []);

    const isSubscribed = (eventId) => {
        return subscriptions.some(sub => sub.eventId === eventId && sub.userId === user?.id);
    };

    const handleSubscribe = (eventId) => {
        if (!user) {
            showNotification("Пожалуйста, войдите в систему для подписки!", "warning");
            return;
        }
        addSubscription({ eventId: eventId, userId: user.id });
    };

    const handleDeleteSubscription = (eventId) => {
        const subscriptionToDelete = subscriptions.find(sub => sub.eventId === eventId && sub.userId === user?.id);
        if (subscriptionToDelete) {
            deleteSubscription(subscriptionToDelete.id);
        }
    };

    const subscribedEvents = events.filter(event => isSubscribed(event.id));
    
    console.log('SubscriptionFeed: Current state:', {
        eventsCount: events.length,
        subscriptionsCount: subscriptions.length,
        subscribedEventsCount: subscribedEvents.length,
        isLoading,
        error
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Ваши подписки</Text>
            <EventList 
                events={subscribedEvents}
                isLoading={isLoading}
                inProfileFeed={inProfile}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleDeleteSubscription}
            />
        </View>
    );
};

export default SubscriptionFeed;