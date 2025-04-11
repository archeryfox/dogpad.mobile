import React, { useState } from 'react';
import { View, Text, FlatList, Image, TextInput, Modal, TouchableOpacity } from 'react-native';
import QRCode from 'react-qr-code';
import Button from './ui/Button';
import SubscriptionFeed from './SubscriptionFeed';
import SpeakerProfile from './SpeakerProfile';
import ThemeToggle from './ThemeToggle';
import useThemeStore from '../stores/ThemeStore';
import styles from '../styles/ProfileStyles';

const Profile = ({ user, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const { theme } = useThemeStore();
    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        roleId: user?.roleId || 1,
        avatar: user?.avatar || '',
    });

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.error, { color: theme.colors.error }]}>Пользователь не найден</Text>
            </View>
        );
    }

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData({
                name: user.name,
                email: user.email,
                roleId: user.roleId,
                avatar: user.avatar,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        try {
            await updateUser(editData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const localRole = (role) => {
        const roles = {
            "user": "Пользователь",
            'admin': 'Админ',
            'speaker': 'Спикер',
            'organizer': 'Организатор',
            'db_admin': 'Админ базы данных'
        };
        return roles[role] || role;
    };

    // Generate QR code data
    const qrCodeData = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.profileSection}>
                {/* Speaker Profile */}
                {user?.Speaker?.length > 0 && (
                    <View style={styles.speakerSection}>
                        <SpeakerProfile speaker={user.Speaker[0]} />
                    </View>
                )}

                {/* User Info */}
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {editData.avatar ? (
                            <Image
                                source={{ uri: editData.avatar }}
                                style={styles.avatar}
                                onError={() => {
                                    // Handle image loading error
                                    console.log('Error loading avatar image');
                                }}
                            />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surface }]}>
                                <Text style={[styles.avatarPlaceholderText, { color: theme.colors.textSecondary }]}>
                                    {user.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        {isEditing ? (
                            <>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.light, color: theme.colors.text }]}
                                    value={editData.name}
                                    onChangeText={(text) => setEditData({ ...editData, name: text })}
                                    placeholder="Имя"
                                    placeholderTextColor={theme.colors.placeholder}
                                />
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.light, color: theme.colors.text }]}
                                    value={editData.email}
                                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                                    placeholder="Email"
                                    placeholderTextColor={theme.colors.placeholder}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.light, color: theme.colors.text }]}
                                    value={editData.avatar}
                                    onChangeText={(text) => setEditData({ ...editData, avatar: text })}
                                    placeholder="URL аватара"
                                    placeholderTextColor={theme.colors.placeholder}
                                    autoCapitalize="none"
                                />
                            </>
                        ) : (
                            <>
                                <Text style={[styles.name, { color: theme.colors.text }]}>{user.name}</Text>
                                <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user.email}</Text>
                                <Text style={[styles.balance, { color: theme.colors.text }]}>Баланс: {user.balance}₽</Text>
                                <Text style={[styles.role, { color: theme.colors.text }]}>Роль: {localRole(user.role)}</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Настройки темы */}
                <View style={styles.themeSection}>
                    <Text style={[styles.themeSectionTitle, { color: theme.colors.text }]}>Тема оформления:</Text>
                    <ThemeToggle />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title={isEditing ? "Сохранить" : "Редактировать"}
                        onPress={isEditing ? handleSaveChanges : handleEditToggle}
                        style={[styles.button, isEditing ? styles.saveButton : styles.editButton]}
                    />
                    {isEditing ? (
                        <Button
                            title="Отменить"
                            onPress={handleEditToggle}
                            style={[styles.button, styles.cancelButton]}
                        />
                    ) : (
                        <Button
                            title="QR код"
                            onPress={() => setShowQRCode(true)}
                            style={[styles.button, styles.qrButton]}
                        />
                    )}
                    <Button
                        title="Выйти"
                        onPress={onLogout}
                        style={[styles.button, styles.logoutButton]}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Modal
                visible={showQRCode}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowQRCode(false)}
            >
                <TouchableOpacity 
                    style={[styles.modalOverlay, { backgroundColor: theme.colors.backdrop }]}
                    activeOpacity={1}
                    onPress={() => setShowQRCode(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <View style={[styles.qrContainer, { backgroundColor: theme.colors.light }]}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={qrCodeData}
                                viewBox="0 0 256 256"
                                level="H"
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                            />
                        </View>
                        <Text style={[styles.qrText, { color: theme.colors.text }]}>Профиль пользователя {user.name}</Text>
                        <Button
                            title="Закрыть"
                            onPress={() => setShowQRCode(false)}
                            style={styles.closeButton}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <FlatList
                data={[{ key: 'header' }, { key: 'subscriptions' }]}
                renderItem={({ item }) => {
                    if (item.key === 'header') {
                        return renderHeader();
                    } else {
                        return (
                            <View style={styles.subscriptionsSection}>
                                <SubscriptionFeed inProfile={true} />
                            </View>
                        );
                    }
                }}
                keyExtractor={item => item.key}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

export default Profile; 