// dogpad.mobile/components/ThemeToggle.jsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../stores/ThemeStore';

const ThemeToggle = ({ style }) => {
    const { isDarkMode, toggleTheme, theme } = useThemeStore();

    return (
        <View style={[styles.container, style]}>
            <Ionicons 
                name="sunny" 
                size={24} 
                color={isDarkMode ? theme.colors.textSecondary : theme.colors.warning} 
            />
            <Switch
                style={styles.switch}
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#f0f0f0', true: '#3b82f6' }}
                thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#f0f0f0"
            />
            <Ionicons 
                name="moon" 
                size={24} 
                color={isDarkMode ? theme.colors.primary : theme.colors.textSecondary} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 12,
    },
    switch: {
        marginHorizontal: 12,
    },
});

export default ThemeToggle;