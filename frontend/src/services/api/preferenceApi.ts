import apiClient from './client';
import type { UserPreference } from '../../types';

export const preferenceApi = {
  get: async () => {
    const res = await apiClient.get('/preferences');
    return res.data;
  },
  update: async (data: Partial<UserPreference>) => {
    const res = await apiClient.put('/preferences', data);
    return res.data;
  },
  updatePriorities: async (priorities: UserPreference['priorities']) => {
    const res = await apiClient.put('/preferences/priorities', priorities);
    return res.data;
  },
};