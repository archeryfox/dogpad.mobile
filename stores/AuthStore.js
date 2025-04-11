import { create } from 'zustand';
import api, { routes } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const roles = ['user', 'admin', 'speaker', 'organizer', 'db_admin'];

const useAuthStore = create((set, get) => ({
  user: null,
    token: null,
    error: null,
    loading: false,

    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    login: async (name, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(routes.login, { name, password });
            const user = response.data.user;
            // Корректное обращение к функции getApprovedRole
            const role = await useAuthStore.getState().getApprovedRole(user);
            set({ user: { ...user, role }, token: response.data.token, error: null, loading: false });
            await AsyncStorage.setItem('user', JSON.stringify({ ...user, role }));
            await AsyncStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error('Login error:', error);
            set({ error: error.response?.data?.message || 'Ошибка при авторизации', loading: false });
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(routes.register, { name, email, password });
            set({ user: response.data.user, error: null, loading: false });
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            await AsyncStorage.setItem('token', response.data.token); // Сохраняем токен
        } catch (error) {
            set({ error: 'Ошибка при регистрации', loading: false });
        }
    },

    logout: async () => {
        try {
            await api.post(routes.logout);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            set({ user: null, token: null });
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
        }
    },

    checkAuth: async () => {
        set({ loading: true, error: null });
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                set({ loading: false });
                return;
            }

            const response = await api.get(routes.check);
            const user = response.data;
            const role = await useAuthStore.getState().getApprovedRole(user);
            
            set({ 
                user: { ...user, role }, 
                token, 
                error: null, 
                loading: false 
            });
        } catch (error) {
            console.error('Check auth error:', error);
            set({ 
                error: error.response?.data?.message || 'Ошибка при проверке авторизации', 
                loading: false 
            });
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        }
    },

    updateProfile: async (userData) => {
        try {
            set({ loading: true, error: null });
            const token = await AsyncStorage.getItem('token');
            const response = await api.put(routes.check, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedUser = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser, loading: false });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Ошибка при обновлении профиля',
                loading: false,
            });
            return false;
        }
    },

    // Метод для получения одобренной роли
    getApprovedRole: async (user) => {
        if (!user || !user.RoleChangeRequest) return 'user';
        
        const approvedRequest = user.RoleChangeRequest
            .filter(request => request.status === 'approved')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]; // Последний одобренный запрос

        return approvedRequest ? roles[approvedRequest.requestedRoleId - 1] : roles[user.roleId - 1];
    },

    // Метод для запроса смены роли
    requestRoleChange: async (userId, requestedRoleId) => {
        set({ loading: true, error: null });
        try {
            await api.post(`${routes.requestRoleChange}`, { userId: userId - 0, requestedRoleId: requestedRoleId - 0 });
            set({ error: null, loading: false });
            alert('Запрос на смену роли отправлен администратору.');
        } catch (error) {
            console.error('Request role change error:', error);
            set({ error: error.response?.data?.message || 'Ошибка при отправке запроса на смену роли', loading: false });
        }
    },

    // Обновление профиля
    updateUser: async (newData, id) => {
        set({ loading: true, error: null });
        try {
            newData.roleId -= 0;
            const response = await api.put(`${routes.users}/${id - 0}`, newData);
            const user = { ...response.data, role: await get().getApprovedRole(response.data) };
            set({ user, error: null, loading: false });
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Update user error:', error);
            set({ error: error.response?.data?.message || 'Ошибка при обновлении профиля', loading: false });
        }
    },

    // Новый метод для получения обновленного пользователя с сервера
    fetchUpdatedUser: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(routes.check);
            const updatedUser = response.data;
            const role = await get().getApprovedRole(updatedUser);
            set({ user: { ...updatedUser, role }, error: null, loading: false });
            await AsyncStorage.setItem('user', JSON.stringify({ ...updatedUser, role }));
        } catch (error) {
            console.error('Fetch updated user error:', error);
            set({ error: error.response?.data?.message || 'Ошибка при получении обновленных данных пользователя', loading: false });
        }
    },

    // Функция для обновления баланса пользователя
    updateUserBalance: async (newBalance, id) => {
        try {
            // Обновляем баланс пользователя на фронтенде
            set((state) => {
                const updatedUser = { ...state.user, balance: newBalance-0 };
                return { user: updatedUser };
            });

            // Отправляем запрос на сервер для обновления данных о балансе
            await api.put(`${routes.users}/${id}`, { balance: newBalance-0 });
        } catch (error) {
            console.error("Ошибка при обновлении баланса пользователя:", error);
        }
    },
}));

export default useAuthStore; 