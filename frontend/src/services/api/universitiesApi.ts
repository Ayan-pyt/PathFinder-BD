import apiClient from './client';

export const universitiesApi = {
  getAll: async () => {
    const res = await apiClient.get('/universities');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/universities/${id}`);
    return res.data;
  },
  filter: async (filters: object) => {
    const res = await apiClient.post('/universities/filter', filters);
    return res.data;
  },
  getByCountry: async (countryCode: string) => {
    const res = await apiClient.get(`/universities/country/${countryCode}`);
    return res.data;
  },
  shortlist: async (universityId: string) => {
    const res = await apiClient.post('/universities/shortlist', { universityId });
    return res.data;
  },
  shortlistCountry: async (countryId: string) => {
    const res = await apiClient.post('/universities/shortlist-country', { countryId });
    return res.data;
  },
};

export const aiApi = {
  getRecommendation: async (profile: object) => {
    const res = await apiClient.post('/ai/recommend', profile);
    return res.data;
  },
};