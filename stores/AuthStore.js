// dogpad.mobile/stores/AuthStore.js
import { create } from 'zustand';
import api, { routes } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNotificationStore from './NotificationStore';

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
    set({ loading: true, error: null, user: null, token: null });

    // Проверяем входные данные
    if (!name || !password) {
      set({
        error: 'Имя пользователя и пароль обязательны',
        loading: false
      });
      return false;
    }

    try {
      console.log('API Request: POST /auth/login');

      // Добавляем таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 секунд таймаут

      const response = await api.post(routes.login, { name, password }, {
        signal: controller.signal
      });

      clearTimeout(timeoutId); // Очищаем таймаут

      // Проверяем, что ответ содержит необходимые данные
      if (!response.data || !response.data.user || !response.data.token) {
        console.error('API Error: Неверный формат ответа', response.data);
        set({
          error: 'Неверный формат ответа от сервера',
          loading: false
        });
        return false;
      }

      const user = response.data.user;
      // Корректное обращение к функции getApprovedRole
      const role = await useAuthStore.getState().getApprovedRole(user);

      // Сохраняем данные пользователя и токен
      set({
        user: { ...user, role },
        token: response.data.token,
        error: null,
        loading: false
      });

      // Сохраняем в AsyncStorage
      try {
        await AsyncStorage.setItem('user', JSON.stringify({ ...user, role }));
        await AsyncStorage.setItem('token', response.data.token);
      } catch (storageError) {
        console.error('Error saving to AsyncStorage:', storageError);
        // Не прерываем процесс авторизации из-за ошибки сохранения
      }

      return true;
    } catch (error) {
      // Обработка ошибки таймаута
      if (error.name === 'AbortError') {
        console.error('API Error: Login request timeout');
        set({
          error: 'Превышено время ожидания ответа от сервера',
          loading: false
        });
        return false;
      }

      // Обработка ошибки сети
      if (!error.response) {
        console.error('API Error: Network error', error.message);
        set({
          error: 'Ошибка сети. Проверьте подключение к интернету.',
          loading: false
        });
        return false;
      }

      // Обработка ошибки сервера
      console.error('API Error: /auth/login', error.response?.status, error.response?.data || {});

      let errorMessage = 'Ошибка при авторизации';

      // Определяем тип ошибки по статусу
      switch (error.response?.status) {
        case 400:
          errorMessage = 'Неверные учетные данные';
          break;
        case 401:
          errorMessage = 'Неверное имя пользователя или пароль';
          break;
        case 403:
          errorMessage = 'Доступ запрещен';
          break;
        case 404:
          errorMessage = 'Пользователь не найден';
          break;
        case 500:
          errorMessage = 'Ошибка сервера. Попробуйте позже.';
          break;
        default:
          errorMessage = error.response?.data?.message || 'Ошибка при авторизации';
      }

      set({
        error: errorMessage,
        loading: false
      });

      return false;
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
      useNotificationStore.getState().showNotification('Запрос на смену роли отправлен администратору.', 'success');
    } catch (error) {
      console.error('Request role change error:', error);
      set({ error: error.response?.data?.message || 'Ошибка при отправке запроса на смену роли', loading: false });
      useNotificationStore.getState().showNotification('Ошибка при отправке запроса на смену роли', 'error');
    }
  },

  // Обновление профиля
  updateUser: async (newData, id) => {
    set({ loading: true, error: null });
    try {
      // Получаем текущего пользователя из состояния
      const currentUser = get().user;
      const userId = id ? (id - 0) : currentUser.id;
      
      // Создаем объект с данными для обновления
      const dataToUpdate = { ...newData };
      
      // Проверяем roleId - если не указан или null, используем текущий roleId пользователя
      if (dataToUpdate.roleId === undefined || dataToUpdate.roleId === null) {
        dataToUpdate.roleId = currentUser.roleId;
      } else {
        dataToUpdate.roleId = dataToUpdate.roleId - 0;
      }
      
      const response = await api.put(`${routes.users}/${userId}`, dataToUpdate);
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
