// dogpad.mobile/app/auth/login.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginForm from '../../components/forms/LoginForm';

export default function LoginScreen() {

    return (
        <View style={styles.container}>
            <LoginForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
        backgroundColor: '#fff',
    },
}); 