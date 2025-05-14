// dogpad.mobile/components/ui/Notification.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import useNotificationStore from '../../stores/NotificationStore';
import IconSymbol from './IconSymbol';

const Notification = () => {
    const { notification } = useNotificationStore();
    const { colors } = useTheme();
    const slideAnim = React.useRef(new Animated.Value(-100)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (notification) {
            // Анимация появления
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Анимация исчезновения
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [notification]);

    if (!notification) return null;

    // Определение цвета фона в зависимости от типа уведомления
    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'success':
                return colors.success;
            case 'error':
                return colors.error;
            case 'warning':
                return colors.warning;
            case 'info':
                return colors.info;
            default:
                return colors.info;
        }
    };

    // Определение иконки в зависимости от типа уведомления
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'close-circle';
            case 'warning':
                return 'warning';
            case 'info':
                return 'information-circle';
            default:
                return 'information-circle';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.content}>
                <IconSymbol name={getIcon()} size={24} color="white" style={styles.icon} />
                <Text style={styles.message}>{notification.message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        zIndex: 1000,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    message: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
});

export default Notification;
