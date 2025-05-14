// dogpad.mobile/app/profile/index.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/AuthStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Пожалуйста, войдите в систему</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Личная информация</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Роль:</Text>
            <Text style={styles.value}>{user.role}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Редактировать профиль</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Действия</Text>
          {user.role === 'organizer' && (
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/events/my')}
            >
              <Text style={styles.buttonText}>Мои события</Text>
            </TouchableOpacity>
          )}
          
          {user.role === 'speaker' && (
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/events/sessions')}
            >
              <Text style={styles.buttonText}>Мои сессии</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/events/subscriptions')}
          >
            <Text style={styles.buttonText}>Мои подписки</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 100,
    fontSize: 16,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#4b5563',
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 