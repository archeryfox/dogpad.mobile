import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useThemeStore from '../../stores/ThemeStore';
import useCategoryStore from '../../stores/CategoryStore';
import useEventStore from '../../stores/EventStore';

const EventFilters = () => {
    const { theme } = useThemeStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { 
        searchTerm, 
        setSearchTerm, 
        selectedCategory, 
        setSelectedCategory,
        sortOption,
        setSortOption,
        resetFilters
    } = useEventStore();

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Получить название выбранной категории
    const getSelectedCategoryName = () => {
        if (!selectedCategory) return 'Все категории';
        const category = categories.find(cat => cat.id === selectedCategory);
        return category ? category.name : 'Все категории';
    };

    // Получить название выбранной сортировки
    const getSortOptionName = () => {
        switch (sortOption) {
            case 'date':
                return 'По дате';
            case 'name':
                return 'По названию';
            default:
                return 'По дате';
        }
    };

    // Обработчик выбора категории
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowCategoryModal(false);
    };

    // Обработчик выбора сортировки
    const handleSortSelect = (option) => {
        setSortOption(option);
        setShowSortModal(false);
    };

    // Обработчик очистки фильтров
    const handleResetFilters = () => {
        resetFilters();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Лента мероприятий</Text>
            
            {/* Поле поиска */}
            <View style={[styles.searchContainer, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
            }]}>
                <MaterialIcons name="search" size={24} color={theme.colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder="Поиск по названию"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                    <TouchableOpacity onPress={() => setSearchTerm('')}>
                        <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                ) : null}
            </View>
            
            {/* Фильтры */}
            <View style={styles.filtersContainer}>
                <View style={styles.filterRow}>
                    <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
                        Фильтр по категории:
                    </Text>
                    
                    <TouchableOpacity 
                        style={[styles.filterButton, { 
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                        }]}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>
                            {getSelectedCategoryName()}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.filterRow}>
                    <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
                        Сортировать по:
                    </Text>
                    
                    <TouchableOpacity 
                        style={[styles.filterButton, { 
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                        }]}
                        onPress={() => setShowSortModal(true)}
                    >
                        <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>
                            {getSortOptionName()}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                
                {(searchTerm || selectedCategory) ? (
                    <TouchableOpacity 
                        style={[styles.resetButton, { 
                            backgroundColor: theme.colors.errorLight,
                        }]}
                        onPress={handleResetFilters}
                    >
                        <Text style={[styles.resetButtonText, { color: theme.colors.error }]}>
                            Сбросить фильтры
                        </Text>
                        <MaterialIcons name="close" size={18} color={theme.colors.error} />
                    </TouchableOpacity>
                ) : null}
            </View>
            
            {/* Модальное окно выбора категории */}
            <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { 
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Выберите категорию</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <MaterialIcons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={[{ id: null, name: 'Все категории' }, ...categories]}
                            keyExtractor={item => (item.id ? item.id.toString() : 'all')}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        selectedCategory === item.id && {
                                            backgroundColor: theme.colors.primaryLight,
                                        }
                                    ]}
                                    onPress={() => handleCategorySelect(item.id)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        { color: theme.colors.text },
                                        selectedCategory === item.id && { 
                                            color: theme.colors.primary,
                                            fontWeight: 'bold' 
                                        }
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {selectedCategory === item.id && (
                                        <MaterialIcons 
                                            name="check" 
                                            size={20} 
                                            color={theme.colors.primary} 
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
            
            {/* Модальное окно выбора сортировки */}
            <Modal
                visible={showSortModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSortModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { 
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Сортировать по</Text>
                            <TouchableOpacity onPress={() => setShowSortModal(false)}>
                                <MaterialIcons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={[
                                { id: 'date', name: 'По дате' },
                                { id: 'name', name: 'По названию' },
                            ]}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        sortOption === item.id && {
                                            backgroundColor: theme.colors.primaryLight,
                                        }
                                    ]}
                                    onPress={() => handleSortSelect(item.id)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        { color: theme.colors.text },
                                        sortOption === item.id && { 
                                            color: theme.colors.primary,
                                            fontWeight: 'bold' 
                                        }
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {sortOption === item.id && (
                                        <MaterialIcons 
                                            name="check" 
                                            size={20} 
                                            color={theme.colors.primary} 
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    filtersContainer: {
        marginBottom: 16,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 180,
    },
    filterButtonText: {
        fontSize: 14,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 4,
    },
    resetButtonText: {
        marginRight: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        maxHeight: '70%',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginBottom: 4,
    },
    modalItemText: {
        fontSize: 16,
    },
});

export default EventFilters; 