// dogpad.mobile/components/forms/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/AuthStore';
import useThemeStore from '../../stores/ThemeStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MaterialIcons } from '@expo/vector-icons';

const LoginForm = () => {
    const router = useRouter();
    const { theme } = useThemeStore();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, error: authError, user } = useAuthStore();
    
    // Следим за изменениями в authError
    useEffect(() => {
        if (authError) {
            setError(authError);
            setLoading(false);
        }
    }, [authError]);
    
    // Следим за изменениями в user
    useEffect(() => {
        if (user) {
            // Если пользователь авторизован, перенаправляем на главную страницу
            router.replace('/(app)');
        }
    }, [user, router]);

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
        // Сбрасываем ошибку при редактировании
        if (error) setError(null);
    };

    const handleSubmit = async () => {
        // Проверка полей
        if (!formData.username || !formData.password) {
            setError('Заполните все поля формы');
            return;
        }

        setLoading(true);
        setError(null);
        console.log('Login attempt:', formData.username);
        
        try {
            // Вызываем метод авторизации из хранилища
            await login(formData.username, formData.password);
            
            // Проверка результата авторизации происходит в useEffect
        } catch (err) {
            console.error('Login error in component:', err);
            setError('Ошибка при входе. Проверьте соединение с интернетом.');
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Вход</Text>

            {error && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorLight || '#fee2e2', borderColor: theme.colors.error || '#dc2626', borderWidth: 1 }]}>
                    <MaterialIcons name="error" size={20} color={theme.colors.error || '#dc2626'} />
                    <Text style={[styles.errorText, { color: theme.colors.error || '#dc2626' }]}>{error}</Text>
                </View>
            )}

            <View style={styles.form}>
                <Input
                    label="Имя пользователя"
                    placeholder="Введите ваше имя пользователя"
                    value={formData.username}
                    onChangeText={(value) => handleChange('username', value)}
                    theme={theme}
                    editable={!loading}
                    autoCapitalize="none"
                    icon={<MaterialIcons name="person" size={24} color={theme.colors.textSecondary} />}
                />
                <View style={styles.spacer} />
                <Input
                    label="Пароль"
                    placeholder="Введите ваш пароль"
                    value={formData.password}
                    onChangeText={(value) => handleChange('password', value)}
                    secureTextEntry
                    theme={theme}
                    autoCapitalize="none"
                    editable={!loading}
                    icon={<MaterialIcons name="lock" size={24} color={theme.colors.textSecondary} />}
                />
                <View style={styles.spacer} />
                <Button
                    title={loading ? "Вход..." : "Войти"}
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!formData.username || !formData.password}
                    theme={theme}
                    variant="primary"
                    size="large"
                />
                <View style={styles.spacer} />
                <Button
                    title="Регистрация"
                    onPress={() => router.push('/(auth)/register')}
                    variant="outline"
                    style={styles.registerButton}
                    theme={theme}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 32,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    spacer: {
        height: 20,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
    },
    errorText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    registerButton: {
        marginTop: 16,
    },
});

export default LoginForm;