import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
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
                                        const parts = line.split(/(\[.*?\]\(.*?\))/g);

                                        return (
                                            <Text key={`line-${lineIndex}`} style={styles.text}>
                                                {parts.map((part, partIndex) => {
                                                    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                                                    if (linkMatch) {
                                                        const linkText = linkMatch[1];
                                                        const linkUrl = linkMatch[2];

                                                        return (
                                                            <Text
                                                                key={`part-${partIndex}`}
                                                                style={styles.link}
                                                                onPress={() => {
                                                                    // Здесь можно добавить обработку нажатия на ссылку
                                                                    console.log('Link pressed:', linkUrl);
                                                                }}
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
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.listItemText}>{listItemText}</Text>
                                            </View>
                                        );
                                    }

                                    // Если строка не содержит специальной разметки
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
    const renderTable = (tableText, blockIndex) => {
        const rows = tableText.split('\n').filter(row => row.trim());

        // Проверяем, есть ли заголовок таблицы
        const hasHeader = rows.length > 0 && /^\|.*\|/.test(rows[0]);

        // Проверяем, есть ли разделитель заголовка
        const hasSeparator = rows.length > 1 && /^\|[\s-:|]+\|/.test(rows[1]);

        // Определяем, с какой строки начинать данные
        const dataStartIndex = hasHeader && hasSeparator ? 2 : 0;

        // Получаем заголовки таблицы
        const headers = hasHeader ? rows[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim()) : [];

        // Получаем данные таблицы
        const data = rows.slice(dataStartIndex).map(row => {
            return row.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        });

        return (
            <View key={`table-${blockIndex}`} style={styles.table}>
                {hasHeader && (
                    <View style={styles.tableHeader}>
                        {headers.map((header, headerIndex) => (
                            <Text key={`header-${headerIndex}`} style={styles.tableHeaderCell}>
                                {header}
                            </Text>
                        ))}
                    </View>
                )}
                {data.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                            <Text key={`cell-${cellIndex}`} style={styles.tableCell}>
                                {cell}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    // Функция для открытия адреса в приложении карт
    const openMaps = (address) => {
        const query = encodeURIComponent(address);
        
        // Разные схемы URL для iOS и Android
        const url = Platform.select({
            ios: `maps://maps.apple.com/?q=${query}`,
            android: `geo:0,0?q=${query}`
        });
        
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    // Используем веб-версию Google Maps как запасной вариант
                    const webUrl = `https://maps.google.com/?q=${query}`;
                    return Linking.openURL(webUrl);
                }
            })
            .catch(err => console.error('Ошибка при открытии карты:', err));
    };

    const renderEventFooter = () => {
        if (isSpeaker) {
            return (
                <View style={styles.cardFooter}>
                    <View style={styles.speakerBadge}>
                        <Text style={styles.speakerText}>Вы спикер</Text>
                    </View>
                </View>
            );
        } else if (isSubscribed) {
            return (
                <View style={styles.cardFooter}>
                    <TouchableOpacity 
                        style={[styles.subscribeButton, { backgroundColor: theme.colors.error }]} 
                        onPress={openModal}
                    >
                        <Text style={styles.subscribeButtonText}>Отписаться</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (event.participantsLimit && event.participants && event.participants.length >= event.participantsLimit) {
            return (
                <View style={styles.cardFooter}>
                    <TouchableOpacity style={[styles.subscribeButton, { backgroundColor: theme.colors.disabled }]} disabled>
                        <Text style={styles.subscribeButtonText}>Мест нет</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.cardFooter}>
                    <TouchableOpacity 
                        style={[styles.subscribeButton, { backgroundColor: theme.colors.primary }]} 
                        onPress={openModal}
                    >
                        <Text style={styles.subscribeButtonText}>Записаться</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const renderParticipantsCount = () => {
        if (event.participants) {
            const count = event.participants.length;
            const limit = event.participantsLimit;
            
            if (limit) {
                return (
                    <View style={styles.participantsContainer}>
                        <Text style={[styles.participantsText, { color: theme.colors.text }]}>
                            Участников: {count}/{limit}
                        </Text>
                    </View>
                );
            } else {
                return (
                    <View style={styles.participantsContainer}>
                        <Text style={[styles.participantsText, { color: theme.colors.text }]}>
                            Участников: {count}
                        </Text>
                    </View>
                );
            }
        }
        return null;
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => {
                console.log('EventCard: Card pressed, navigating to event:', event.id);
                router.push({
                    pathname: "/(app)/events/[id]",
                    params: { id: event.id }
                });
            }}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.eventName, { color: theme.colors.text }]}>{event.name}</Text>
                    <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>{formattedDate}</Text>
                </View>

                {event.image && (
                    <Image
                        source={{ uri: event.image }}
                        style={styles.eventImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.cardBody}>
                    {/* <Text style={styles.eventDescription} numberOfLines={3}>
                        {event.description ? formatDescription(event.description) : 'Описание отсутствует'}
                    </Text>
                     */}
                    {event.categories && event.categories.length > 0 && (
                        <View style={styles.categoriesContainer}>
                            {event.categories.map((category, index) => (
                                <View key={index} style={[styles.categoryBadge, { backgroundColor: theme.colors.light }]}>
                                    <Text style={[styles.categoryText, { color: theme.colors.textSecondary }]}>
                                        {category.category.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {event.venue && (
                        <View style={styles.venueContainer}>
                            <Text style={[styles.venueLabel, { color: theme.colors.textSecondary }]}>Место проведения:</Text>
                            <Text style={[styles.venueName, { color: theme.colors.text }]}>{event.venue.name}</Text>
                            <TouchableOpacity onPress={() => openMaps(event.venue.address)}>
                                <Text style={[styles.venueAddress, styles.link, { color: theme.colors.link }]}>
                                    {event.venue.address}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    
                    {renderParticipantsCount()}
                </View>

                {renderEventFooter()}
            </View>

            <Modal
                visible={isModalOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.backdrop }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Подписка на мероприятие</Text>
                        <Text style={[styles.modalText, { color: theme.colors.text }]}>
                            Вы уверены, что хотите {isSubscribed ? 'отписаться от' : 'подписаться на'} мероприятие "{event.name}"?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.colors.light }]}
                                onPress={closeModal}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>Отмена</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modalButton, 
                                    styles.confirmButton, 
                                    { 
                                        backgroundColor: isSubscribed 
                                            ? theme.colors.error 
                                            : theme.colors.primary 
                                    }
                                ]}
                                onPress={handleSubscribe}
                            >
                                <Text style={[styles.confirmButtonText, { color: theme.colors.buttonText }]}>
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