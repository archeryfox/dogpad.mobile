import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/theme';

const useThemeStore = create(
    persist(
        (set) => ({
            isDarkMode: true, // Set default to dark mode
            theme: darkTheme,
            toggleTheme: () => set((state) => {
                const newIsDarkMode = !state.isDarkMode;
                return {
                    isDarkMode: newIsDarkMode,
                    theme: newIsDarkMode ? darkTheme : lightTheme,
                };
            }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useThemeStore; 