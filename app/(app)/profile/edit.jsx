import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../../components/ui/Button';
import useAuthStore from '../../../stores/AuthStore';

const EditProfileScreen = () => {
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const updateUser = useAuthStore(state => state.updateUser);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            await updateUser({
                ...user,
                name: name.trim(),
                email: email.trim(),
            });
            router.back();
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Имя</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Введите ваше имя"
                    placeholderTextColor="#9ca3af"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Введите ваш email"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Button
                    title="Сохранить"
                    onPress={handleSave}
                    isLoading={isLoading}
                    disabled={!name.trim() || !email.trim()}
                    style={styles.button}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        color: '#1f2937',
    },
    button: {
        marginTop: 10,
    },
});

export default EditProfileScreen; 