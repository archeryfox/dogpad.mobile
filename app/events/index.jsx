import React from 'react';
import { View, StyleSheet } from 'react-native';
import EventList from '../../components/EventList';

export default function EventsScreen() {
    return (
        <View style={styles.container}>
            <EventList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
}); 