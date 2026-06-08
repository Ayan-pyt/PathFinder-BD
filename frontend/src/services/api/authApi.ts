import apiClient from './client';
import type { AuthResponse, LoginFormData, RegisterFormData } from '../../types';

export const authApi = {
  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  // Fetches full user with populated shortlistedCountries and targetUniversities
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; avatar?: string; journeyStage?: string }) => {
    const res = await apiClient.put('/auth/profile', data);
    return res.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await apiClient.put('/auth/change-password', data);
    return res.data;
  },
};

// Add this - Preference API calls
export const preferenceApi = {
  get: async () => {
    const res = await apiClient.get('/preferences');
    return res.data;
  },
  update: async (data: object) => {
    const res = await apiClient.put('/preferences', data);
    return res.data;
  },
  updatePriorities: async (priorities: object) => {
    const res = await apiClient.put('/preferences/priorities', priorities);
    return res.data;
  },
};