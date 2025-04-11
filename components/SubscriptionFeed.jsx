import React, { useEffect, Fragment } from 'react';
import { View, Text } from 'react-native';
import useAuthStore from '../stores/AuthStore';
import useSubscriptionStore from '../stores/SubscriptionStore';
import useEventStore from '../stores/EventStore';
import useThemeStore from '../stores/ThemeStore';
import EventList from './EventList';
import styles from '../styles/SubscriptionFeedStyles';

const SubscriptionFeed = ({ inProfile }) => {
    const { user } = useAuthStore();
    const { subscriptions, fetchSubscriptions, deleteSubscription, addSubscription } = useSubscriptionStore();
    const { events, fetchEvents, isLoading, error } = useEventStore();
    const { theme } = useThemeStore();

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
            alert("Пожалуйста, войдите в систему для подписки!");
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
        <Fragment>
            <Text style={[styles.title, { color: theme.colors.text, backgroundColor: theme.colors.surface, padding: 16 }]}>Ваши подписки</Text>
            <EventList 
                events={subscribedEvents}
                isLoading={isLoading}
                inProfileFeed={inProfile}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleDeleteSubscription}
            />
        </Fragment>
    );
};

export default SubscriptionFeed; 