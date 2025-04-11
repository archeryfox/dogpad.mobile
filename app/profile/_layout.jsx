import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import useAuthStore from '../../stores/AuthStore';

export default function ProfileLayout() {
  const { user } = useAuthStore();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Профиль',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Редактировать профиль',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 