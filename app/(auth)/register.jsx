// dogpad.mobile/app/(auth)/register.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from '../../components/forms/RegisterForm';
import useThemeStore from '../../stores/ThemeStore';

const RegisterScreen = () => {
    const { theme } = useThemeStore();
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <RegisterForm />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RegisterScreen; 