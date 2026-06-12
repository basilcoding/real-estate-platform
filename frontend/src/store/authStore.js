import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    isLoggingOut: false, // 👈 Added new state
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            set({ user: data.user, isAuthenticated: true, error: null });
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Login failed';
            set({ error: errorMsg });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true }); // 👈 Trigger animation
        try {
            // Run API call AND a 1.2-second delay concurrently for a smooth animation
            await Promise.all([
                api.post('/auth/logout'),
                new Promise(resolve => setTimeout(resolve, 1200))
            ]);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            set({ user: null, isAuthenticated: false, error: null, isLoggingOut: false });
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const { data } = await api.get('/auth/me');
            set({ user: data.user, isAuthenticated: true });
        } catch (error) {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearError: () => set({ error: null }),
}));