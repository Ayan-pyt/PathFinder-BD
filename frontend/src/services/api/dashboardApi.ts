import apiClient from './client';

export interface MatchScore {
  name: string;
  score: number;
}

export interface Deadline {
  university: string;
  deadline: Date;
  daysRemaining: number;
  color: string;
}

export interface DocumentProgress {
  percentage: number;
  completed: string[];
  inProgress: string[];
  items: { name: string; status: string }[];
}

export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data.data;
  },
  bookmarkScholarship: async (data: { scholarshipId: string }) => {
    const res = await apiClient.post('/dashboard/bookmark-scholarship', data);
    return res.data;
  }
};