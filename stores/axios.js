import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// The base URL for API requests
const API_URL = 'https://timapad666.onrender.com'; 
const BACKUP_SERVER_URL = 'https://dogpad-saver-4uah.onrender.com';

// Create an instance of axios with the base URL of the API
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Добавляем перехватчик для установки токена авторизации
api.interceptors.request.use(async (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // Список публичных маршрутов, которые не требуют авторизации
    const publicRoutes = [
        '/auth/login',
        '/auth/register',
        '/events'  // Добавляем маршрут событий в публичные
    ];
    
    // Проверяем, является ли текущий маршрут публичным
    const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
    
    // Если маршрут не публичный, добавляем токен авторизации
    if (!isPublicRoute) {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
    response => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    error => {
        console.error('API Error:', error.config?.url, error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const routes = {
    users: "/users",
    categories: "/categories",
    eventCategories: "/event-categories",
    events: "/events",
    eventSpeakers: "/event-speakers",
    roles: "/roles",
    speakers: "/speakers",
    subscriptions: "/subscriptions",
    transactions: "/transactions",
    venues: "/venues",
    login: "/auth/login",
    register: "/auth/register",
    check: "/profile",
    requestRoleChange: "/role-change-requests",
    backups: `${BACKUP_SERVER_URL}/backups`,
    logs: `${BACKUP_SERVER_URL}/logs`,
}

export default api; 