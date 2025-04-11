import React from 'react';
import { Redirect } from 'expo-router';

export default function AppIndex() {
    // Перенаправляем на вкладку "Главная" при запуске приложения
    return <Redirect href="/(app)/home" />;
} 