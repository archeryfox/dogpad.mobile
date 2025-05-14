// dogpad.mobile/components/BurgerMenu.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useAuthStore from '../stores/AuthStore';
import useThemeStore from '../stores/ThemeStore';
import styles from '../styles/BurgerMenuStyles';

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { theme } = useThemeStore();

    const handleNavigation = (route) => {
        setIsOpen(false);
        router.push(route);
    };

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.burgerButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setIsOpen(true)}
            >
                <MaterialIcons name="menu" size={28} color="#3b82f6" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={[styles.menuContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={styles.header}>
                            <Text style={[styles.headerText, { color: theme.colors.text }]}>Меню</Text>
                            <TouchableOpacity onPress={() => setIsOpen(false)}>
                                <MaterialIcons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={() => handleNavigation('/(app)/events')}
                        >
                            <MaterialIcons name="event" size={24} color={theme.colors.text} />
                            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>События</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={() => handleNavigation('/(app)/profile')}
                        >
                            <MaterialIcons name="person" size={24} color={theme.colors.text} />
                            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Профиль</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                            onPress={handleLogout}
                        >
                            <MaterialIcons name="logout" size={24} color={theme.colors.error} />
                            <Text style={[styles.menuItemText, { color: theme.colors.error }]}>Выйти</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default BurgerMenu; 