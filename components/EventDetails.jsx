// dogpad.mobile/components/EventDetails.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, Linking, Platform, Modal } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import QRCode from 'react-qr-code';
import QRScanner from './QRScanner';
import BurgerMenu from './BurgerMenu';
import useAuthStore from '../stores/AuthStore';
import useThemeStore from '../stores/ThemeStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useEventStore from '../stores/EventStore';
import useSubscriptionStore from '../stores/SubscriptionStore';
import styles from '../styles/EventDetailsStyles';

const EventDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { events, deleteEvent } = useEventStore();
    const { user } = useAuthStore();
    const { subscriptions, addSubscription, deleteSubscription, addPaidSubscription } = useSubscriptionStore();
    const { theme } = useThemeStore();
    const [showScanner, setShowScanner] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const event = events.find(e => e.id === parseInt(id));
    const isSubscribed = subscriptions.some(sub => sub.eventId === parseInt(id) && sub.userId === user?.id);
    const userSubscription = subscriptions.find(sub => sub.eventId === parseInt(id) && sub.userId === user?.id);
    const isOwner = event?.userId === user?.id;
    const isOrganizer = user?.role === 'organizer' || event?.organizers?.some(org => org.organizer?.id === user?.id);
    const isSpeaker = user?.role === 'speaker' || event?.speakers?.some(speaker => speaker?.speaker?.user?.id === user?.id);
    const canScanQR = isOrganizer || isSpeaker;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubscribe = async () => {
        if (!user) {
            Alert.alert('Ошибка', 'Пожалуйста, войдите в систему для подписки!');
            return;
        }

        if (isSubscribed && userSubscription) {
            deleteSubscription(userSubscription.id);
        } else {
            // Проверяем, платное ли мероприятие
            if (event.price && event.price > 0) {
                // Показываем подтверждение для платного мероприятия
                Alert.alert(
                    'Платное мероприятие',
                    `Стоимость подписки: ${event.price} монет. Ваш баланс: ${user.balance} монет. Продолжить?`,
                    [
                        { text: 'Отмена', style: 'cancel' },
                        {
                            text: 'Подписаться',
                            onPress: async () => {
                                try {
                                    // Используем метод для подписки на платное мероприятие
                                    const result = await addPaidSubscription(
                                        parseInt(id),
                                        user.id,
                                        event.price
                                    );
                                    
                                    if (result) {
                                        Alert.alert('Успех', 'Вы успешно подписались на мероприятие!');
                                    }
                                } catch (error) {
                                    console.error('Ошибка при подписке на платное мероприятие:', error);
                                    Alert.alert('Ошибка', 'Не удалось подписаться на мероприятие');
                                }
                            }
                        }
                    ]
                );
            } else {
                // Бесплатное мероприятие
                addSubscription({ eventId: parseInt(id), userId: user.id });
            }
        }
        closeModal();
    };

    const handleDelete = async () => {
        Alert.alert(
            'Подтверждение',
            'Вы уверены, что хотите удалить это мероприятие?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteEvent(event.id);
                            router.back();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось удалить мероприятие');
                        }
                    }
                }
            ]
        );
    };

    const handleQRScan = (data) => {
        try {
            const userData = JSON.parse(data);
            // Проверяем, подписан ли пользователь на текущее событие
            const isUserSubscribed = subscriptions.some(sub => 
                sub.eventId === parseInt(id) && sub.userId === userData.id
            );
            
            Alert.alert(
                'Информация о пользователе',
                `Имя: ${userData.name}\nEmail: ${userData.email}\nРоль: ${userData.role || 'Пользователь'}\nСтатус подписки: ${isUserSubscribed ? 'Подписан' : 'Не подписан'}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Ошибка', 'Неверный формат QR-кода');
        }
    };

    // Генерируем данные QR-кода для текущего пользователя
    const qrCodeData = JSON.stringify({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        eventId: parseInt(id)
    });

    const openMaps = (latitude, longitude) => {
        const url = Platform.select({
            ios: `maps:${latitude},${longitude}?q=${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`
        });

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Ошибка', 'Не удалось открыть карты');
            }
        });
    };

    const eventDate = new Date(event.date);
    const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: ru });
    
    // Функция для рендеринга текста с Markdown-разметкой
    const renderMarkdownText = (text) => {
        if (!text) return null;
        
        // Заменяем \n на реальные переносы строк
        let formattedText = text.replace(/\\n/g, '\n');
        
        // Разбиваем текст на блоки по пустым строкам
        const blocks = formattedText.split(/\n\s*\n/);
        
        return (
            <View>
                {blocks.map((block, blockIndex) => {
                    // Проверяем, является ли блок таблицей
                    const isTable = /^\|.*\|/.test(block);
                    
                    if (isTable) {
                        // Обрабатываем таблицу
                        return renderTable(block, blockIndex);
                    } else {
                        // Разбиваем блок на строки
                        const lines = block.split('\n');
                        
                        return (
                            <View key={`block-${blockIndex}`}>
                                {lines.map((line, lineIndex) => {
                                    // Проверяем, является ли строка горизонтальной чертой
                                    if (line.trim() === '---') {
                                        return (
                                            <View 
                                                key={`line-${lineIndex}`} 
                                                style={[styles.horizontalLine, { backgroundColor: theme.colors.border }]}
                                            />
                                        );
                                    }
                                    
                                    // Проверяем, является ли строка заголовком
                                    const isHeading = /^#{1,6}\s/.test(line);
                                    const headingLevel = line.match(/^(#{1,6})\s/)?.[1]?.length || 0;
                                    
                                    // Проверяем, содержит ли строка жирный текст (Markdown)
                                    const hasBold = /\*\*(.*?)\*\*/g.test(line);
                                    
                                    // Проверяем, содержит ли строка курсив (Markdown)
                                    const hasItalic = /\*(.*?)\*/g.test(line);
                                    
                                    // Проверяем, содержит ли строка подчеркивание (Markdown)
                                    const hasUnderline = /__(.*?)__/g.test(line);
                                    
                                    // Проверяем, содержит ли строка HTML-теги жирного текста
                                    const hasHtmlBold = /<b>(.*?)<\/b>/g.test(line);
                                    
                                    // Проверяем, содержит ли строка HTML-теги курсива
                                    const hasHtmlItalic = /<i>(.*?)<\/i>/g.test(line);
                                    
                                    // Проверяем, содержит ли строка ссылку
                                    const hasLink = /\[(.*?)\]\((.*?)\)/g.test(line);
                                    
                                    // Проверяем, является ли строка элементом списка
                                    const isListItem = /^\s*[-*+]\s/.test(line);
                                    
                                    // Если строка пустая, возвращаем пустой View
                                    if (!line.trim()) {
                                        return <View key={`line-${lineIndex}`} style={{ height: 8 }} />;
                                    }
                                    
                                    // Обрабатываем жирный текст (Markdown)
                                    let processedLine = line;
                                    if (hasBold) {
                                        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                                    }
                                    
                                    // Обрабатываем курсив (Markdown)
                                    if (hasItalic) {
                                        processedLine = processedLine.replace(/\*(.*?)\*/g, '<i>$1</i>');
                                    }
                                    
                                    // Обрабатываем подчеркивание (Markdown) как курсив
                                    if (hasUnderline) {
                                        processedLine = processedLine.replace(/__(.*?)__/g, '<i>$1</i>');
                                    }
                                    
                                    // Обрабатываем HTML-теги жирного текста
                                    if (hasHtmlBold) {
                                        processedLine = processedLine.replace(/<b>(.*?)<\/b>/g, '<b>$1</b>');
                                    }
                                    
                                    // Обрабатываем HTML-теги курсива
                                    if (hasHtmlItalic) {
                                        processedLine = processedLine.replace(/<i>(.*?)<\/i>/g, '<i>$1</i>');
                                    }
                                    
                                    // Обрабатываем ссылки
                                    if (hasLink) {
                                        processedLine = processedLine.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
                                    }
                                    
                                    // Удаляем Markdown-разметку заголовков
                                    if (isHeading) {
                                        processedLine = processedLine.replace(/^#{1,6}\s/, '');
                                    }
                                    
                                    // Удаляем Markdown-разметку списков
                                    if (isListItem) {
                                        processedLine = processedLine.replace(/^\s*[-*+]\s/, '• ');
                                    }
                                    
                                    // Определяем стиль текста в зависимости от типа
                                    let textStyle = [styles.description, { color: theme.colors.text }];
                                    if (isHeading) {
                                        textStyle = {
                                            ...textStyle,
                                            fontWeight: 'bold',
                                            fontSize: 18 - headingLevel,
                                        };
                                    }
                                    
                                    // Разбиваем строку на части, чтобы обработать HTML-теги
                                    const parts = processedLine.split(/(<b>.*?<\/b>|<i>.*?<\/i>)/g);
                                    
                                    return (
                                        <Text key={`line-${lineIndex}`} style={textStyle}>
                                            {parts.map((part, partIndex) => {
                                                // Проверяем, является ли часть жирным текстом
                                                const isBoldPart = /<b>(.*?)<\/b>/.test(part);
                                                
                                                // Проверяем, является ли часть курсивом
                                                const isItalicPart = /<i>(.*?)<\/i>/.test(part);
                                                
                                                if (isBoldPart) {
                                                    // Извлекаем текст из тегов
                                                    const boldText = part.replace(/<b>(.*?)<\/b>/, '$1');
                                                    return <Text key={`part-${partIndex}`} style={{ fontWeight: 'bold', color: theme.colors.text }}>{boldText}</Text>;
                                                } else if (isItalicPart) {
                                                    // Извлекаем текст из тегов
                                                    const italicText = part.replace(/<i>(.*?)<\/i>/, '$1');
                                                    return <Text key={`part-${partIndex}`} style={{ fontStyle: 'italic', color: theme.colors.text }}>{italicText}</Text>;
                                                } else {
                                                    return <Text key={`part-${partIndex}`} style={{ color: theme.colors.text }}>{part}</Text>;
                                                }
                                            })}
                                        </Text>
                                    );
                                })}
                            </View>
                        );
                    }
                })}
            </View>
        );
    };
    
    // Функция для рендеринга таблицы
    const renderTable = (tableText, blockIndex) => {
        // Разбиваем таблицу на строки
        const rows = tableText.split('\n').filter(row => row.trim());
        
        // Если таблица пустая, возвращаем null
        if (rows.length < 2) return null;
        
        // Получаем заголовки таблицы
        const headers = rows[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        
        // Получаем разделитель строк
        const separator = rows[1];
        
        // Получаем данные таблицы
        const data = rows.slice(2).map(row => {
            return row.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        });
        
        // Определяем ширину колонок
        const columnWidths = headers.map((_, colIndex) => {
            const allCells = [headers[colIndex], ...data.map(row => row[colIndex] || '')];
            return Math.max(...allCells.map(cell => cell.length));
        });
        
        return (
            <View key={`table-${blockIndex}`} style={[styles.tableContainer, { borderColor: theme.colors.border }]}>
                {/* Заголовки таблицы */}
                <View style={[styles.tableHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                    {headers.map((header, colIndex) => (
                        <View 
                            key={`header-${colIndex}`} 
                            style={[
                                styles.tableCell, 
                                styles.tableHeaderCell,
                                { width: columnWidths[colIndex] * 8 + 16, borderRightColor: theme.colors.border } // Примерная ширина
                            ]}
                        >
                            <Text style={[styles.tableHeaderText, { color: theme.colors.text }]}>{header}</Text>
                        </View>
                    ))}
                </View>
                
                {/* Данные таблицы */}
                {data.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                        {row.map((cell, colIndex) => (
                            <View 
                                key={`cell-${rowIndex}-${colIndex}`} 
                                style={[
                                    styles.tableCell, 
                                    { width: columnWidths[colIndex] * 8 + 16, borderRightColor: theme.colors.border } // Примерная ширина
                                ]}
                            >
                                <Text style={[styles.tableCellText, { color: theme.colors.text }]}>{cell}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    if (!event) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.errorText, { color: theme.colors.text }]}>Мероприятие не найдено</Text>
            </View>
        );
    }

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{event.name}</Text>
                    <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{formattedDate}</Text>
                </View>
                
                {event.image && (
                    <View style={[styles.imageContainer, { marginTop: 16 }]}>
                        <Image 
                            source={{ uri: event.image }} 
                            style={styles.eventImage} 
                            resizeMode="cover"
                        />
                    </View>
                )}
                
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Описание</Text>
                    {renderMarkdownText(event.description)}
                </View>

                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Место проведения</Text>
                    <TouchableOpacity 
                        style={styles.infoRow}
                        onPress={() => Boolean(event.venue?.latitude) && Boolean(event.venue?.longitude) ? openMaps(event.venue.latitude, event.venue.longitude) : null}
                    >
                        <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
                        <Text style={[styles.location, { color: theme.colors.text }]}>{Boolean(event.venue?.name) ? event.venue.name : 'Онлайн'}</Text>
                        {Boolean(event.venue?.latitude) && Boolean(event.venue?.longitude) && (
                            <MaterialIcons name="arrow-forward" size={20} color={theme.colors.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Информация</Text>
                    
                    <View style={styles.infoRow}>
                        <MaterialIcons name="people" size={24} color={theme.colors.primary} />
                        <Text style={[styles.infoText, { color: theme.colors.text }]}>
                            {Boolean(event.subscriptions) ? `${event.subscriptions.length || 0} участников` : '0 участников'}
                        </Text>
                    </View>
                    
                    {Boolean(event.price) && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="attach-money" size={24} color={theme.colors.primary} />
                            <Text style={[styles.infoText, { color: theme.colors.text }]}>
                                Стоимость: {event.price} ₽
                            </Text>
                        </View>
                    )}
                    
                    {Boolean(event.organizers) && event.organizers.length > 0 && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="person" size={24} color={theme.colors.primary} />
                            <Text style={[styles.infoText, { color: theme.colors.text }]}>
                                Организаторы: {event.organizers.map(org => org.organizer.name).join(', ')}
                            </Text>
                        </View>
                    )}
                    
                    {Boolean(event.speakers) && event.speakers.length > 0 && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="record-voice-over" size={24} color={theme.colors.primary} />
                            <Text style={[styles.infoText, { color: theme.colors.text }]}>
                                Спикеры: {event.speakers.map(speaker => speaker.speaker.name).join(', ')}
                            </Text>
                        </View>
                    )}
                </View>

                {Boolean(isOwner || isOrganizer || isSpeaker) && (
                    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Управление</Text>
                        <View style={styles.buttonContainer}>                           
                            {/* Показываем кнопку QR-кода для подписанных пользователей */}
                            {isSubscribed && (
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                                    onPress={() => setShowQRCode(true)}
                                >
                                    <MaterialIcons name="qr-code" size={24} color={theme.colors.buttonText} />
                                    <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Показать QR-код</Text>
                                </TouchableOpacity>
                            )}

                            {/* Кнопка сканирования QR-кода для организаторов и спикеров */}
                            {canScanQR && (
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                                    onPress={() => setShowScanner(true)}
                                >
                                    <MaterialIcons name="qr-code-scanner" size={24} color={theme.colors.buttonText} />
                                    <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Сканировать QR</Text>
                                </TouchableOpacity>
                            )}

                            {/* Кнопка подписки для участников */}
                            {!canScanQR && (
                                <TouchableOpacity
                                    style={[
                                        styles.button, 
                                        { 
                                            backgroundColor: isSubscribed 
                                                ? theme.colors.error 
                                                : theme.colors.primary 
                                        }
                                    ]}
                                    onPress={openModal}
                                >
                                    <MaterialIcons 
                                        name={isSubscribed ? "bookmark-remove" : "bookmark-add"} 
                                        size={24} 
                                        color={theme.colors.buttonText} 
                                    />
                                    <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                                        {isSubscribed ? "Отписаться" : "Подписаться"}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {Boolean(isOwner) && (
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: theme.colors.error }]}
                                    onPress={handleDelete}
                                >
                                    <MaterialIcons name="delete" size={24} color={theme.colors.buttonText} />
                                    <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Удалить</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
                
                {/* QR Scanner */}
                {Boolean(showScanner) && (
                    <QRScanner
                        onScan={handleQRScan}
                        onClose={() => setShowScanner(false)}
                    />
                )}
            </ScrollView>

            {/* Модальное окно с QR-кодом для подписанных участников */}
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
                    <View style={[styles.qrModalContent, { backgroundColor: theme.colors.surface }]}>
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
                        <Text style={[styles.qrText, { color: theme.colors.text }]}>
                            Ваш QR-код подписки на "{event?.name}"
                        </Text>
                        <TouchableOpacity
                            style={[styles.qrCloseButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => setShowQRCode(false)}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Модальное окно подтверждения подписки */}
            <Modal
                visible={isModalOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Подтверждение</Text>
                        <Text style={styles.modalText}>
                            Вы уверены, что хотите {isSubscribed ? 'отписаться от' : 'записаться на'} мероприятие "{event?.name}"?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={closeModal}
                            >
                                <Text style={styles.cancelButtonText}>Отмена</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleSubscribe}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {isSubscribed ? 'Отписаться' : 'Записаться'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default EventDetails; 