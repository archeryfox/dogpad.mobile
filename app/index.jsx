import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import useAuthStore from '../stores/AuthStore';

export default function Index() {
    const { user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    // Если пользователь не авторизован, перенаправляем на страницу авторизации
    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    // Если пользователь авторизован, перенаправляем на страницу событий
    return <Redirect href="/(app)/events" />;
} 