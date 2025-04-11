import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import EventsScreen from '../../app/(app)/events/index';
import ProfileScreen from '../../app/(app)/profile/index';
import HomeScreen from '../../app/(app)/home/index';
import useEventStore from '../../stores/EventStore';
import useSubscriptionStore from '../../stores/SubscriptionStore';
import useThemeStore from '../../stores/ThemeStore';
import BurgerMenu from './BurgerMenu';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { fetchEvents, isLoading } = useEventStore();
    const { fetchSubscriptions, isLoading: isSubscriptionsLoading } = useSubscriptionStore();
    const { theme } = useThemeStore();
    const [initialLoading, setInitialLoading] = useState(true);

    // Загружаем события и подписки при инициализации
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchEvents(),
                    fetchSubscriptions()
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                // Устанавливаем таймер для отображения индикатора загрузки
                setTimeout(() => {
                    setInitialLoading(false);
                }, 1000); // Показываем индикатор загрузки в течение 1 секунды
            }
        };

        loadData();
    }, []);

    // Показываем индикатор загрузки при первой загрузке
    if (initialLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text }]}>Загрузка данных...</Text>
            </View>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Events') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: theme.colors.border,
                },
                header: ({ route }) => {
                    // Для Events не показываем заголовок
                    if (route.name === 'Events') {
                        return null;
                    }
                    
                    return (
                        <View style={[styles.header, { 
                            backgroundColor: theme.colors.surface, 
                            borderBottomColor: theme.colors.border 
                        }]}>
                            <BurgerMenu />
                            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                                {route.name === 'Home' ? 'Главная' : 
                                 route.name === 'Profile' ? 'Профиль' : ''}
                            </Text>
                            <View style={styles.headerRight} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Главная',
                }}
            />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
                options={{
                    title: 'События',
                    headerShown: false, // Дополнительно скрываем заголовок
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Профиль',
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        width: 40, // Для баланса с бургер-меню
    },
});

export default TabNavigator; 