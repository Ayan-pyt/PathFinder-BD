import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import apiClient from '../services/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('pf_token', token);
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      // Call this after shortlisting to get populated data from server
      refreshUser: async () => {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data?.user) {
            set({ user: res.data.user });
          }
        } catch (error) {
          // Silent fail - don't break UI if refresh fails
          console.error('Failed to refresh user data:', error);
        }
      },

      logout: () => {
        localStorage.removeItem('pf_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'pf_auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
);