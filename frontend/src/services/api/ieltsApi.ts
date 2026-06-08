import apiClient from './client';

export const ieltsApi = {
  predictScore: async (scores: { reading: string; writing: string; listening: string; speaking: string }) => {
    const res = await apiClient.post('/ielts/predict', scores);
    return res.data;
  }
};
