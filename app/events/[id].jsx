// dogpad.mobile/app/events/[id].jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useEventStore from '../../stores/EventStore';
import useAuthStore from '../../stores/AuthStore';
import { format } from 'date-fns';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { getEventById, subscribeToEvent, unsubscribeFromEvent } = useEventStore();
    const { user } = useAuthStore();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await getEventById(id);
                setEvent(eventData);
                
                // Check if user is subscribed to this event
                if (user && eventData.subscribers) {
                    const subscribed = eventData.subscribers.some(sub => sub.user.id === user.id);
                    setIsSubscribed(subscribed);
                }
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user]);

    const handleSubscribe = async () => {
        try {
            await subscribeToEvent(id);
            setIsSubscribed(true);
        } catch (error) {
            console.error('Error subscribing to event:', error);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await unsubscribeFromEvent(id);
            setIsSubscribed(false);
        } catch (error) {
            console.error('Error unsubscribing from event:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Мероприятие не найдено</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {event.image && (
                <Image 
                    source={{ uri: event.image }} 
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            
            <View style={styles.content}>
                <Text style={styles.title}>{event.name}</Text>
                
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Дата:</Text>
                    <Text style={styles.value}>
                        {format(new Date(event.date), 'dd.MM.yyyy HH:mm')}
                    </Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Место:</Text>
                    <Text style={styles.value}>{event.venue?.name || 'Онлайн'}</Text>
                </View>
                
                {event.isPaid && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Стоимость:</Text>
                        <Text style={styles.value}>{event.price}₽</Text>
                    </View>
                )}
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Описание</Text>
                    <Text style={styles.description}>{event.description}</Text>
                </View>
                
                {event.organizer && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Организатор</Text>
                        <View style={styles.organizerInfo}>
                            {event.organizer.avatar && (
                                <Image 
                                    source={{ uri: event.organizer.avatar }} 
                                    style={styles.avatar}
                                />
                            )}
                            <View style={styles.organizerDetails}>
                                <Text style={styles.organizerName}>{event.organizer.name}</Text>
                                <Text style={styles.organizerEmail}>{event.organizer.email}</Text>
                            </View>
                        </View>
                    </View>
                )}
                
                {event.speakers && event.speakers.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Спикеры</Text>
                        {event.speakers.map((speaker, index) => (
                            <View key={index} style={styles.speakerItem}>
                                <Text style={styles.speakerName}>{speaker.speaker.name}</Text>
                            </View>
                        ))}
                    </View>
                )}
                
                {user && (
                    <View style={styles.buttonContainer}>
                        {isSubscribed ? (
                            <TouchableOpacity 
                                style={styles.unsubscribeButton}
                                onPress={handleUnsubscribe}
                            >
                                <Text style={styles.buttonText}>Отписаться</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={styles.subscribeButton}
                                onPress={handleSubscribe}
                            >
                                <Text style={styles.buttonText}>
                                    {event.isPaid ? 'Подписаться и оплатить' : 'Подписаться'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#dc2626',
    },
    image: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 100,
        fontSize: 16,
        color: '#666',
    },
    value: {
        flex: 1,
        fontSize: 16,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    organizerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    organizerDetails: {
        flex: 1,
    },
    organizerName: {
        fontSize: 16,
        fontWeight: '500',
    },
    organizerEmail: {
        fontSize: 14,
        color: '#666',
    },
    speakerItem: {
        marginBottom: 8,
    },
    speakerName: {
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 24,
    },
    subscribeButton: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    unsubscribeButton: {
        backgroundColor: '#dc2626',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 