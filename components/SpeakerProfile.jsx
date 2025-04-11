import React from 'react';
import { View, Text, Image } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import useThemeStore from '../stores/ThemeStore';
import styles from '../styles/SpeakerProfileStyles';

const SpeakerProfile = ({ speaker }) => {
    const { theme } = useThemeStore();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.profileTitle, { color:  'white', }]}>
                    Профиль спикера
                </Text>
            </View>
            <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.header}>
                    {speaker.avatar ? (
                        <Image
                            source={{ uri: speaker.avatar }}
                            style={styles.avatar}
                            onError={() => {
                                // Handle image loading error
                                console.log('Error loading speaker avatar image');
                            }}
                        />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.disabled }]}>
                            <Text style={[styles.avatarPlaceholderText, { color: theme.colors.textSecondary }]}>
                                {speaker.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.info}>
                        <Text style={[styles.name, { color: theme.colors.text }]}>{speaker.name}</Text>
                        <Text style={[styles.biography, { color: theme.colors.textSecondary }]}>{speaker.biography}</Text>
                    </View>
                </View>

                <View style={styles.requestsSection}>
                    <Text style={[styles.requestsTitle, { color: theme.colors.text }]}>Запросы на изменение роли:</Text>
                    {speaker?.RoleChangeRequest?.length > 0 ? (
                        speaker.RoleChangeRequest.map(request => (
                            <View key={request.id} style={[styles.requestItem, { backgroundColor: theme.colors.light }]}>
                                <Text style={[styles.requestText, { color: theme.colors.text }]}>
                                    <Text style={[styles.bold, { color: theme.colors.text }]}>Запрашиваемая роль:</Text> {request?.requestedRoleId}
                                </Text>
                                <Text style={[styles.requestText, { color: theme.colors.text }]}>
                                    <Text style={[styles.bold, { color: theme.colors.text }]}>Статус:</Text> {request.status}
                                </Text>
                                <Text style={[styles.requestDate, { color: theme.colors.textSecondary }]}>
                                    {format(new Date(request?.createdAt), 'd MMMM yyyy', { locale: ru })}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.noRequests, { color: theme.colors.textSecondary }]}>Нет запросов на изменение роли.</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default SpeakerProfile; 