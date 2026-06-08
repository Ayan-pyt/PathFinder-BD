import apiClient from './client';

export const communityApi = {
  getPosts: async (filters: { category?: string; country?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    
    const res = await apiClient.get(`/community?${params.toString()}`);
    return res.data;
  },
  createPost: async (data: { title: string; content: string; category: string; country?: string }) => {
    const res = await apiClient.post('/community', data);
    return res.data;
  },
  toggleUpvote: async (postId: string) => {
    const res = await apiClient.post(`/community/${postId}/upvote`);
    return res.data;
  },
  addComment: async (postId: string, content: string) => {
    const res = await apiClient.post(`/community/${postId}/comments`, { content });
    return res.data;
  }
};
