// dogpad.mobile/stores/TransactionStore.js
import { create } from 'zustand';
import api, { routes } from "./axios.js";
import useAuthStore from './AuthStore.js';
import useNotificationStore from './NotificationStore';

/**
 * Хранилище для управления транзакциями
 *
 * API эндпоинты для транзакций:
 * - GET /transactions - получить все транзакции
 * - GET /transactions/:id - получить транзакцию по ID
 * - POST /transactions - создать новую транзакцию (используется для создания платежей)
 * - PUT /transactions/:id - обновить транзакцию
 * - DELETE /transactions/:id - удалить транзакцию
 */
export const useTransactionsStore = create((set, get) => ({
    transactions: [],

    // Получение списка транзакций
    fetchTransactions: async () => {
        try {
            const response = await api.get(routes.transactions);
            set({ transactions: response.data });
        } catch (error) {
            console.error("Ошибка при загрузке транзакций:", error);
            useNotificationStore.getState().showNotification("Ошибка при загрузке транзакций", "error");
        }
    },

    // Добавление новой транзакции
    addTransaction: async (transactionData) => {
        try {
            // Проверим, если мероприятие и сумма правильные
            if (!transactionData.amount || !transactionData.userId || !transactionData.eventId) {
                console.error("Ошибка: Не все данные для транзакции предоставлены.");
                useNotificationStore.getState().showNotification("Не все данные для транзакции предоставлены", "error");
                return null;
            }

            // Отправка данных на сервер для создания транзакции
            const response = await api.post(routes.transactions, transactionData);

            // Обновляем список транзакций
            set((state) => ({
                transactions: [...state.transactions, response.data]
            }));

            return response.data;
        } catch (error) {
            console.error("Ошибка при добавлении транзакции:", error);
            useNotificationStore.getState().showNotification(
                error.response?.data?.error || "Ошибка при добавлении транзакции", 
                "error"
            );
            return null;
        }
    },

    /**
     * Создание транзакции и обновление баланса в одной операции
     * Использует эндпоинт POST /transactions/
     *
     * @param {Object} transactionData - данные для создания транзакции
     * @param {number} transactionData.amount - сумма транзакции
     * @param {number} transactionData.userId - ID пользователя
     * @param {number} transactionData.eventId - ID мероприятия
     * @returns {Promise<Object|null>} - созданная транзакция или null в случае ошибки
     */
    createPayment: async (transactionData) => {
        try {
            // Проверяем наличие всех необходимых данных
            if (!transactionData.amount || !transactionData.userId || !transactionData.eventId) {
                console.error("Ошибка: Не все данные для транзакции предоставлены.");
                useNotificationStore.getState().showNotification("Не все данные для транзакции предоставлены", "error");
                return null;
            }

            // Отправка данных на сервер для создания транзакции, обновления баланса и создания подписки
            // Используем стандартный эндпоинт /transactions/ для создания транзакции
            console.log("Отправляем запрос на создание платежа:", `${routes.transactions}`, transactionData);
            const response = await api.post(`${routes.transactions}/`, transactionData);
            console.log("Ответ от сервера:", response.data);
            console.log("Структура ответа:", JSON.stringify(response.data));

            // Обновляем список транзакций
            if (response.data) {
                set((state) => ({
                    transactions: [...state.transactions, response.data],
                }));
            }

            // Обновляем баланс пользователя в AuthStore
            const authStore = useAuthStore.getState();
            const { user } = authStore;
            
            if (user && user.balance !== undefined) {
                const newBalance = user.balance - transactionData.amount;
                console.log("Обновляем баланс пользователя:", user.balance, "->", newBalance);
                await authStore.updateUserBalance(newBalance, transactionData.userId);
            } else {
                console.error("Не удалось обновить баланс: пользователь или его баланс не найден");
            }

            return response.data;
        } catch (error) {
            console.error("Ошибка при создании платежа:", error);
            useNotificationStore.getState().showNotification(
                error.response?.data?.error || "Ошибка при создании платежа", 
                "error"
            );
            return null;
        }
    }
}));

export default useTransactionsStore;