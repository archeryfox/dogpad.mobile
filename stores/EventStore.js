import { create } from 'zustand';
import api, { routes } from "./axios.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useEventStore = create((set, get) => ({
    events: [],
    filteredEvents: [],
    currentEvent: null,
    isLoading: false,
    error: null,
    searchTerm: '',
    selectedCategory: null,
    dateFilter: null, // 'upcoming', 'past', 'today', 'this-week', 'this-month' или null для всех
    sortOption: 'date', // 'date' или 'name'

    setEvents: (events) => {
        set({ events });
        get().applyFilters();
    },
    setCurrentEvent: (event) => set({ currentEvent: event }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    
    // Новые функции для поиска и фильтрации
    setSearchTerm: (searchTerm) => {
        set({ searchTerm });
        get().applyFilters();
    },
    
    setSelectedCategory: (categoryId) => {
        set({ selectedCategory: categoryId });
        get().applyFilters();
    },
    
    setDateFilter: (dateFilter) => {
        set({ dateFilter });
        get().applyFilters();
    },
    
    setSortOption: (sortOption) => {
        set({ sortOption });
        get().applyFilters();
    },
    
    resetFilters: () => {
        set({ 
            searchTerm: '', 
            selectedCategory: null, 
            dateFilter: null,
            sortOption: 'date'
        });
        get().applyFilters();
    },
    
    applyFilters: () => {
        const { events, searchTerm, selectedCategory, dateFilter, sortOption } = get();
        
        let filtered = [...events];
        
        // Фильтрация по поисковому запросу
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(event => 
                event.name.toLowerCase().includes(searchLower) || 
                (event.description && event.description.toLowerCase().includes(searchLower))
            );
        }
        
        // Фильтрация по категории
        if (selectedCategory) {
            filtered = filtered.filter(event => {
                if (!event.categories) return false;
                return event.categories.some(cat => cat.id === selectedCategory);
            });
        }
        
        // Фильтрация по дате
        if (dateFilter) {
            const now = new Date();
            
            switch(dateFilter) {
                case 'upcoming':
                    filtered = filtered.filter(event => new Date(event.date) > now);
                    break;
                case 'past':
                    filtered = filtered.filter(event => new Date(event.date) < now);
                    break;
                case 'today':
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    filtered = filtered.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate >= today && eventDate < tomorrow;
                    });
                    break;
                case 'this-week':
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 7);
                    
                    filtered = filtered.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate >= startOfWeek && eventDate < endOfWeek;
                    });
                    break;
                case 'this-month':
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    
                    filtered = filtered.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate >= startOfMonth && eventDate <= endOfMonth;
                    });
                    break;
            }
        }
        
        // Сортировка в зависимости от выбранной опции
        if (sortOption === 'date') {
            // Сортировка по дате (сначала ближайшие)
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortOption === 'name') {
            // Сортировка по названию (в алфавитном порядке)
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        set({ filteredEvents: filtered });
    },

    fetchEvents: async () => {
        console.log('EventStore: Starting to fetch events');
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(routes.events);
            console.log('EventStore: Successfully fetched events:', response.data.length);
            
            // Устанавливаем events и применяем фильтры
            set({ events: response.data, isLoading: false });
            get().applyFilters();
            
            return response.data;
        } catch (error) {
            console.error('EventStore: Error fetching events:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({ 
                error: error.response?.data?.message || 'Ошибка при загрузке событий', 
                isLoading: false 
            });
            throw error;
        }
    },

    fetchEventById: async (id) => {
        console.log('EventStore: Fetching event by ID:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`${routes.events}/${id}`);
            console.log('EventStore: Successfully fetched event:', response.data);
            set({ currentEvent: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            console.error('EventStore: Error fetching event:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({ 
                error: error.response?.data?.message || 'Ошибка при загрузке события', 
                isLoading: false 
            });
            throw error;
        }
    },

    getEventById: (id) => {
        const { events, currentEvent } = get();
        return currentEvent?.id === id ? currentEvent : events.find(event => event.id === id);
    },

    createEvent: async (eventData) => {
        console.log('EventStore: Creating new event');
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(routes.events, eventData);
            console.log('EventStore: Successfully created event:', response.data);
            const newEvent = response.data;
            
            set(state => {
                const updatedEvents = [...state.events, newEvent];
                return { events: updatedEvents, isLoading: false };
            });
            
            get().applyFilters();
            return newEvent;
        } catch (error) {
            console.error('EventStore: Error creating event:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({ 
                error: error.response?.data?.message || 'Ошибка при создании события', 
                isLoading: false 
            });
            throw error;
        }
    },

    updateEvent: async (id, eventData) => {
        console.log('EventStore: Updating event:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`${routes.events}/${id}`, eventData);
            console.log('EventStore: Successfully updated event:', response.data);
            const updatedEvent = response.data;
            
            set(state => {
                const updatedEvents = state.events.map(event => 
                    event.id === id ? updatedEvent : event
                );
                return { events: updatedEvents, isLoading: false };
            });
            
            get().applyFilters();
            return updatedEvent;
        } catch (error) {
            console.error('EventStore: Error updating event:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({ 
                error: error.response?.data?.message || 'Ошибка при обновлении события', 
                isLoading: false 
            });
            throw error;
        }
    },

    deleteEvent: async (id) => {
        console.log('EventStore: Deleting event:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`${routes.events}/${id}`);
            console.log('EventStore: Successfully deleted event:', id);
            
            set(state => {
                const updatedEvents = state.events.filter(event => event.id !== id);
                return { events: updatedEvents, isLoading: false };
            });
            
            get().applyFilters();
            return true;
        } catch (error) {
            console.error('EventStore: Error deleting event:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({ 
                error: error.response?.data?.message || 'Ошибка при удалении события', 
                isLoading: false 
            });
            throw error;
        }
    },

    subscribeToEvent: async (eventId) => {
        console.log('EventStore: Subscribing to event:', eventId);
        try {
            set({ isLoading: true, error: null });
            const token = await AsyncStorage.getItem('token');
            await api.post(
                `${routes.events}/${eventId}/subscribe`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('EventStore: Successfully subscribed to event:', eventId);
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error('EventStore: Error subscribing to event:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({
                error: error.response?.data?.message || 'Ошибка при подписке на мероприятие',
                isLoading: false,
            });
            return false;
        }
    },

    unsubscribeFromEvent: async (eventId) => {
        console.log('EventStore: Unsubscribing from event:', eventId);
        try {
            set({ isLoading: true, error: null });
            const token = await AsyncStorage.getItem('token');
            await api.post(
                `${routes.events}/${eventId}/unsubscribe`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('EventStore: Successfully unsubscribed from event:', eventId);
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error('EventStore: Error unsubscribing from event:', error);
            console.error('EventStore: Error details:', error.response?.data || error.message);
            set({
                error: error.response?.data?.message || 'Ошибка при отписке от мероприятия',
                isLoading: false,
            });
            return false;
        }
    },
}));

export default useEventStore; 