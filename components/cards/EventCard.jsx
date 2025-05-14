// dogpad.mobile/components/cards/EventCard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MaterialIcons } from '@expo/vector-icons';
import useThemeStore from '../../stores/ThemeStore';
import styles from '../../styles/cards/EventCardStyles';

const EventCard = ({ event, user, isSubscribed, onSubscribe, onUnsubscribe, inProfileFeed, inSession }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme } = useThemeStore();

    useEffect(() => {
        console.log('EventCard: Rendering event:', event?.id, event?.name);
    }, [event]);

    if (!event) {
        console.log('EventCard: No event data provided');
        return null;
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubscribe = () => {
        if (event?.id) {
            if (isSubscribed) {
                onUnsubscribe(event.id);
            } else {
                onSubscribe(event.id);
            }
            closeModal();
        }
    };

    const isSpeaker = event.speakers?.some(speaker => speaker?.speaker?.user?.id === user?.id) || inSession;

    const eventDate = event.date ? new Date(event.date) : new Date();
    const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: ru });
    
    // Проверяем, является ли мероприятие платным
    const isPaid = event.price && event.price > 0;
    const priceText = isPaid ? `${event.price} монет` : 'Бесплатно';
    
    // Функция для получения цвета категории
    const getCategoryColor = (categoryName) => {
        const colors = {
            'Концерт': '#F87171', // красный
            'Выставка': '#60A5FA', // синий
            'Мастер-класс': '#34D399', // зеленый
            'Лекция': '#A78BFA', // фиолетовый
            'Фестиваль': '#FBBF24', // желтый
            'Спорт': '#F97316', // оранжевый
            'Театр': '#EC4899', // розовый
            'Кино': '#8B5CF6', // пурпурный
            'Вечеринка': '#10B981', // изумрудный
            'Другое': '#6B7280', // серый
        };
        
        return colors[categoryName] || '#6B7280'; // серый по умолчанию
    };

    // Обработчик для форматирования описания с поддержкой Markdown
    const formatDescription = (text) => {
        if (!text) return '';

        // Заменяем \n на реальные переносы строк
        let formatted = text.replace(/\\n/g, '\n');

        // Сохраняем Markdown-разметку
        return formatted;
    };

    // Функция для рендеринга текста с Markdown-разметкой
    const renderMarkdownText = (text, numberOfLines) => {
        if (!text) return null;

        const formattedText = formatDescription(text);

        // Разбиваем текст на блоки по пустым строкам
        const blocks = formattedText.split(/\n\s*\n/);

        // Ограничиваем количество блоков, если указано
        const displayBlocks = numberOfLines ? blocks.slice(0, numberOfLines) : blocks;

        return (
            <View>
                {displayBlocks.map((block, blockIndex) => {
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

                                    // Если строка является заголовком
                                    if (isHeading) {
                                        const headingText = line.replace(/^#{1,6}\s/, '');
                                        const fontSize = 24 - (headingLevel - 1) * 2;

                                        return (
                                            <Text
                                                key={`line-${lineIndex}`}
                                                style={[
                                                    styles.heading,
                                                    { fontSize }
                                                ]}
                                            >
                                                {headingText}
                                            </Text>
                                        );
                                    }

                                    // Если строка содержит жирный текст (Markdown)
                                    if (hasBold) {
                                        const parts = line.split(/(\*\*.*?\*\*)/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        const boldText = part.slice(2, -2);
                                                        return (
                                                            <Text key={`part-${partIndex}`} style={styles.bold}>
                                                                {boldText}
                                                            </Text>
                                                        );
                                                    }
                                                    return <Text key={`part-${partIndex}`}>{part}</Text>;
                                                })}
                                            </Text>
                                        );
                                    }

                                    // Если строка содержит курсив (Markdown)
                                    if (hasItalic) {
                                        const parts = line.split(/(\*.*?\*)/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    if (part.startsWith('*') && part.endsWith('*')) {
                                                        const italicText = part.slice(1, -1);
                                                        return (
                                                            <Text key={`part-${partIndex}`} style={styles.italic}>
                                                                {italicText}
                                                            </Text>
                                                        );
                                                    }
                                                    return <Text key={`part-${partIndex}`}>{part}</Text>;
                                                })}
                                            </Text>
                                        );
                                    }

                                    // Если строка содержит подчеркивание (Markdown)
                                    if (hasUnderline) {
                                        const parts = line.split(/(__.*?__)/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    if (part.startsWith('__') && part.endsWith('__')) {
                                                        const underlineText = part.slice(2, -2);
                                                        return (
                                                            <Text key={`part-${partIndex}`} style={styles.underline}>
                                                                {underlineText}
                                                            </Text>
                                                        );
                                                    }
                                                    return <Text key={`part-${partIndex}`}>{part}</Text>;
                                                })}
                                            </Text>
                                        );
                                    }

                                    // Если строка содержит HTML-теги жирного текста
                                    if (hasHtmlBold) {
                                        const parts = line.split(/(<b>.*?<\/b>)/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    if (part.startsWith('<b>') && part.endsWith('</b>')) {
                                                        const boldText = part.slice(3, -4);
                                                        return (
                                                            <Text key={`part-${partIndex}`} style={styles.bold}>
                                                                {boldText}
                                                            </Text>
                                                        );
                                                    }
                                                    return <Text key={`part-${partIndex}`}>{part}</Text>;
                                                })}
                                            </Text>
                                        );
                                    }

                                    // Если строка содержит HTML-теги курсива
                                    if (hasHtmlItalic) {
                                        const parts = line.split(/(<i>.*?<\/i>)/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    if (part.startsWith('<i>') && part.endsWith('</i>')) {
                                                        const italicText = part.slice(3, -4);
                                                        return (
                                                            <Text key={`part-${partIndex}`} style={styles.italic}>
                                                                {italicText}
                                                            </Text>
                                                        );
                                                    }
                                                    return <Text key={`part-${partIndex}`}>{part}</Text>;
                                                })}
                                            </Text>
                                        );
                                    }

                                    // Если строка содержит ссылку
                                    if (hasLink) {
                                        const parts = line.split(/(\[(.*?)\]\((.*?)\))/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    if (part.match(/\[(.*?)\]\((.*?)\)/)) {
                                                        const linkText = part.match(/\[(.*?)\]/)[1];
                                                        const linkUrl = part.match(/\((.*?)\)/)[1];
                                                        return (
                                                            <Text
                                                                key={`part-${partIndex}`}
                                                                style={styles.link}
                                                                onPress={() => Linking.openURL(linkUrl)}
                                                            >
                                                                {linkText}
                                                            </Text>
                                                        );
                                                    }
                                                    return <Text key={`part-${partIndex}`}>{part}</Text>;
                                                })}
                                            </Text>
                                        );
                                    }

                                    // Если строка является элементом списка
                                    if (isListItem) {
                                        const listItemText = line.replace(/^\s*[-*+]\s/, '');
                                        return (
                                            <View key={`line-${lineIndex}`} style={styles.listItem}>
                                                <Text style={styles.listItemBullet}>•</Text>
                                                <Text style={styles.text}>{listItemText}</Text>
                                            </View>
                                        );
                                    }

                                    // Обычный текст
                                    return (
                                        <Text key={`line-${lineIndex}`} style={styles.text}>
                                            {line}
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
    const renderTable = (tableText, tableIndex) => {
        const lines = tableText.split('\n').filter(line => line.trim());
        
        // Если таблица пустая, возвращаем null
        if (lines.length < 2) return null;
        
        // Получаем заголовки и данные
        const headers = lines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        
        // Пропускаем разделительную строку (вторую строку)
        const rows = lines.slice(2).map(line => 
            line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
        );
        
        return (
            <View key={`table-${tableIndex}`} style={styles.table}>
                <View style={styles.tableHeader}>
                    {headers.map((header, index) => (
                        <Text key={`header-${index}`} style={[styles.tableHeaderCell, { flex: 1 }]}>
                            {header}
                        </Text>
                    ))}
                </View>
                
                {rows.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                            <Text key={`cell-${rowIndex}-${cellIndex}`} style={[styles.tableCell, { flex: 1 }]}>
                                {cell}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <TouchableOpacity 
            style={[
                styles.card, 
                { backgroundColor: theme.colors.cardBackground }
            ]}
            onPress={() => router.push({
                pathname: "/(app)/events/[id]",
                params: { id: event.id }
            })}
            activeOpacity={0.9}
        >
            {/* Карточка события */}
            <View>
                {/* Изображение события с градиентным оверлеем */}
                {event.image && (
                    <View>
                        <Image 
                            source={{ uri: event.image }} 
                            style={styles.eventImage}
                            resizeMode="cover"
                        />
                    </View>
                )}
                
                <View style={styles.cardContent}>
                    {/* Заголовок и дата */}
                    <View style={styles.cardHeader}>
                        <Text style={[styles.eventName, { color: theme.colors.text }]} numberOfLines={2}>
                            {event.name}
                        </Text>
                        <View style={styles.dateContainer}>
                            <MaterialIcons name="event" size={16} color={theme.colors.textSecondary} />
                            <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
                                {formattedDate}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Категории */}
                    {event.categories && event.categories.length > 0 && (
                        <View style={styles.categoriesContainer}>
                            {event.categories.map((cat, index) => {
                                // Поддержка обоих форматов данных
                                const category = cat.category || cat;
                                const categoryName = category.name;
                                const categoryColor = getCategoryColor(categoryName);
                                
                                return (
                                    <View 
                                        key={`cat-${index}`} 
                                        style={[
                                            styles.categoryBadge, 
                                            { backgroundColor: categoryColor }
                                        ]}
                                    >
                                        <Text style={styles.categoryText}>
                                            {categoryName}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                    
                    {/* Цена */}
                    <View style={styles.priceContainer}>
                        <Text style={[styles.priceText, { color: theme.colors.text }]}>
                            {priceText}
                        </Text>
                    </View>
                    
                    {/* Описание события (краткое) */}
                    {event.description && (
                        <View style={styles.cardBody}>
                            {renderMarkdownText(event.description, 2)}
                            <TouchableOpacity 
                                style={styles.readMoreButton}
                                onPress={() => router.push({
                                    pathname: "/(app)/events/[id]",
                                    params: { id: event.id }
                                })}
                            >
                                <Text style={styles.readMoreText}>Подробнее</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    
                    {/* Место проведения */}
                    {event.venue && (
                        <View style={styles.venueContainer}>
                            <View style={styles.venueRow}>
                                <MaterialIcons name="location-on" size={16} color={theme.colors.textSecondary} />
                                <Text style={[styles.venueName, { color: theme.colors.text }]}>
                                    {event.venue.name}
                                </Text>
                            </View>
                            {event.venue.address && (
                                <Text style={[styles.venueAddress, { color: theme.colors.textSecondary }]}>
                                    {event.venue.address}
                                </Text>
                            )}
                        </View>
                    )}
                    
                    {/* Количество участников */}
                    {event.participantsCount > 0 && (
                        <View style={styles.participantsContainer}>
                            <View style={styles.participantsRow}>
                                <MaterialIcons name="people" size={16} color={theme.colors.textSecondary} />
                                <Text style={[styles.participantsText, { color: theme.colors.textSecondary }]}>
                                    {event.participantsCount} {event.participantsCount === 1 ? 'участник' : 
                                    event.participantsCount < 5 ? 'участника' : 'участников'}
                                </Text>
                            </View>
                        </View>
                    )}
                    
                    {/* Кнопки действий */}
                    <View style={styles.cardFooter}>
                        {isSpeaker ? (
                            <View style={[styles.speakerBadge, { backgroundColor: theme.colors.successLight }]}>
                                <Text style={[styles.speakerText, { color: theme.colors.success }]}>
                                    Вы спикер
                                </Text>
                            </View>
                        ) : user ? (
                            <TouchableOpacity 
                                style={[
                                    styles.subscribeButton, 
                                    { 
                                        backgroundColor: isSubscribed ? 
                                            theme.colors.warningLight : 
                                            theme.colors.primary 
                                    }
                                ]}
                                onPress={openModal}
                            >
                                <Text style={[
                                    styles.subscribeButtonText, 
                                    { 
                                        color: isSubscribed ? 
                                            theme.colors.warning : 
                                            theme.colors.buttonText 
                                    }
                                ]}>
                                    {isSubscribed ? 'Отписаться' : 'Подписаться'}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
            
            {/* Модальное окно подтверждения */}
            <Modal
                visible={isModalOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            {isSubscribed ? 'Отписаться от события?' : 'Подписаться на событие?'}
                        </Text>
                        <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
                            {isSubscribed 
                                ? 'Вы уверены, что хотите отписаться от этого события? Вы больше не будете получать уведомления о нем.'
                                : 'Подписавшись на это событие, вы будете получать уведомления о любых изменениях и обновлениях.'}
                        </Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity 
                                style={[
                                    styles.modalButton, 
                                    { backgroundColor: theme.colors.backgroundSecondary }
                                ]}
                                onPress={closeModal}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                                    Отмена
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.modalButton, 
                                    { 
                                        backgroundColor: isSubscribed ? 
                                            theme.colors.warning : 
                                            theme.colors.primary 
                                    }
                                ]}
                                onPress={handleSubscribe}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.buttonText }]}>
                                    {isSubscribed ? 'Отписаться' : 'Подписаться'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    );
};

export default EventCard;