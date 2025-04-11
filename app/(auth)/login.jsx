import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../../components/forms/LoginForm';
import useThemeStore from '../../stores/ThemeStore';

const LoginScreen = () => {
    const { theme } = useThemeStore();
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LoginForm />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default LoginScreen; 