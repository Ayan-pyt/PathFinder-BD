import apiClient from './client';

export const countriesApi = {
  getAll: async () => { const res = await apiClient.get('/countries'); return res.data; },
  getById: async (id: string) => { const res = await apiClient.get(`/countries/${id}`); return res.data; },
  recommend: async (preferences: object) => { const res = await apiClient.post('/countries/recommend', preferences); return res.data; },
  compare: async (countryIds: string[], userPreferences?: object) => {
    const res = await apiClient.post('/countries/compare', { countryIds, userPreferences }); return res.data;
  },
  filter: async (filters: object) => { const res = await apiClient.post('/countries/filter', filters); return res.data; },
};