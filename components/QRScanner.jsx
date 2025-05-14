// dogpad.mobile/components/QRScanner.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import useThemeStore from '../stores/ThemeStore';
import styles from '../styles/QRScannerStyles';

const QRScanner = ({ onScan, onClose }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const { theme } = useThemeStore();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        onScan(data);
    };

    if (hasPermission === null) {
        return (
            <Modal visible={true} transparent={true}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.text, { color: theme.colors.text }]}>Запрос разрешения на использование камеры...</Text>
                </View>
            </Modal>
        );
    }

    if (hasPermission === false) {
        return (
            <Modal visible={true} transparent={true}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.text, { color: theme.colors.text }]}>Нет доступа к камере</Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={true} transparent={true}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.scannerContainer}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={styles.scanner}
                    />
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: theme.colors.text }]}>Сканирование QR-кода</Text>
                            <TouchableOpacity
                                style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
                                onPress={onClose}
                            >
                                <MaterialIcons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.scanArea, { borderColor: theme.colors.primary }]} />
                        <Text style={[styles.instructions, { color: theme.colors.text }]}>
                            Наведите камеру на QR-код
                        </Text>
                        {scanned && (
                            <TouchableOpacity
                                style={[styles.scanAgainButton, { backgroundColor: theme.colors.primary }]}
                                onPress={() => setScanned(false)}
                            >
                                <Text style={[styles.scanAgainText, { color: theme.colors.buttonText }]}>
                                    Сканировать снова
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default QRScanner; 