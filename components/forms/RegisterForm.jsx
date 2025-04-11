import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/AuthStore';
import useThemeStore from '../../stores/ThemeStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MaterialIcons } from '@expo/vector-icons';

const RegisterForm = () => {
    const router = useRouter();
    const { theme } = useThemeStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, error: authError } = useAuthStore();

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Сбрасываем ошибку при изменении полей
        if (error) setError('');
    };

    const handleSubmit = async () => {
        const { email, password, confirmPassword, name } = formData;

        if (!email || !password || !confirmPassword || !name) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Имитируем задержку API для отображения процесса загрузки
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Вызываем метод регистрации
            await register(name, email, password);
            
            // Если регистрация прошла успешно (не бросилось исключение), перенаправляем на главный экран
            console.log('Регистрация успешна, перенаправляем пользователя');
            router.replace('/(app)');
        } catch (err) {
            setError('Произошла ошибка при регистрации');
            setIsLoading(false);
        }
    };

    const displayError = error || authError;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Регистрация</Text>

            {displayError && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorLight || '#fee2e2' }]}>
                    <MaterialIcons name="error" size={20} color={theme.colors.error || '#dc2626'} />
                    <Text style={[styles.errorText, { color: theme.colors.error || '#dc2626' }]}>{displayError}</Text>
                </View>
            )}

            <View style={styles.form}>
                <Input
                    label="Имя"
                    value={formData.name}
                    onChangeText={(value) => handleChange('name', value)}
                    placeholder="Введите ваше имя"
                    theme={theme}
                    editable={!isLoading}
                    icon={<MaterialIcons name="person" size={24} color={theme.colors.text} />}
                />
                
                <View style={styles.spacer} />

                <Input
                    label="Email"
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                    placeholder="Введите email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    theme={theme}
                    editable={!isLoading}
                    icon={<MaterialIcons name="email" size={24} color={theme.colors.text} />}
                />
                
                <View style={styles.spacer} />

                <Input
                    label="Пароль"
                    value={formData.password}
                    onChangeText={(value) => handleChange('password', value)}
                    placeholder="Введите пароль"
                    secureTextEntry
                    theme={theme}
                    editable={!isLoading}
                    icon={<MaterialIcons name="lock" size={24} color={theme.colors.text} />}
                />
                
                <View style={styles.spacer} />

                <Input
                    label="Подтвердите пароль"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleChange('confirmPassword', value)}
                    placeholder="Подтвердите пароль"
                    secureTextEntry
                    theme={theme}
                    editable={!isLoading}
                    icon={<MaterialIcons name="lock" size={24} color={theme.colors.text} />}
                />
                
                <View style={styles.spacer} />

                <Button
                    title={isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={!formData.email || !formData.password || !formData.name || !formData.confirmPassword}
                    style={styles.button}
                    theme={theme}
                    variant="primary"
                    size="large"
                />

                <View style={styles.spacer} />

                <Button
                    title="Уже есть аккаунт? Войти"
                    onPress={() => router.push('/(auth)/login')}
                    variant="outline"
                    style={styles.loginButton}
                    theme={theme}
                    disabled={isLoading}
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
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 10,
        borderRadius: 6,
    },
    errorText: {
        marginLeft: 8,
        fontSize: 14,
    },
    spacer: {
        height: 16,
    },
    button: {
        marginTop: 10,
    },
    loginButton: {
        marginTop: 5,
    },
});

export default RegisterForm; 