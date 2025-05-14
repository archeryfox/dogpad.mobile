// dogpad.mobile/stores/QRCodeStore.js
import { create } from 'zustand';
import api, { routes } from './axios';
import useSubscriptionStore from './SubscriptionStore';
import useAuthStore from './AuthStore';

const useQRCodeStore = create((set, get) => ({
    isScanning: false,
    showQRCode: false,
    currentEventId: null,
    scanResult: null,
    error: null,
    
    // Управление показом QR-кода
    setShowQRCode: (show) => set({ showQRCode: show }),
    
    // Управление режимом сканирования
    setScanning: (isScanning) => set({ isScanning }),
    
    // Установка текущего события
    setCurrentEventId: (eventId) => set({ currentEventId: eventId }),
    
    // Очистка результатов сканирования
    clearScanResult: () => set({ scanResult: null }),
    
    // Генерирует данные QR-кода для пользователя и события
    generateQRData: () => {
        const user = useAuthStore.getState().user;
        const eventId = get().currentEventId;
        
        if (!user || !eventId) {
            set({ error: 'Пользователь или событие не определены' });
            return null;
        }
        
        const qrData = JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            eventId: parseInt(eventId)
        });
        
        return qrData;
    },
    
    // Проверка подписки по данным QR-кода
    checkSubscription: (qrData, eventId) => {
        try {
            if (!qrData) return false;
            
            const userData = JSON.parse(qrData);
            const { subscriptions } = useSubscriptionStore.getState();
            
            // Проверяем, подписан ли пользователь на указанное событие
            const isSubscribed = subscriptions.some(sub => 
                sub.eventId === parseInt(eventId) && sub.userId === userData.id
            );
            
            set({ 
                scanResult: {
                    user: userData,
                    isSubscribed: isSubscribed,
                    scannedAt: new Date()
                }
            });
            
            return isSubscribed;
        } catch (error) {
            console.error('Error checking subscription:', error);
            set({ error: 'Ошибка при проверке подписки' });
            return false;
        }
    },
    
    // Обработка результата сканирования
    handleScan: (data) => {
        try {
            const eventId = get().currentEventId;
            if (!eventId) {
                set({ error: 'Событие не определено' });
                return null;
            }
            
            const userData = JSON.parse(data);
            const { subscriptions } = useSubscriptionStore.getState();
            
            // Проверяем, подписан ли пользователь на текущее событие
            const isUserSubscribed = subscriptions.some(sub => 
                sub.eventId === parseInt(eventId) && sub.userId === userData.id
            );
            
            const result = {
                user: userData,
                isSubscribed: isUserSubscribed,
                scannedAt: new Date(),
                eventId: eventId
            };
            
            set({ scanResult: result, isScanning: false });
            return result;
        } catch (error) {
            console.error('Error handling QR scan:', error);
            set({ 
                error: 'Неверный формат QR-кода',
                isScanning: false
            });
            return null;
        }
    },
    
    // Сохранение истории сканирований
    scanHistory: [],
    
    // Добавление записи в историю сканирований
    addToScanHistory: (scanResult) => {
        if (!scanResult) return;
        
        set(state => ({
            scanHistory: [scanResult, ...state.scanHistory].slice(0, 100) // Хранить только последние 100 записей
        }));
    },
    
    // Очистка истории сканирований
    clearScanHistory: () => set({ scanHistory: [] })
}));

export default useQRCodeStore; 