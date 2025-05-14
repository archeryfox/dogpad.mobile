// dogpad.mobile/components/navigation/Header.jsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useThemeStore from '../../stores/ThemeStore';
import BurgerMenu from './BurgerMenu';

const Header = ({ title = 'Dogpad', showBack = true }) => {
    const router = useRouter();
    const { theme } = useThemeStore();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // Если некуда идти назад, перенаправляем на главную страницу
            router.push('/(app)');
        }
    };

    return (
        <SafeAreaView 
            edges={['top']} 
            style={[
                styles.container, 
                { backgroundColor: theme.colors.surface }
            ]}
        >
            <View style={[
                styles.header, 
                { 
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                }
            ]}>
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity 
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                </View>
                <View style={styles.rightSection}>
                    <BurgerMenu />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        height: 60,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    menuButton: {
        padding: 4,
    }
});

export default Header;