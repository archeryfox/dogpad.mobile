import React, { useState } from 'react';
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
    const { login, error: authError } = useAuthStore();

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
        console.log('Login attempt:', formData.username);
        
        try {
            // Имитируем задержку API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Вызываем метод авторизации из хранилища
            await login(formData.username, formData.password);
            
            // Если авторизация прошла успешно (не бросилось исключение), перенаправляем на главный экран
            console.log('Авторизация успешна, перенаправляем на главную страницу');
            router.replace('/(app)');
        } catch (err) {
            setError('Ошибка при входе. Попробуйте позже.');
            console.error('Login error:', err);
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Вход</Text>

            {error && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorLight || '#fee2e2' }]}>
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
                    icon={<MaterialIcons name="person" size={24} color={theme.colors.text} />}
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
                    icon={<MaterialIcons name="lock" size={24} color={theme.colors.text} />}
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
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    spacer: {
        height: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        padding: 10,
        borderRadius: 6,
    },
    errorText: {
        marginLeft: 8,
        fontSize: 14,
    },
    registerButton: {
        marginTop: 16,
    },
});

export default LoginForm; 