// dogpad.mobile/components/navigation/BurgerMenu.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/AuthStore';
import useThemeStore from '../../stores/ThemeStore';
import ThemeToggle from '../ThemeToggle';

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
        <View style={styles.menuContainer}>
            <TouchableOpacity onPress={toggleMenu} style={[styles.burgerButton, { backgroundColor: 'transparent' }]}>
                <Ionicons name="menu" size={28} color="#3b82f6" />
            </TouchableOpacity>

            <Modal
                visible={isMenuOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={closeMenu}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.backdrop }]}>
                    <View style={[styles.menuContent, { 
                        backgroundColor: theme.colors.surface,
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.border,
                        elevation: 0,
                        shadowColor: 'transparent',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0,
                        shadowRadius: 0,
                    }]}>
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

                            {/* Блок переключения темы */}
                            <View style={[styles.themeSection, { borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.themeSectionTitle, { color: theme.colors.text }]}>
                                    Тема оформления:
                                </Text>
                                <ThemeToggle />
                            </View>

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
    menuContainer: {
        // Add styles for menuContainer if needed
    },
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
        fontWeight: '600',
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
    themeSection: {
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    themeSectionTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default BurgerMenu; 