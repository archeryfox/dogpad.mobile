import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/AuthStore';
import useThemeStore from '../../stores/ThemeStore';

const BurgerMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { theme } = useThemeStore();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        closeMenu();
        router.replace('/(auth)/login');
    };

    const navigateTo = (route) => {
        closeMenu();
        router.push(route);
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleMenu} style={[styles.burgerButton, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="menu" size={28} color={theme.colors.text} />
            </TouchableOpacity>

            <Modal
                visible={isMenuOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={closeMenu}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.backdrop }]}>
                    <View style={[styles.menuContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={[styles.menuHeader, { borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Меню</Text>
                            <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.menuItems}>
                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: theme.colors.border }]} 
                                onPress={() => navigateTo('/(app)/events')}
                            >
                                <Ionicons name="calendar-outline" size={24} color={theme.colors.text} />
                                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>События</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.menuItem, { borderBottomColor: theme.colors.border }]} 
                                onPress={() => navigateTo('/(app)/profile')}
                            >
                                <Ionicons name="person-outline" size={24} color={theme.colors.text} />
                                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Профиль</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.menuItem, styles.logoutButton]} 
                                onPress={handleLogout}
                            >
                                <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
                                <Text style={[styles.menuItemText, { color: theme.colors.error }]}>Выйти</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    burgerButton: {
        padding: 10,
        zIndex: 1000,
    },
    modalContainer: {
        flex: 1,
    },
    menuContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80%',
        height: '100%',
        padding: 20,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    menuItems: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 15,
    },
    logoutButton: {
        marginTop: 20,
        borderBottomWidth: 0,
    },
});

export default BurgerMenu; 