import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import EventList from '../../../components/EventList';
import useSubscriptionStore from '../../../stores/SubscriptionStore';
import useAuthStore from '../../../stores/AuthStore';
import useThemeStore from '../../../stores/ThemeStore';
import Header from '../../../components/navigation/Header';

const SubscriptionsScreen = () => {
    const { user } = useAuthStore();
    const { subscriptions, fetchSubscriptions, isLoading } = useSubscriptionStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const renderHeader = () => (
        <Header 
            title="Мои подписки" 
        />
    );

    const renderSubscriptionsList = () => (
        <View style={styles.subscriptionsContainer}>
            <EventList 
                events={subscriptions.map(sub => sub.event)} 
                isLoading={isLoading}
                onRefresh={fetchSubscriptions}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={[{ key: 'header' }, { key: 'subscriptions' }]}
                renderItem={({ item }) => {
                    if (item.key === 'header') {
                        return renderHeader();
                    } else {
                        return renderSubscriptionsList();
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
    subscriptionsContainer: {
        flex: 1,
    }
});

export default SubscriptionsScreen; 